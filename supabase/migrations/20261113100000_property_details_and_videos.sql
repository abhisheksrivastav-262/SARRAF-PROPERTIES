-- Additive property detail fields and video relationships.
-- Existing property rows, image relations, media, and RLS remain intact.

begin;

alter table public.properties
  add column if not exists area_unit text not null default 'sq ft',
  add column if not exists amenities text[] not null default array[]::text[];

create table if not exists public.property_videos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  media_asset_id uuid not null unique references public.media_assets(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_videos_property_order_idx
  on public.property_videos (property_id, sort_order, created_at);

drop trigger if exists sarraf_property_videos_updated_at on public.property_videos;
create trigger sarraf_property_videos_updated_at
  before update on public.property_videos
  for each row execute function public.sarraf_properties_media_set_updated_at_20261112();

alter table public.property_videos enable row level security;
revoke all privileges
  on table public.property_videos
  from public, anon, authenticated, service_role;

grant select
  on table public.property_videos
  to anon;

grant select, insert, update, delete
  on table public.property_videos
  to authenticated;

grant all privileges
  on table public.property_videos
  to service_role;

drop policy if exists sarraf_property_videos_public_read on public.property_videos;
create policy sarraf_property_videos_public_read
  on public.property_videos for select to anon, authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_videos.property_id
        and (p.status = 'published' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
    and exists (
      select 1 from public.media_assets m
      where m.id = property_videos.media_asset_id
        and m.media_type = 'video'
        and (m.is_active or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
    )
  );

drop policy if exists sarraf_property_videos_admin_write on public.property_videos;
create policy sarraf_property_videos_admin_write
  on public.property_videos for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.sarraf_is_published_property_asset_20261112(asset_id uuid)
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
  ) or exists (
    select 1
    from public.property_videos as property_video
    join public.properties as property on property.id = property_video.property_id
    where property_video.media_asset_id = asset_id
      and property.status = 'published'
  );
$$;
revoke all on function public.sarraf_is_published_property_asset_20261112(uuid) from public;
grant execute on function public.sarraf_is_published_property_asset_20261112(uuid) to anon, authenticated;

commit;
