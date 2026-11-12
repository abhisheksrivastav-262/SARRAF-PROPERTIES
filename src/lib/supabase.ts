import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function getSupabase() {
  if (client !== undefined) return client;
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  client = url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
  return client;
}

export function isMediaAdmin(user: User | null | undefined) {
  const app = user?.app_metadata as { role?: string; roles?: string[] } | undefined;
  return app?.role === "admin" || app?.roles?.includes("admin") === true;
}

export const mediaBucket = import.meta.env.VITE_SUPABASE_MEDIA_BUCKET || "site-media";
export const maxImageMb = Number(import.meta.env.VITE_MEDIA_IMAGE_MAX_MB || 20);
export const maxVideoMb = Number(import.meta.env.VITE_MEDIA_VIDEO_MAX_MB || 250);

export const MEDIA_PAGES = [
  { slug: "home", name: "Home", sections: ["hero", "about", "gallery-1", "gallery-2", "gallery-3", "service-1", "service-2", "service-3", "service-4", "service-5", "service-6", "featured-1", "featured-2", "featured-3", "featured-4"] },
  { slug: "about", name: "About Us", sections: ["hero", "intro", "gallery-1", "gallery-2", "gallery-3"] },
  { slug: "residential-properties", name: "Residential Properties", sections: ["hero", "intro", "gallery-1", "gallery-2", "gallery-3"] },
  { slug: "commercial-properties", name: "Commercial Properties", sections: ["hero", "intro", "gallery-1", "gallery-2", "gallery-3"] },
  { slug: "buy-property", name: "Buy Property", sections: ["hero", "intro", "gallery-1", "gallery-2", "gallery-3"] },
  { slug: "sell-property", name: "Sell Property", sections: ["hero", "intro", "gallery-1", "gallery-2", "gallery-3"] },
  { slug: "services", name: "Services", sections: ["hero", "service-1", "service-2", "service-3", "service-4", "service-5", "service-6"] },
  { slug: "locations", name: "Locations", sections: ["hero", "goregaon", "malad", "gallery-1", "gallery-2", "gallery-3"] },
  { slug: "gallery", name: "Gallery", sections: ["hero", "gallery-1", "gallery-2", "gallery-3", "gallery-4"] },
  { slug: "contact", name: "Contact Us", sections: ["hero", "intro"] },
] as const;

export type MediaPageSlug = (typeof MEDIA_PAGES)[number]["slug"];
export type MediaAsset = {
  id: string; page_slug: string; section_key: string; media_type: "image" | "video";
  file_path: string; public_url: string; title: string; alt_text: string; caption: string;
  sort_order: number; created_at: string; updated_at: string;
};
