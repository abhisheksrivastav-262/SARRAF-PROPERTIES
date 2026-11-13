import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import {
  signedMediaUrl,
  usePublishedSiteSettings,
  type CmsPage,
  type CmsSection,
  type PublishedSiteSettings,
} from "@/lib/cms";
import { openEnquiryForm } from "@/components/site/SiteLayout";
import { PropertyListings } from "@/components/site/PropertyListings";

const serviceNames = [
  "Residential Property Consultation",
  "Commercial Property Consultation",
  "Property Buying Assistance",
  "Property Selling Assistance",
  "Property Investment Guidance",
  "Real Estate Consultation",
];
const serviceIcons = [Home, Building2, ShieldCheck, Sparkles, TrendingUp, MessageCircle];
function linkTarget(value?: string) {
  if (!value) return "#contact";
  const safe = value.trim();
  return safe.startsWith("/") || safe.startsWith("#") || /^(https?:|tel:|mailto:)/i.test(safe)
    ? safe
    : "#contact";
}

export function CmsPageView({ slug, fallback }: { slug: string; fallback: ReactNode }) {
  const db = getSupabase();
  const siteSettings = usePublishedSiteSettings();
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [media, setMedia] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    void Promise.resolve(
      db
        ?.from("cms_published_pages")
        .select("slug,title,seo_title,seo_description,content,published_at")
        .eq("slug", slug)
        .maybeSingle()
        .then(({ data }) => {
          if (!alive) return;
          setPage(data as CmsPage | null);
          setLoaded(true);
        }),
    ).catch(() => {
      if (alive) setLoaded(true);
    });
    if (!db) setLoaded(true);
    return () => {
      alive = false;
    };
  }, [db, slug]);
  useEffect(() => {
    if (!page) return;
    let alive = true;
    const paths = [
      ...new Set(
        page.content.sections
          .flatMap((section) => [
            section.media_path,
            section.mobile_media_path,
            section.thumbnail_path,
            ...(section.items || []).flatMap((item) => [
              item.media_path,
              item.video_path,
              ...(item.additional_media_paths || "").split("\n"),
            ]),
          ])
          .flatMap((path) =>
            (path || "")
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
      ),
    ];
    void Promise.all(paths.map(async (path) => [path, await signedMediaUrl(path)] as const)).then(
      (results) => {
        if (alive) setMedia(Object.fromEntries(results));
      },
    );
    return () => {
      alive = false;
    };
  }, [page]);
  useEffect(() => {
    if (!page || typeof document === "undefined") return;
    document.title = page.seo_title || page.title || siteSettings.default_seo_title;
    const seoDescription = page.seo_description || siteSettings.default_seo_description;
    if (seoDescription) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = "description";
        document.head.append(tag);
      }
      tag.content = seoDescription;
    }
  }, [page, siteSettings]);
  if (!loaded || !page) return <>{fallback}</>;
  return (
    <main className={`cms-page cms-page-${slug}`}>
      {page.content.sections
        .filter((section) => section.active !== false)
        .map((section) => (
          <CmsSectionView
            key={section.id}
            slug={slug}
            section={section}
            media={media}
            settings={siteSettings}
          />
        ))}
      {!page.content.sections.some(
        (section) => section.active !== false && section.type === "cta",
      ) && <PublishedGlobalCta settings={siteSettings} />}
    </main>
  );
}

export function CmsDocumentPreview({
  slug,
  content,
}: {
  slug: string;
  content: CmsPage["content"];
}) {
  const settings = usePublishedSiteSettings();
  const [media, setMedia] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    const paths = [
      ...new Set(
        content.sections
          .flatMap((section) => [
            section.media_path,
            section.mobile_media_path,
            section.thumbnail_path,
            ...(section.items || []).flatMap((item) => [
              item.media_path,
              item.video_path,
              ...(item.additional_media_paths || "").split("\n"),
            ]),
          ])
          .flatMap((path) =>
            (path || "")
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
      ),
    ];
    void Promise.all(paths.map(async (path) => [path, await signedMediaUrl(path)] as const)).then(
      (results) => {
        if (alive) setMedia(Object.fromEntries(results));
      },
    );
    return () => {
      alive = false;
    };
  }, [content]);

  return (
    <main className={`cms-page cms-page-${slug} cms-preview-page`}>
      {content.sections
        .filter((section) => section.active !== false)
        .map((section) => (
          <CmsSectionView
            key={section.id}
            slug={slug}
            section={section}
            media={media}
            settings={settings}
          />
        ))}
      {!content.sections.some((section) => section.active !== false && section.type === "cta") && (
        <PublishedGlobalCta settings={settings} />
      )}
    </main>
  );
}

