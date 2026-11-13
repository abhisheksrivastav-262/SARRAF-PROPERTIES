import { createFileRoute } from "@tanstack/react-router";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const promotionsInFlight = new Set<string>();

function json(body: { error?: string; message?: string }, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function hasAdminRole(user: User) {
  const metadata = user.app_metadata as { role?: string; roles?: string[] } | null;
  return metadata?.role === "admin" || metadata?.roles?.includes("admin") === true;
}

export const Route = createFileRoute("/api/admin/bootstrap")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin) return json({ error: "Request rejected." }, 403);
        if (request.headers.get("sec-fetch-site") === "cross-site") return json({ error: "Request rejected." }, 403);
        const accessToken = request.headers.get("authorization")?.match(/^Bearer ([^\s]+)$/i)?.[1];
        if (!accessToken || accessToken.length > 8192) return json({ error: "Sign in with the configured owner account first." }, 401);

        const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
        const supabaseUrl = process.env["SUPABASE_URL"];
        const expectedEmail = process.env["ADMIN_BOOTSTRAP_EMAIL"]?.trim().toLowerCase();
        const bootstrapSecret = process.env["ADMIN_BOOTSTRAP_SECRET"];
        // The secret is a server-side enablement gate only; the owner is authenticated by Supabase.
        // It is intentionally never accepted from or returned to the browser.
        if (!serviceKey || !supabaseUrl || !expectedEmail || !bootstrapSecret || bootstrapSecret.trim().length < 32) {
          return json({ error: "Owner authorization is disabled. Required server-only setup values are missing or invalid." }, 503);
        }

        let adminClient: SupabaseClient;
        try {
          adminClient = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          });
        } catch {
          return json({ error: "Owner authorization is not configured correctly. No account changes were made." }, 503);
        }

        // Verify the bearer token with Supabase Auth; never trust a user ID/email from the request body.
        let sessionUser: User | null = null;
        try {
          const { data, error } = await adminClient.auth.getUser(accessToken);
          if (error) return json({ error: "The signed-in account is not the configured owner account." }, 403);
          sessionUser = data.user;
        } catch {
          return json({ error: "The signed-in owner session could not be verified. No account changes were made." }, 503);
        }
        if (!sessionUser?.email || sessionUser.email.trim().toLowerCase() !== expectedEmail) {
          return json({ error: "The signed-in account is not the configured owner account." }, 403);
        }

        if (promotionsInFlight.has(sessionUser.id)) return json({ error: "Owner authorization is already in progress. Please wait and try again." }, 409);
        promotionsInFlight.add(sessionUser.id);
        const claimToken = randomUUID();
        let sharedLockClaimed = false;
        let sharedLockCompleted = false;
        try {
          const { data: claimed, error: lockError } = await adminClient.rpc("sarraf_claim_admin_authorization_lock_20261112", {
            p_claim_token: claimToken,
          });
          if (lockError) return json({ error: "The one-time authorization lock is unavailable. No account changes were made." }, 503);
          if (claimed !== true) return json({ error: "Owner authorization has already been used or is in progress." }, 409);
          sharedLockClaimed = true;

          let target: User | undefined;
          let anotherAdminExists = false;
          for (let page = 1; ; page += 1) {
            const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
            if (error) return json({ error: "Could not verify the existing Auth account. No changes were made." }, 503);
            target = data.users.find(user => user.id === sessionUser.id && user.email?.trim().toLowerCase() === expectedEmail) || target;
            if (data.users.some(user => user.id !== sessionUser.id && hasAdminRole(user))) anotherAdminExists = true;
            if (data.users.length < 1000) break;
          }

          if (!target) return json({ error: "The configured owner account could not be found. No changes were made." }, 404);
          if (anotherAdminExists) return json({ error: "Another administrator already exists. No changes were made." }, 409);
          if ((target.app_metadata as { role?: string } | null)?.["role"] === "admin") {
            return json({ error: "This account is already authorized. No changes were made." }, 409);
          }

          const oldMetadata = (target.app_metadata || {}) as Record<string, unknown>;
          const nextMetadata = { ...oldMetadata, role: "admin" };
          const { error: updateError } = await adminClient.auth.admin.updateUserById(target.id, {
            app_metadata: nextMetadata,
          });
          if (updateError) return json({ error: "Supabase could not authorize the existing owner account." }, 503);

          const { data: verified, error: verifyError } = await adminClient.auth.admin.getUserById(target.id);
          const verifiedMetadata = (verified.user?.app_metadata || {}) as Record<string, unknown>;
          const preservedFields = Object.entries(oldMetadata).every(([key, value]) =>
            key === "role" || JSON.stringify(verifiedMetadata[key]) === JSON.stringify(value),
          );
          if (verifyError || verifiedMetadata["role"] !== "admin" || !preservedFields) {
            return json({ error: "The authorization change could not be verified. Contact the project owner before retrying." }, 503);
          }

          const { data: completed, error: completeError } = await adminClient.rpc("sarraf_complete_admin_authorization_lock_20261112", {
            p_claim_token: claimToken,
          });
          if (completeError || completed !== true) {
            return json({ error: "The admin role was verified, but one-time completion could not be recorded. Do not retry until the project owner reviews the setup." }, 503);
          }
          sharedLockCompleted = true;

          return json({ message: "The existing owner account is authorized. Sign in again to refresh its admin session." });
        } catch {
          return json({ error: "Owner authorization failed safely. No account or password was created or changed." }, 503);
        } finally {
          if (sharedLockClaimed && !sharedLockCompleted) {
            try {
              await adminClient.rpc("sarraf_release_admin_authorization_lock_20261112", { p_claim_token: claimToken });
            } catch {
              // A stranded pending lock is fail-closed and requires owner review.
            }
          }
          promotionsInFlight.delete(sessionUser.id);
        }
      },
    },
  },
});
