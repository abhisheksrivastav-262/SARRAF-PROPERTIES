import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Film,
  Images,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Upload,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export type AdminDestination = "dashboard" | "media" | "properties" | "settings" | `page:${string}`;

type OverviewCounts = {
  properties: number;
  publishedProperties: number;
  draftProperties: number;
  media: number;
  images: number;
  videos: number;
  pages: number;
};

const emptyCounts: OverviewCounts = {
  properties: 0,
  publishedProperties: 0,
  draftProperties: 0,
  media: 0,
  images: 0,
  videos: 0,
  pages: 0,
};

export function AdminOverview({
  onNavigate,
}: {
  onNavigate: (destination: AdminDestination) => void;
}) {
  const db = getSupabase();
  const [counts, setCounts] = useState(emptyCounts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!db) {
      setLoading(false);
      setError("Supabase is not configured. Dashboard totals are unavailable.");
      return;
    }

    async function loadCounts() {
      setLoading(true);
      const results = await Promise.all([
        db.from("properties").select("id", { count: "exact", head: true }),
        db
          .from("properties")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
        db.from("properties").select("id", { count: "exact", head: true }).eq("status", "draft"),
        db.from("media_assets").select("id", { count: "exact", head: true }),
        db
          .from("media_assets")
          .select("id", { count: "exact", head: true })
          .eq("media_type", "image"),
        db
          .from("media_assets")
          .select("id", { count: "exact", head: true })
          .eq("media_type", "video"),
        db.from("cms_pages").select("slug", { count: "exact", head: true }),
      ]);

      if (!alive) return;
      const failed = results.find((result) => result.error);
      if (failed?.error) {
        setError(`Some dashboard totals could not be loaded: ${failed.error.message}`);
      } else {
        setError("");
        setCounts({
          properties: results[0].count || 0,
          publishedProperties: results[1].count || 0,
          draftProperties: results[2].count || 0,
          media: results[3].count || 0,
          images: results[4].count || 0,
          videos: results[5].count || 0,
          pages: results[6].count || 0,
        });
      }
      setLoading(false);
    }

    void loadCounts();
    return () => {
      alive = false;
    };
  }, [db, refreshKey]);

  const stats = [
    {
      label: "Total properties",
      description: "All saved listings, including drafts.",
      value: counts.properties,
      icon: Building2,
    },
    {
      label: "Published properties",
      description: "Listings visible on the public website.",
      value: counts.publishedProperties,
      icon: ArrowUpRight,
    },
    {
      label: "Draft properties",
      description: "Saved in Admin; visitors cannot see them yet.",
      value: counts.draftProperties,
      icon: LayoutDashboard,
    },
    {
      label: "Managed media",
      description: "Images and videos in the Media Library.",
      value: counts.media,
      icon: Images,
    },
    {
      label: "Images",
      description: "Image files in the Media Library.",
      value: counts.images,
      icon: Images,
    },
    {
      label: "Videos",
      description: "Video files in the Media Library.",
      value: counts.videos,
      icon: Film,
    },
    {
      label: "CMS pages",
      description: "Editable website pages; publish each page separately.",
      value: counts.pages,
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="admin-overview">
      {error && (
        <div className="media-admin-error" role="alert">
          {error}
        </div>
      )}
      <section className="admin-overview-stats" aria-label="Website totals">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="admin-overview-stat" key={label}>
            <span className="admin-overview-stat-icon">
              <Icon size={18} />
            </span>
            <span className="admin-overview-stat-label">{label}</span>
            <strong>{loading ? "—" : value.toLocaleString("en-IN")}</strong>
            <small>{description}</small>
          </article>
        ))}
      </section>

      <section className="admin-overview-actions">
        <div>
          <p className="media-admin-eyebrow">QUICK ACTIONS</p>
          <h2>Keep your website up to date.</h2>
        </div>
        <div className="admin-overview-action-grid">
          <button type="button" onClick={() => onNavigate("properties")}>
            <Plus size={17} /> Add or edit properties
          </button>
          <button type="button" onClick={() => onNavigate("media")}>
            <Upload size={17} /> Upload website media
          </button>
          <button type="button" onClick={() => onNavigate("page:home")}>
            <LayoutDashboard size={17} /> Edit Home page
          </button>
          <button type="button" onClick={() => onNavigate("page:services")}>
            <Building2 size={17} /> Manage Services
          </button>
          <button type="button" onClick={() => onNavigate("page:gallery")}>
            <Images size={17} /> Manage Gallery
          </button>
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            disabled={loading}
          >
            <RefreshCw size={17} /> Refresh overview
          </button>
        </div>
      </section>
    </div>
  );
}