function PublishedGlobalCta({ settings }: { settings: PublishedSiteSettings }) {
  return (
    <section className="cta-band cms-cta">
      <div className="section-wrap">
        <div>
          <div className="eyebrow">
            <span />
            SARRAF PROPERTIES
          </div>
          <h2>{settings.global_cta_title}</h2>
          <p>{settings.global_cta_description}</p>
        </div>
        <div className="cta-actions">
          <button className="button-gold" type="button" onClick={() => openEnquiryForm()}>
            {settings.global_cta_label} <ArrowRight />
          </button>
          <a className="button-outline" href={`tel:${settings.phone}`}>
            Call now <Phone />
          </a>
        </div>
      </div>
    </section>
  );
}

function CmsSectionView({
  section,
  media,
  slug,
  settings,
}: {
  section: CmsSection;
  media: Record<string, string>;
  slug: string;
  settings: PublishedSiteSettings;
}) {
  const [galleryCategory, setGalleryCategory] = useState("All");
  useEffect(() => setGalleryCategory("All"), [slug, section.id]);
  const button = section.button_label && (
    <a className="button-gold" href={linkTarget(section.button_url)}>
      {section.button_label}
      <ArrowRight />
    </a>
  );
  const body = section.body?.split(/\n\s*\n/).filter(Boolean) || [];
  const mediaPaths = (section.media_path || "")
    .split("\n")
    .map((path) => path.trim())
    .filter(Boolean);
  const mediaUrl = media[mediaPaths[0] || ""];
  const isVideo = mediaPaths[0]?.match(/\.(mp4|webm)$/i);
  const image = mediaUrl && (
    <picture className="cms-media-frame">
      {section.mobile_media_path && media[section.mobile_media_path] && (
        <source media="(max-width: 700px)" srcSet={media[section.mobile_media_path]} />
      )}
      <img
        src={mediaUrl}
        alt={section.alt_text || section.media_title || ""}
        title={section.media_title || undefined}
      />
    </picture>
  );
  if (section.type === "hero")
    return (
      <section className="cms-hero">
        <div className="cms-hero-media">
          {isVideo && mediaUrl ? (
            <video
              src={mediaUrl}
              poster={section.thumbnail_path ? media[section.thumbnail_path] : undefined}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            image
          )}
        </div>
        <div className="cms-hero-shade" />
        <div className="cms-hero-content">
          <div className="eyebrow">
            <span />
            {section.eyebrow}
          </div>
          <h1>
            {section.title} {section.accent && <em>{section.accent}</em>}
          </h1>
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {button}
        </div>
      </section>
    );
  if (section.type === "property-list") {
    const propertyType =
      slug === "residential-properties"
        ? "residential"
        : slug === "commercial-properties"
          ? "commercial"
          : undefined;
    return (
      <section id="properties" className="cms-content-section">
        <div className="section-wrap">
          <ContentHeading section={section} />
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <PropertyListings
            {...(propertyType ? { propertyType } : {})}
            featuredOnly={slug === "home"}
          />
        </div>
      </section>
    );
  }
  if (section.type === "services") {
    const items: NonNullable<CmsSection["items"]> = section.items?.length
      ? section.items
      : serviceNames.map((title, index) => ({
          id: String(index),
          title,
          body: "Talk with our team about your property requirements and next steps.",
          button_label: "Enquire",
          button_url: "#contact",
          media_path: "",
          alt_text: "",
        }));
    return (
      <section className="cms-content-section">
        <div className="section-wrap">
          <ContentHeading section={section} />
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <div className="cms-services-grid">
            {items
              .filter((item) => item.active !== false)
              .map((item, index) => {
                const Icon = serviceIcons[index] || Home;
                const featureList = (item.features || "")
                  .split("\n")
                  .map((feature) => feature.trim())
                  .filter(Boolean);
                const additionalMedia = (item.additional_media_paths || "")
                  .split("\n")
                  .map((path) => path.trim())
                  .filter(Boolean);
                return (
                  <article key={item.id}>
                    <Icon />
                    {item.media_path && media[item.media_path] && (
                      <img
                        className="cms-service-image"
                        src={media[item.media_path]}
                        alt={item.alt_text || item.title}
                      />
                    )}
                    <span>0{index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    {item.full_description && <p>{item.full_description}</p>}
                    {featureList.length > 0 && (
                      <ul>
                        {featureList.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    )}
                    {additionalMedia.map((path) =>
                      path.match(/\.(mp4|webm)$/i) ? (
                        <video
                          key={path}
                          className="cms-service-video"
                          src={media[path]}
                          controls
                          preload="metadata"
                        />
                      ) : media[path] ? (
                        <img
                          key={path}
                          className="cms-service-image"
                          src={media[path]}
                          alt={item.alt_text || item.title}
                        />
                      ) : null,
                    )}
                    {item.video_path && media[item.video_path] && (
                      <video
                        className="cms-service-video"
                        src={media[item.video_path]}
                        controls
                        preload="metadata"
                      />
                    )}
                    {item.button_url === "#contact" || !item.button_url ? (
                      <button type="button" onClick={() => openEnquiryForm(item.title)}>
                        {item.button_label || "Enquire"} <ArrowRight />
                      </button>
                    ) : (
                      <a href={linkTarget(item.button_url)}>
                        {item.button_label || "Enquire"} <ArrowRight />
                      </a>
                    )}
                    <a href={`tel:${settings.phone}`}>
                      Call us <Phone />
                    </a>
                  </article>
                );
              })}
          </div>
          {button}
        </div>
      </section>
    );
  }
  if (section.type === "gallery")
    return (
      <section className="cms-content-section">
        <div className="section-wrap">
          <ContentHeading section={section} />
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {section.items?.some((item) => item.body) && (
            <div className="cms-gallery-filter" role="group" aria-label="Filter gallery items">
              {["All", ...new Set(section.items.map((item) => item.body).filter(Boolean))].map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={galleryCategory === category}
                    className={galleryCategory === category ? "selected" : ""}
                    onClick={() => setGalleryCategory(category)}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
          )}
          <div className="cms-gallery-grid">
            {(section.items?.length
              ? section.items
                  .filter(
                    (item) =>
                      item.active !== false &&
                      (galleryCategory === "All" || item.body === galleryCategory),
                  )
                  .map((item) => ({ ...item, path: item.media_path || "" }))
              : mediaPaths.map((path, index) => ({
                  id: `${path}-${index}`,
                  title: section.media_title || section.caption || "",
                  body: "",
                  alt_text: section.alt_text || "",
                  path,
                }))
            ).map((item) => (
              <figure key={item.id}>
                {item.path.match(/\.(mp4|webm)$/i) ? (
                  <video
                    src={media[item.path]}
                    controls
                    preload="metadata"
                    poster={section.thumbnail_path ? media[section.thumbnail_path] : undefined}
                  />
                ) : (
                  <img
                    src={media[item.path]}
                    alt={item.alt_text || item.title || section.alt_text || ""}
                  />
                )}
                <figcaption>
                  {item.title}
                  {item.body ? ` · ${item.body}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
          {button}
        </div>
      </section>
    );
  if (section.type === "contact")
    return (
      <section className="cms-content-section cms-contact-section" id="contact">
        <div className="section-wrap">
          <ContentHeading section={section} />
          {body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <PublishedContact settings={settings} />
          <button className="button-gold" type="button" onClick={() => openEnquiryForm()}>
            Send an enquiry <ArrowRight />
          </button>
          {slug === "locations" && (
            <iframe
              title="Sarraf Properties office location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </section>
    );
  if (section.type === "cta")
    return (
      <section className="cta-band cms-cta">
        <div className="section-wrap">
          <div>
            <div className="eyebrow">
              <span />
              {section.eyebrow}
            </div>
            <h2>{section.title}</h2>
            {body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="cta-actions">
            {button || (
              <button className="button-gold" type="button" onClick={() => openEnquiryForm()}>
                Make an enquiry <ArrowRight />
              </button>
            )}
          </div>
        </div>
      </section>
    );
  return (
    <section
      className={`cms-content-section ${section.type === "image" || section.type === "video" ? "cms-media-section" : ""}`}
    >
      <div className="section-wrap">
        <ContentHeading section={section} />
        <div className="cms-text-columns">
          {(section.type === "image" || (section.type === "text" && image)) && image}
          {section.type === "video" && mediaUrl && (
            <video
              className="cms-video"
              src={mediaUrl}
              controls
              preload="metadata"
              poster={section.thumbnail_path ? media[section.thumbnail_path] : undefined}
            />
          )}
          <div>
            {body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {button}
          </div>
        </div>
        {section.caption && <p className="cms-caption">{section.caption}</p>}
      </div>
    </section>
  );
}

function ContentHeading({ section }: { section: CmsSection }) {
  return (
    <header className="cms-section-heading">
      {section.eyebrow && (
        <div className="eyebrow dark-eyebrow">
          <span />
          {section.eyebrow}
        </div>
      )}
      {section.title && (
        <h2>
          {section.title} {section.accent && <em>{section.accent}</em>}
        </h2>
      )}
    </header>
  );
}

function PublishedContact({ settings }: { settings: PublishedSiteSettings }) {
  return (
    <div className="cms-contact-cards">
      <a href={`tel:${settings["phone"]}`}>
        <Phone />
        <strong>Call us</strong>
        <span>{settings["phone"]}</span>
      </a>
      <a href={`https://wa.me/${settings["whatsapp"]}`} target="_blank" rel="noreferrer">
        <MessageCircle />
        <strong>WhatsApp</strong>
        <span>Send us a message</span>
      </a>
      <a href={`mailto:${settings["email"]}`}>
        <MessageCircle />
        <strong>Email</strong>
        <span>{settings["email"]}</span>
      </a>
      <p>{settings["address"]}</p>
    </div>
  );
}
