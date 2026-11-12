# Supabase media panel setup

The admin routes and media manager are implemented, but this repository currently has no Supabase project credentials or database schema. Uploads and sign-in stay unavailable until the following setup is complete.

## 1. Add the project credentials

Copy `.env.example` to a local `.env` and fill in the Supabase project URL and **anon/publishable** key. Do not place a service-role key in frontend environment variables. The bucket defaults to `site-media`; image and video limits are configurable in MB. Restart the development server after changing environment values.

## 2. Ask Lovable to create the media schema

This repository is connected to Lovable, and the project instructions require database changes to be made there rather than by hand in migration files. In Lovable, request the following schema and security setup:

> Create a minimal media-only backend for the existing SARRAF PROPERTIES `/admin/login` and `/admin` routes. Create `media_assets` with `id` UUID primary key, `page_slug` text, `section_key` text, `media_type` text constrained to image/video, `file_path` text, `public_url` text, `title` text, `alt_text` text, `caption` text, `sort_order` integer, `created_at` and `updated_at` timestamps, and an `is_active` boolean default true. Create `media_slots` with `page_slug`, `section_key`, `use_managed_media` boolean, and `updated_at`, unique on `(page_slug, section_key)`. Enable RLS. Public reads must return active media only and allow reading the slot switch. Only users whose trusted `auth.jwt()->'app_metadata'->>'role'` is `admin` may insert, update, delete either table. Create a public `site-media` Storage bucket with public reads and storage upload/update/delete policies restricted to this same app_metadata admin role. Do not enable public signup. Keep this limited to image/video media only.

The slot switch is important: after an admin enables managed media, removing the last uploaded file should hide the old bundled fallback image on the public site. Public media queries should only expose active rows.

## 3. Provision the administrator and bucket

Create the administrator account privately in Supabase Auth; do not add public registration. Set its trusted **app_metadata** role to `admin` (do not use user-editable `user_metadata`). Create the `site-media` bucket, or configure `VITE_SUPABASE_MEDIA_BUCKET` to match another bucket. Verify anonymous reads work while storage writes and all table mutations fail for non-admin users.

## 4. Existing local media

The current bundled site images remain as fallbacks. Upload replacement media into the matching page and section in the admin panel; the app then marks that placement as managed and the uploaded media appears on the public page. Existing bundled files are not deleted or automatically copied to Storage.

## Managed placement map

The dashboard lists ten pages with page sections for hero, intro, gallery, service rows, location visuals, and contact content. Public pages continue to use bundled media until that exact placement is enabled by an upload. The schema and bucket policies must be in place before enabling credentials in a deployed build.
