-- Site CMS content and published-only media access.
-- Drafts are stored separately from public snapshots; visitors never receive
-- draft columns through PostgREST.

begin;

create table public.cms_pages (
  slug text primary key,
  title text not null,
  seo_title text not null default '',
  seo_description text not null default '',
  draft_content jsonb not null default '{"sections":[]}'::jsonb,
  updated_at timestamptz not null default pg_catalog.now(),
  constraint cms_pages_slug_not_blank check (length(btrim(slug)) > 0),
  constraint cms_pages_draft_sections_array check (coalesce(jsonb_typeof(draft_content -> 'sections') = 'array', false))
);

create table public.cms_published_pages (
  slug text primary key references public.cms_pages(slug) on delete cascade,
  title text not null,
  seo_title text not null default '',
  seo_description text not null default '',
  content jsonb not null,
  published_at timestamptz not null default pg_catalog.now(),
  constraint cms_published_pages_sections_array check (coalesce(jsonb_typeof(content -> 'sections') = 'array', false))
);

create table public.cms_site_settings (
  id boolean primary key default true check (id),
  draft_settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default pg_catalog.now()
);

create table public.cms_published_settings (
  id boolean primary key default true check (id),
  settings jsonb not null default '{}'::jsonb,
  published_at timestamptz not null default pg_catalog.now()
);

insert into public.cms_site_settings (id) values (true);

create function public.sarraf_cms_media_is_published_20261112(p_path text)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select exists (
    select 1
    from public.cms_published_pages p
    cross join lateral pg_catalog.jsonb_array_elements(p.content -> 'sections') as blocks(block)
    where blocks.block ->> 'active' is distinct from 'false'
      and pg_catalog.position(p_path, blocks.block::text) > 0
  ) or exists (
    select 1 from public.cms_published_settings s
    where pg_catalog.position(p_path, s.settings::text) > 0
  );
$$;
revoke all on function public.sarraf_cms_media_is_published_20261112(text) from public, anon, authenticated;
grant execute on function public.sarraf_cms_media_is_published_20261112(text) to anon, authenticated;

