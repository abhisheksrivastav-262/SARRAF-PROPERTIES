import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bath, BedDouble, MapPin, MessageCircle, Ruler } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { openEnquiryForm } from "@/components/site/SiteLayout";
import { signedMediaUrl } from "@/lib/cms";
import { propertyConfiguration } from "@/lib/property-format";

export const Route = createFileRoute("/property/$slug")({
  head: () => ({
    meta: [
      { title: "Property Details | Sarraf Properties" },
      { name: "description", content: "Explore property details with Sarraf Properties." },
    ],
  }),
  component: PropertyDetailsPage,
});

type PropertyDetails = {
  id: string;
  title: string;
  slug: string;
  property_type: "residential" | "commercial";
  description: string;
  seo_title: string;
  seo_description: string;
  location: string;
  city: string;
  address: string | null;
  price: number | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  area_unit: string;
  amenities: string[];
  property_images: {
    sort_order: number;
    media_assets: { file_path: string; public_url: string; alt_text: string; title: string } | null;
  }[];
  property_videos: {
    sort_order: number;
    media_assets: { file_path: string; public_url: string; alt_text: string; title: string } | null;
  }[];
};

function PropertyDetailsPage() {
  const { slug } = Route.useParams();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const db = getSupabase();
    if (!db) {
      setLoading(false);
      return;
    }
    let active = true;
    void Promise.resolve(
      db
        .from("properties")
        .select(
          "id,title,slug,property_type,description,seo_title,seo_description,location,city,address,price,currency,bedrooms,bathrooms,area_sqft,area_unit,amenities,property_images(sort_order,media_assets(file_path,public_url,alt_text,title)),property_videos(sort_order,media_assets(file_path,public_url,alt_text,title))",
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle()
        .then(async ({ data }) => {
          if (!active) return;
          if (data) {
            const row = data as unknown as PropertyDetails;
            row.property_images.sort((a, b) => a.sort_order - b.sort_order);
            await Promise.all(
              row.property_images.map(async (image) => {
                if (image.media_assets)
                  image.media_assets.public_url = await signedMediaUrl(
                    image.media_assets.file_path,
                  );
              }),
            );
            row.property_videos.sort((a, b) => a.sort_order - b.sort_order);
            await Promise.all(
              row.property_videos.map(async (video) => {
                if (video.media_assets)
                  video.media_assets.public_url = await signedMediaUrl(
                    video.media_assets.file_path,
                  );
              }),
            );
            setProperty(row);
          }
          setLoading(false);
        }),
    ).catch(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!property || typeof document === "undefined") return;
    document.title = property.seo_title || `${property.title} | Sarraf Properties`;
    if (property.seo_description) {
      let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!description) {
        description = document.createElement("meta");
        description.name = "description";
        document.head.append(description);
      }
      description.content = property.seo_description;
    }
  }, [property]);

  if (loading)
    return (
      <main className="property-detail-state">
        <p>Loading property details…</p>
      </main>
    );
  if (!property)
    return (
      <main className="property-detail-state">
        <p className="eyebrow dark-eyebrow">
          <span /> PROPERTY DETAILS
        </p>
        <h1>Property not available</h1>
        <p>This property may have been removed or is not currently published.</p>
        <Link className="underlined-link" to="/residential-properties">
          <ArrowLeft /> Browse properties
        </Link>
      </main>
    );
  const images = property.property_images
    .map((row) => row.media_assets)
    .filter((image): image is NonNullable<typeof image> => !!image?.public_url);
  const videos = property.property_videos
    .map((row) => row.media_assets)
    .filter((video): video is NonNullable<typeof video> => !!video?.public_url);
  return (
    <main className="property-detail-page">
      <div className="property-detail-wrap">
        <Link
          className="underlined-link property-back-link"
          to={
            property.property_type === "residential"
              ? "/residential-properties"
              : "/commercial-properties"
          }
        >
          <ArrowLeft /> Back to {property.property_type} properties
        </Link>
        <div className="property-detail-layout">
          <section className="property-detail-gallery" aria-label="Property photos">
            {images.length ? (
              images.map((image, index) => (
                <img
                  className={index === 0 ? "property-detail-cover" : ""}
                  key={`${image.public_url}-${index}`}
                  src={image.public_url}
                  alt={image.alt_text || property.title}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ))
            ) : (
              <div className="property-image-placeholder">SARRAF PROPERTIES</div>
            )}
          </section>
          <article className="property-detail-copy">
            <span className="property-type-label">{property.property_type} property</span>
            <h1>{property.title}</h1>
            <p className="property-location">
              <MapPin size={16} />
              {property.location}, {property.city}
            </p>
            {property.address && <p>{property.address}</p>}
            <div className="property-detail-price">
              {property.price !== null
                ? `${property.currency} ${Number(property.price).toLocaleString("en-IN")}`
                : "Price on enquiry"}
            </div>
            <div className="property-specs property-detail-specs">
              {property.bedrooms !== null && (
                <span>
                  <BedDouble size={17} />
                  {propertyConfiguration(property.property_type, property.bedrooms)}
                </span>
              )}
              {property.bathrooms !== null && (
                <span>
                  <Bath size={17} />
                  {property.bathrooms} bathrooms
                </span>
              )}
              {property.area_sqft !== null && (
                <span>
                  <Ruler size={17} />
                  {property.area_sqft} {property.area_unit || "sq ft"}
                </span>
              )}
            </div>
            <h2>Property overview</h2>
            <p className="property-description">
              {property.description ||
                "Contact Sarraf Properties for more information about this property."}
            </p>
            {property.amenities.length > 0 && (
              <section className="property-amenities">
                <h2>Amenities</h2>
                <ul>
                  {property.amenities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
            <button
              type="button"
              className="button-gold"
              onClick={() =>
                openEnquiryForm(
                  property.property_type === "residential"
                    ? "Residential Property Consultation"
                    : "Commercial Property Consultation",
                  `Property: ${property.title} (${property.slug})`,
                )
              }
            >
              Enquire about this property <MessageCircle />
            </button>
            <Link
              className="underlined-link property-other-link"
              to={
                property.property_type === "residential"
                  ? "/commercial-properties"
                  : "/residential-properties"
              }
            >
              Explore {property.property_type === "residential" ? "commercial" : "residential"}{" "}
              properties <ArrowRight />
            </Link>
          </article>
        </div>
        {videos.length > 0 && (
          <section className="property-detail-videos">
            <h2>Property videos</h2>
            <div>
              {videos.map((video, index) => (
                <video
                  key={`${video.file_path}-${index}`}
                  src={video.public_url}
                  controls
                  preload="metadata"
                  title={video.title || property.title}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
