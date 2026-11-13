-- Restrict public media visibility to paths used by active published content.
-- In particular, inactive gallery/service items must not expose their media.

begin;

create or replace function public.sarraf_cms_media_is_published_20261112(p_path text)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select p_path is not null and (
    exists (
      select 1
      from public.cms_published_pages as page
      cross join lateral pg_catalog.jsonb_array_elements(page.content -> 'sections') as section(block)
      cross join lateral (
        select coalesce(
          section.block ->> 'type' = 'services'
          or (
            section.block ->> 'type' = 'gallery'
            and case
              when pg_catalog.jsonb_typeof(section.block -> 'items') = 'array'
                then pg_catalog.jsonb_array_length(section.block -> 'items') > 0
              else false
            end
          ),
          false
        ) as suppress_parent_media
      ) as section_state
      where section.block ->> 'active' is distinct from 'false'
        and (
          (
            not section_state.suppress_parent_media
            and exists (
              select 1
              from pg_catalog.regexp_split_to_table(
                coalesce(section.block ->> 'media_path', ''),
                E'\n'
              ) as section_path(path)
              where pg_catalog.btrim(section_path.path) = p_path
            )
          )
          or (
            not section_state.suppress_parent_media
            and section.block ->> 'mobile_media_path' = p_path
          )
          or (
            section.block ->> 'thumbnail_path' = p_path
            and (
              not section_state.suppress_parent_media
              or exists (
                select 1
                from pg_catalog.jsonb_array_elements(
                  case
                    when pg_catalog.jsonb_typeof(section.block -> 'items') = 'array'
                      then section.block -> 'items'
                    else '[]'::jsonb
                  end
                ) as video_item(value)
                where video_item.value ->> 'active' is distinct from 'false'
                  and section.block ->> 'type' = 'gallery'
                  and coalesce(video_item.value ->> 'media_path', '') ~* E'\\.(mp4|webm)$'
              )
            )
          )
          or exists (
            select 1
            from pg_catalog.jsonb_array_elements(
              case
                when pg_catalog.jsonb_typeof(section.block -> 'items') = 'array'
                  then section.block -> 'items'
                else '[]'::jsonb
              end
            ) as item(value)
            where section.block ->> 'type' in ('gallery', 'services')
              and item.value ->> 'active' is distinct from 'false'
              and (
                item.value ->> 'media_path' = p_path
                or item.value ->> 'video_path' = p_path
                or exists (
                  select 1
                  from pg_catalog.regexp_split_to_table(
                    coalesce(item.value ->> 'additional_media_paths', ''),
                    E'\n'
                  ) as item_path(path)
                  where pg_catalog.btrim(item_path.path) = p_path
                )
              )
          )
        )
    )
    or exists (
      select 1
      from public.cms_published_settings as settings
      where settings.settings ->> 'logo_path' = p_path
         or settings.settings ->> 'favicon_path' = p_path
    )
  );
$$;

revoke all on function public.sarraf_cms_media_is_published_20261112(text) from public;
grant execute on function public.sarraf_cms_media_is_published_20261112(text) to anon, authenticated;

commit;