-- Seed every existing public route as a draft starter. Existing pages remain
-- unchanged until an owner explicitly publishes a CMS version.
insert into public.cms_pages (slug, title, seo_title, seo_description, draft_content) values
('home', 'Home', 'Sarraf Properties | Real Estate in Goregaon & Malad, Mumbai', 'Find your next home or commercial space with Sarraf Properties in Mumbai.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','REAL ESTATE, THOUGHTFULLY GUIDED','title','Find your dream property','accent','in Mumbai.','body','Your trusted real estate partner in Goregaon & Malad.','button_label','Explore properties','button_url','#properties'),
  jsonb_build_object('id','about','type','text','eyebrow','A LOCAL NAME YOU CAN TRUST','title','About Sarraf Properties','body','We help clients find the right residential and commercial properties with professional guidance, personalized assistance and reliable real estate services.'),
  jsonb_build_object('id','services','type','services','title','Support for every property move.','body','Local, personal guidance across buying, selling, property search and investment.','items',jsonb_build_array(
    jsonb_build_object('id','home-service-1','title','Residential Property Consultation','body','Explore apartments, flats and homes suited to your needs, preferred neighbourhood and plans.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','home-service-2','title','Commercial Property Consultation','body','Discuss office, retail and business space requirements across Goregaon and Malad.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','home-service-3','title','Property Buying Assistance','body','Get clear guidance from initial search and property visits through your decision process.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','home-service-4','title','Property Selling Assistance','body','Plan your sale with attentive local support, thoughtful presentation and enquiry coordination.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','home-service-5','title','Property Investment Guidance','body','Talk through your goals and evaluate property options with a grounded local perspective.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','home-service-6','title','Real Estate Consultation','body','Get a personal conversation about the next step in your property journey.','button_label','Enquire','button_url','#contact')
  )),
  jsonb_build_object('id','properties','type','property-list','title','Featured properties','body','Explore published residential and commercial property options.')
))),
('about', 'About Us', 'About Sarraf Properties | Mumbai Real Estate', 'Meet Sarraf Properties, your trusted real estate partner in Goregaon and Malad.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','A LOCAL NAME YOU CAN TRUST','title','Real estate with a','accent','personal touch.','body','Sarraf Properties is a local real estate partner serving Goregaon and Malad, Mumbai. We bring professional guidance and attentive service to every property conversation.','button_label','Speak with us','button_url','#contact'),
  jsonb_build_object('id','intro','type','text','title','A trusted local real estate partner.','body','Sarraf Properties helps clients find the right residential and commercial property across Goregaon and Malad, Mumbai. Led by Rajan Sarraf, our approach is built around attentive service, local knowledge and dependable guidance.'),
  jsonb_build_object('id','values','type','text','eyebrow','WHAT GUIDES US','title','Good property decisions begin with trust.','body','Understand each client’s needs and provide practical, personal guidance. Make real estate decisions clearer through responsive support and local insight.')
))),
('residential-properties', 'Residential Properties', 'Residential Properties | Sarraf Properties', 'Explore residential property possibilities in Goregaon and Malad, Mumbai.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','FIND A PLACE TO CALL YOURS','title','Residential spaces','accent','for every chapter.','body','Explore residential property possibilities across Mumbai’s western suburbs, from apartments and flats to modern homes and residential projects.','button_label','Enquire about homes','button_url','#contact'),
  jsonb_build_object('id','intro','type','text','title','Find a home that feels right.','body','Explore luxury apartments, premium flats, residential projects and modern homes with guidance tailored to your preferences.'),
  jsonb_build_object('id','listings','type','property-list','title','Residential property options','body','Availability and property details are shared directly on enquiry.')
))),
('commercial-properties', 'Commercial Properties', 'Commercial Properties | Sarraf Properties', 'Discuss office, retail and commercial property options in Goregaon and Malad.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','SPACE TO DO BUSINESS','title','Commercial property','accent','with purpose.','body','Discover office, retail and business space opportunities across Goregaon and Malad with a local team ready to understand your requirements.','button_label','Discuss your requirements','button_url','#contact'),
  jsonb_build_object('id','intro','type','text','title','Find space for your business.','body','We can help you explore office spaces, retail shops, commercial buildings and flexible business spaces in the western suburbs.'),
  jsonb_build_object('id','listings','type','property-list','title','Commercial property options','body','Availability and property details are shared directly on enquiry.')
))),
('buy-property', 'Buy Property', 'Buy Property | Sarraf Properties', 'Get personal guidance buying a property in Goregaon, Malad and Mumbai.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','YOUR NEXT MOVE, WELL CONSIDERED','title','Buy property with','accent','clear guidance.','body','From narrowing down your search to making a confident decision, we help you navigate the property buying process with personal support.','button_label','Start a buying enquiry','button_url','#contact'),
  jsonb_build_object('id','intro','type','text','title','A clear path to your next home.','body','We start by understanding your budget, preferred areas, property type and timing. Together, we can define a search, arrange conversations and help you consider your options.'),
  jsonb_build_object('id','steps','type','text','eyebrow','YOUR PROPERTY JOURNEY','title','How we support buyers.','body','Share your requirements. Explore relevant options. Visit and consider properties. Make an informed decision.')
))),
('sell-property', 'Sell Property', 'Sell Property | Sarraf Properties', 'Speak with Sarraf Properties about selling a property in Mumbai.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','A THOUGHTFUL PROPERTY SALE','title','Sell with a local','accent','partner beside you.','body','Get personal assistance as you prepare to sell, understand your options and connect with prospective property seekers.','button_label','Discuss your sale','button_url','#contact'),
  jsonb_build_object('id','intro','type','text','title','Thoughtful support for your sale.','body','We listen to your goals, discuss your property and preferred timing, then help coordinate the conversations and next steps involved in your sale.'),
  jsonb_build_object('id','steps','type','text','eyebrow','YOUR SELLING JOURNEY','title','How we support sellers.','body','Share your property goals. Discuss a considered plan. Connect and coordinate enquiries. Move forward with support.')
))),
('services', 'Services', 'Real Estate Services | Sarraf Properties', 'Residential and commercial property consultation, buying, selling and investment guidance.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','HERE FOR EVERY STEP','title','Real estate, made','accent','more personal.','body','Considered support for residential and commercial property decisions, whether you are buying, selling or exploring your next move.','button_label','Make an enquiry','button_url','#contact'),
  jsonb_build_object('id','services','type','services','eyebrow','PERSONAL, LOCAL SUPPORT','title','Support for every property decision.','body','From a first conversation to a confident next step, our services are shaped around you.','items',jsonb_build_array(
    jsonb_build_object('id','service-page-1','title','Residential Property Consultation','body','Explore apartments, flats and homes suited to your needs, preferred neighbourhood and plans.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','service-page-2','title','Commercial Property Consultation','body','Discuss office, retail and business space requirements across Goregaon and Malad.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','service-page-3','title','Property Buying Assistance','body','Get clear guidance from initial search and property visits through your decision process.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','service-page-4','title','Property Selling Assistance','body','Plan your sale with attentive local support, thoughtful presentation and enquiry coordination.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','service-page-5','title','Property Investment Guidance','body','Talk through your goals and evaluate property options with a grounded local perspective.','button_label','Enquire','button_url','#contact'),
    jsonb_build_object('id','service-page-6','title','Real Estate Consultation','body','Get a personal conversation about the next step in your property journey.','button_label','Enquire','button_url','#contact')
  ))
))),
('locations', 'Locations', 'Locations in Goregaon & Malad | Sarraf Properties', 'Explore Sarraf Properties service locations in Goregaon and Malad, Mumbai.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','KNOW THE NEIGHBOURHOOD','title','Rooted in western','accent','Mumbai.','body','Local insight makes all the difference. We serve the neighbourhoods of Goregaon and Malad, Mumbai.','button_label','Ask about your area','button_url','#contact'),
  jsonb_build_object('id','goregaon','type','text','title','Goregaon','body','Residential communities, everyday amenities and business destinations across Mumbai’s western suburbs.'),
  jsonb_build_object('id','malad','type','text','title','Malad','body','Share your preferred neighbourhood and we’ll help you explore residential or commercial property possibilities nearby.')
))),
('gallery', 'Gallery', 'Property Gallery | Sarraf Properties', 'Browse residential and commercial property styles in Mumbai.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','A VISUAL PROPERTY JOURNEY','title','Spaces with','accent','possibility.','body','A curated visual showcase of residential and commercial styles. Images illustrate property types and are not current listings.','button_label','Discuss a property','button_url','#contact'),
  jsonb_build_object('id','gallery','type','gallery','title','Property gallery','body','Add and order images or video in the media library, then assign them to this section.')
))),
('contact', 'Contact Us', 'Contact Sarraf Properties | Mumbai', 'Contact Rajan Sarraf at Sarraf Properties by phone, WhatsApp, email or visit the Malad West office.', jsonb_build_object('sections', jsonb_build_array(
  jsonb_build_object('id','hero','type','hero','eyebrow','LET’S START A CONVERSATION','title','Tell us what','accent','you’re looking for.','body','Speak with Rajan Sarraf about your residential or commercial property needs in Goregaon, Malad or the surrounding Mumbai area.','button_label','Make an enquiry','button_url','#contact'),
  jsonb_build_object('id','contact','type','contact','title','Reach Rajan Sarraf directly.','body','Call, email or send a WhatsApp enquiry. Sarraf Properties serves Goregaon and Malad, Mumbai.')
)))
on conflict (slug) do nothing;

