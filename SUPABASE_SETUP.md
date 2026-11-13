# Supabase setup: Sarraf Properties CMS

This project continues to use the existing Supabase project and existing owner account. Migrations 1–5 have been successfully applied to Supabase Production. Do not re-run them as part of deployment.

1. [`20261112090000_media_and_property_management.sql`](supabase/migrations/20261112090000_media_and_property_management.sql) — property/media schema, relationships, indexes, RLS, and a private `site-media` bucket.
2. [`20261112100000_admin_owner_authorization_lock.sql`](supabase/migrations/20261112100000_admin_owner_authorization_lock.sql) — one-time atomic lock used by the existing-owner authorization endpoint.
3. [`20261112110000_site_cms.sql`](supabase/migrations/20261112110000_site_cms.sql) — draft and published page/settings tables, all current public route templates, and public access limited to published media references.
4. [`20261113100000_property_details_and_videos.sql`](supabase/migrations/20261113100000_property_details_and_videos.sql) — adds `area_unit`, `amenities`, a `property_videos` relation, published-property RLS, and video-aware media visibility without changing existing property/image rows.
5. [`20261113110000_published_media_item_guard.sql`](supabase/migrations/20261113110000_published_media_item_guard.sql) — excludes media belonging to inactive CMS gallery/service items from public visibility checks.

All five migrations were successfully applied to the existing Supabase Production project. Do not run their SQL again, use `supabase db push`, or otherwise change the production database as part of this deployment.

## Environment variables

The public client uses these existing values:

| Variable                     | Purpose                                     | Required |
| ---------------------------- | ------------------------------------------- | -------- |
| `VITE_SUPABASE_URL`          | Existing Supabase project URL               | Yes      |
| `VITE_SUPABASE_ANON_KEY`     | Existing anon/publishable key               | Yes      |
| `VITE_SUPABASE_MEDIA_BUCKET` | Storage bucket; defaults to `site-media`    | Optional |
| `VITE_MEDIA_IMAGE_MAX_MB`    | Client-side image limit; defaults to 20 MB  | Optional |
| `VITE_MEDIA_VIDEO_MAX_MB`    | Client-side video limit; defaults to 250 MB | Optional |

No service-role key is required by the CMS client. Never put a service-role key in a `VITE_*` variable, browser code, or committed file. The existing-owner bootstrap endpoint separately uses server-only values described in the owner setup section below.

## What the CMS manages

- The page editor is seeded for Home, About, Residential Properties, Commercial Properties, Buy Property, Sell Property, Services, Locations, Gallery, and Contact Us.
- Each page supports draft text/SEO and ordered sections. Sections support hero, text, image, gallery, video, services, property list, contact, and CTA layouts. Text, headings, links, media, mobile image variants, captions, alt text, and video thumbnails can be edited.
- Published page snapshots live separately from drafts. Public database access never selects draft page/settings rows.
- The shared settings editor manages the header logo, phone, WhatsApp number, email, address, social links, and footer description. Draft settings are kept separate from published settings.
- Property management uses `properties`, `property_images`, and (after migration 4) `property_videos`. Property area units and amenities use the new `area_unit` and `amenities` columns. Public queries only return published listings and active linked media.
- Each property detail page's SEO title and description are editable alongside the property record.

Existing hard-coded pages remain live until you explicitly publish a CMS version for that page. For a page without a published CMS version, the editor opens a mapped snapshot of the current site content while retaining the database draft separately. Use “Restore saved CMS draft” to switch back. Saving or publishing is always an explicit action; review the preview and page-specific content first. The source inventory is in [`CMS_CONTENT_INVENTORY.md`](CMS_CONTENT_INVENTORY.md).

## Storage and publication security

The media migration creates or changes `site-media` to a **private** bucket. It preserves existing objects and upload size/MIME settings, but changing a previously public bucket to private stops direct public-URL access. The website requests signed URLs for media referenced by a published page, published setting, or published property. Admins with `app_metadata.role = 'admin'` can upload, update, preview, and delete files. Visitors cannot read draft page rows or draft media paths. Deactivating a CMS section removes its media from public signed-URL eligibility.

The first migration has a conservative Storage-policy preflight: it aborts if any existing `storage.objects` policy applies to `public`, `anon`, or `authenticated`, even when that policy may be restricted to another bucket. Inspect existing Storage policies before applying. If unrelated policies exist, stop and revise the preflight only after reviewing their `USING` and `WITH CHECK` scopes; do not remove or overwrite existing policies blindly.

Making an existing bucket private changes object visibility but does not delete objects. If the current site relies on old public media URLs, those files will not be publicly fetchable until they are referenced from published CMS/property data and served through the signed-URL path. Back up the existing schema and confirm the desired visibility before approval.

## Existing owner authorization

The app retains the one-time `/admin/setup` flow and `/api/admin/bootstrap` endpoint. It authenticates the existing owner with Supabase Auth, checks the exact configured owner email, then uses the server-side Auth Admin API to preserve `app_metadata` and set `role = 'admin'`. It does not create an account or change a password. The service-role key and bootstrap secret are server-only; `user_metadata` is never trusted for admin access.

The lock migration is required before `/admin/setup` can authorize the owner. The temporary production server values are `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_BOOTSTRAP_EMAIL`, and a random `ADMIN_BOOTSTRAP_SECRET` of at least 32 characters. Do not set these as `VITE_*` values. After authorization and verification, remove the temporary values and redeploy to disable the endpoint.

## Production deployment and owner setup

The application is configured to build for Vercel. Before deployment, verify these values in the Vercel **Production** environment for the same existing Supabase project:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the public Supabase client.
- `SUPABASE_URL` matching `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for the server-only authorization endpoint.
- `ADMIN_BOOTSTRAP_EMAIL` matching the existing owner's Auth email and `ADMIN_BOOTSTRAP_SECRET` with at least 32 characters.

Never use a `VITE_` prefix for the service-role key or bootstrap secret. Migrations 1–5 are already applied. Do not run `supabase db push`, `db reset`, migration repair, or any migration SQL for this deployment.

Deploy the reviewed application code to Vercel, then open `/admin/setup` and sign in with the existing owner account. The server promotes that same user through Supabase Auth Admin API, preserves existing `app_metadata`, and does not create an account or change its password. Sign in again at `/admin/login` and verify `/admin` access. Once authorization is confirmed, remove the temporary server-only bootstrap values from Vercel Production and redeploy to disable the one-time endpoint.

After deployment, verify page publishing, property management, image/video upload and signed previews, and anon access restrictions. The application build and UI tests do not independently prove live Supabase RLS or Storage behavior.
