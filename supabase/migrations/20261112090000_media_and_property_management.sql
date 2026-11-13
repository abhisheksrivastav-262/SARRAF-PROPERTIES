-- Sarraf Properties media and property management schema.
-- Additive migration: it creates tables/policies/bucket configuration only.
-- It does not delete or rewrite existing application rows or Storage objects.

begin;

-- Storage RLS policies combine permissively. Abort rather than silently
-- leaving an existing policy that could broaden access to site-media.
do $$
begin
  if exists (
    select 1
    from pg_catalog.pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and roles && array['public', 'anon', 'authenticated']::name[]
  ) then
    raise exception 'Existing storage.objects policies need a read-only security review before this migration can proceed';
  end if;
end;
$$;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  media_type text not null check (media_type in ('image', 'video')),
  file_path text not null unique,
  public_url text not null,
  description text not null default '',
  mobile_file_path text,
  thumbnail_file_path text,
  title text not null default '',
  alt_text text not null default '',
  caption text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint media_assets_page_slug_not_blank check (length(btrim(page_slug)) > 0),
  constraint media_assets_section_key_not_blank check (length(btrim(section_key)) > 0)
);

create table public.media_slots (
  page_slug text not null,
  section_key text not null,
  use_managed_media boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (page_slug, section_key),
  constraint media_slots_page_slug_not_blank check (length(btrim(page_slug)) > 0),
  constraint media_slots_section_key_not_blank check (length(btrim(section_key)) > 0)
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  property_type text not null check (property_type in ('residential', 'commercial')),
  description text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  location text not null,
  city text not null default 'Mumbai',
  address text,
  price numeric(14, 2) check (price is null or price >= 0),
  currency text not null default 'INR',
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  area_sqft numeric(12, 2) check (area_sqft is null or area_sqft >= 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint properties_title_not_blank check (length(btrim(title)) > 0),
  constraint properties_slug_not_blank check (length(btrim(slug)) > 0),
  constraint properties_location_not_blank check (length(btrim(location)) > 0)
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  media_asset_id uuid not null unique references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index media_assets_page_section_order_idx
  on public.media_assets (page_slug, section_key, sort_order, created_at desc);
create index media_assets_active_idx
  on public.media_assets (is_active, page_slug, section_key);
create index properties_public_listing_idx
  on public.properties (property_type, status, featured desc, sort_order, created_at desc);
create index property_images_property_order_idx
  on public.property_images (property_id, sort_order, created_at);

create function public.sarraf_properties_media_set_updated_at_20261112()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;
revoke all on function public.sarraf_properties_media_set_updated_at_20261112() from public;
revoke all on function public.sarraf_properties_media_set_updated_at_20261112() from anon, authenticated;

create trigger sarraf_media_assets_updated_at
  before update on public.media_assets
  for each row execute function public.sarraf_properties_media_set_updated_at_20261112();

create trigger sarraf_media_slots_updated_at
  before update on public.media_slots
  for each row execute function public.sarraf_properties_media_set_updated_at_20261112();

create trigger sarraf_properties_updated_at
  before update on public.properties
  for each row execute function public.sarraf_properties_media_set_updated_at_20261112();

create trigger sarraf_property_images_updated_at
  before update on public.property_images
  for each row execute function public.sarraf_properties_media_set_updated_at_20261112();

-- Do not assume media metadata is public just because Storage is public. A
-- property image asset is readable only when linked to a published property.
create function public.sarraf_is_published_property_asset_20261112(asset_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from public.property_images as property_image
    join public.properties as property on property.id = property_image.property_id
    where property_image.media_asset_id = asset_id
      and property.status = 'published'
  );
$$;
revoke all on function public.sarraf_is_published_property_asset_20261112(uuid) from public;
grant execute on function public.sarraf_is_published_property_asset_20261112(uuid) to anon, authenticated;

alter table public.media_assets enable row level security;
alter table public.media_slots enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;

grant select on public.media_assets, public.media_slots, public.properties, public.property_images to anon, authenticated;
grant insert, update, delete on public.media_assets, public.media_slots, public.properties, public.property_images to authenticated;

create policy sarraf_media_assets_public_read
  on public.media_assets for select to anon, authenticated
  using (
    (is_active and (page_slug <> 'properties' or public.sarraf_is_published_property_asset_20261112(id)))
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy sarraf_media_assets_admin_write
  on public.media_assets for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy sarraf_media_slots_public_read
  on public.media_slots for select to anon, authenticated
  using (true);

create policy sarraf_media_slots_admin_write
  on public.media_slots for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy sarraf_properties_public_read
  on public.properties for select to anon, authenticated
  using (status = 'published' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy sarraf_properties_admin_write
  on public.properties for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy sarraf_property_images_public_read
  on public.property_images for select to anon, authenticated
  using (
    exists (
      select 1
      from public.properties p
      where p.id = property_images.property_id
        and (p.status = 'published' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
    and exists (
      select 1
      from public.media_assets m
      where m.id = property_images.media_asset_id
        and (m.is_active or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
        and m.media_type = 'image'
    )
  );

create policy sarraf_property_images_admin_write
  on public.property_images for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Create the private bucket or tighten visibility on the existing bucket while
-- preserving its upload limits and MIME configuration.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  false,
  262144000,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
)
on conflict (id) do update set public = false;

create policy sarraf_site_media_admin_select
  on storage.objects for select to authenticated
  using (bucket_id = 'site-media' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy sarraf_site_media_admin_insert
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'site-media'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy sarraf_site_media_admin_update
  on storage.objects for update to authenticated
  using (
    bucket_id = 'site-media'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'site-media'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy sarraf_site_media_admin_delete
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'site-media'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

commit;