alter table public.cms_pages enable row level security;
alter table public.cms_published_pages enable row level security;
alter table public.cms_site_settings enable row level security;
alter table public.cms_published_settings enable row level security;

revoke all on public.cms_pages, public.cms_site_settings from public, anon;
revoke all on public.cms_published_pages, public.cms_published_settings from public;
grant select, insert, update, delete on public.cms_pages, public.cms_site_settings to authenticated;
grant select, insert, update, delete on public.cms_published_pages, public.cms_published_settings to authenticated;
grant select on public.cms_published_pages, public.cms_published_settings to anon, authenticated;

create policy sarraf_cms_pages_admin_all on public.cms_pages
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy sarraf_cms_published_pages_public_read on public.cms_published_pages
  for select to anon, authenticated using (true);
create policy sarraf_cms_published_pages_admin_write on public.cms_published_pages
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy sarraf_cms_settings_admin_all on public.cms_site_settings
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy sarraf_cms_published_settings_public_read on public.cms_published_settings
  for select to anon, authenticated using (true);
create policy sarraf_cms_published_settings_admin_write on public.cms_published_settings
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Restrict media metadata to media actually referenced by a published page
-- or published property. Admins may also see their drafts.
drop policy sarraf_media_assets_public_read on public.media_assets;
create policy sarraf_media_assets_published_read on public.media_assets
  for select to anon, authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    or (
      is_active and (
        (page_slug = 'properties' and public.sarraf_is_published_property_asset_20261112(id))
        or public.sarraf_cms_media_is_published_20261112(public.media_assets.file_path)
        or (public.media_assets.mobile_file_path is not null and public.sarraf_cms_media_is_published_20261112(public.media_assets.mobile_file_path))
        or (public.media_assets.thumbnail_file_path is not null and public.sarraf_cms_media_is_published_20261112(public.media_assets.thumbnail_file_path))
      )
    )
  );

-- Public media placement controls disclose no unpublished page content.
drop policy sarraf_media_slots_public_read on public.media_slots;
create policy sarraf_media_slots_public_read on public.media_slots
  for select to anon, authenticated
  using (
    exists (select 1 from public.cms_published_pages p where p.slug = media_slots.page_slug)
    or media_slots.page_slug = 'properties'
  );

-- In a private bucket, object downloads require SELECT permission on the
-- matching storage.objects row. Permit only published page/property paths.
create policy sarraf_site_media_published_select on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'site-media'
    and (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      or exists (
        select 1 from public.media_assets m
        where m.is_active
          and (m.file_path = storage.objects.name or m.mobile_file_path = storage.objects.name or m.thumbnail_file_path = storage.objects.name)
          and (
            (m.page_slug = 'properties' and public.sarraf_is_published_property_asset_20261112(m.id))
            or public.sarraf_cms_media_is_published_20261112(storage.objects.name)
          )
      )
    )
  );

commit;
