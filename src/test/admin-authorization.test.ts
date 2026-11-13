import { describe, expect, it } from "vitest";
import type { User } from "@supabase/supabase-js";
import { isMediaAdmin } from "@/lib/supabase";

describe("admin claim authorization", () => {
  it("accepts only a trusted app_metadata admin role", () => {
    expect(isMediaAdmin({ app_metadata: { role: "admin" }, user_metadata: {} } as unknown as User)).toBe(true);
    expect(isMediaAdmin({ app_metadata: { roles: ["admin"] }, user_metadata: {} } as unknown as User)).toBe(true);
    expect(isMediaAdmin({ app_metadata: {}, user_metadata: { role: "admin" } } as unknown as User)).toBe(false);
    expect(isMediaAdmin({ app_metadata: {}, user_metadata: { roles: ["admin"] } } as unknown as User)).toBe(false);
  });
});
