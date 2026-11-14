import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BedDouble, Bath, MapPin, Ruler } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { signedMediaUrl } from "@/lib/cms";
import { propertyConfiguration } from "@/lib/property-format";

type PropertyCardData = {
  id: string;
  title: string;
  slug: string;
  property_type: "residential" | "commercial";
  description: string;
  location: string;
  city: string;
  price: number | null;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  area_unit: string;
  featured: boolean;
  sort_order: number;
  property_images: {
    sort_order: number;
    media_assets: { file_path: string; public_url: string; alt_text: string; title: string } | null;
  }[];
};

export function PropertyListings({
  propertyType,
  featuredOnly = false,
}: {
  propertyType?: "residential" | "commercial";
  featuredOnly?: boolean;
}) {
  const [items, setItems] = useState<PropertyCardData[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const db = getSupabase();
    if (!db) {
      setLoaded(true);
      return;
    }
    let active = true;
    let query = db
      .from("properties")
      .select(
        "id,title,slug,property_type,description,location,city,price,currency,bedrooms,bathrooms,area_sqft,area_unit,featured,sort_order,property_images(sort_order,media_assets(file_path,public_url,alt_text,title))",
      )
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (propertyType) query = query.eq("property_type", propertyType);
    if (featuredOnly) query = query.eq("featured", true);
    void Promise.resolve(
      query.then(async ({ data }) => {
        if (!active) return;
        const rows = (data || []) as unknown as PropertyCardData[];
        const hydrated = await Promise.all(
          rows.map(async (item) => ({
            ...item,
            property_images: await Promise.all(
              [...(item.property_images || [])]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(async (image) =>
                  image.media_assets
                    ? {
                        ...image,
                        media_assets: {
                          ...image.media_assets,
                          public_url: await signedMediaUrl(image.media_assets.file_path),
                        },
                      }
                    : image,
                ),
            ),
          })),
        );
        setItems(hydrated);
        setLoaded(true);
      }),
    ).catch(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [propertyType, featuredOnly]);

  if (!items.length)
    return loaded ? null : (
      <div className="property-listing-loading" aria-label="Loading properties" />
    );
  return (
    <div className="property-listing-block">
      <div className="property-listing-heading">
        <div className="eyebrow dark-eyebrow">
          <span /> {featuredOnly ? "FEATURED PROPERTIES" : "AVAILABLE PROPERTY OPTIONS"}
        </div>
        <h2>
          {featuredOnly ? (
            <>
              Featured <em>properties.</em>
            </>
          ) : (
            <>
              Explore current <em>properties.</em>
            </>
          )}
        </h2>
      </div>
      <div className="property-listing-grid">
        {items.map((property) => {
          const cover = property.property_images[0]?.media_assets;
          return (
            <article className="property-listing-card" key={property.id}>
              <Link
                className="property-listing-image"
                to="/property/$slug"
                params={{ slug: property.slug }}
                aria-label={`View ${property.title}`}
              >
                {cover?.public_url ? (
                  <img
                    src={cover.public_url}
                    alt={cover.alt_text || property.title}
                    loading="lazy"
                  />
                ) : (
                  <span className="property-image-placeholder">SARRAF PROPERTIES</span>
                )}
                {property.featured && <span className="property-featured-badge">Featured</span>}
              </Link>
              <div className="property-listing-copy">
                <span className="property-type-label">{property.property_type} property</span>
                <h3>
                  <Link to="/property/$slug" params={{ slug: property.slug }}>
                    {property.title}
                  </Link>
                </h3>
                <p className="property-location">
                  <MapPin size={14} />
                  {property.location}, {property.city}
                </p>
                <div className="property-specs">
                  {property.bedrooms !== null && (
                    <span>
                      <BedDouble size={14} />
                      {propertyConfiguration(property.property_type, property.bedrooms)}
                    </span>
                  )}
                  {property.bathrooms !== null && (
                    <span>
                      <Bath size={14} />
                      {property.bathrooms} baths
                    </span>
                  )}
                  {property.area_sqft !== null && (
                    <span>
                      <Ruler size={14} />
                      {property.area_sqft} {property.area_unit || "sq ft"}
                    </span>
                  )}
                </div>
                <div className="property-listing-footer">
                  {property.price !== null && (
                    <strong>
                      {property.currency} {Number(property.price).toLocaleString("en-IN")}
                    </strong>
                  )}
                  <Link
                    className="underlined-link"
                    to="/property/$slug"
                    params={{ slug: property.slug }}
                  >
                    View details <ArrowRight />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
