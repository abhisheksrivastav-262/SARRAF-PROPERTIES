import { useEffect, useState } from "react";
import { getSupabase, mediaBucket } from "@/lib/supabase";

export type CmsSection = {
  id: string;
  type: "hero" | "text" | "image" | "gallery" | "video" | "services" | "property-list" | "contact" | "cta";
  eyebrow?: string;
  title?: string;
  accent?: string;
  body?: string;
  button_label?: string;
  button_url?: string;
  media_path?: string;
  mobile_media_path?: string;
  thumbnail_path?: string;
  media_title?: string;
  media_description?: string;
  caption?: string;
  alt_text?: string;
  active?: boolean;
  items?: { id: string; title: string; body: string; button_label?: string; button_url?: string; media_path?: string; alt_text?: string }[];
};

export type CmsDocument = { sections: CmsSection[] };
export type CmsPage = {
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  content: CmsDocument;
  published_at: string;
};

export const CMS_PAGES = [
  ["home", "Home"], ["about", "About Us"], ["residential-properties", "Residential Properties"],
  ["commercial-properties", "Commercial Properties"], ["buy-property", "Buy Property"],
  ["sell-property", "Sell Property"], ["services", "Services"], ["locations", "Locations"],
  ["gallery", "Gallery"], ["contact", "Contact Us"],
] as const;

export type PublishedSiteSettings = { phone: string; whatsapp: string; email: string; address: string; footer_text: string; facebook: string; instagram: string; youtube: string; logo_path: string };
const defaultSiteSettings: PublishedSiteSettings = {
  phone: "8652869869", whatsapp: "918652869869", email: "Sarrafproperties2011@gmail.com",
  address: "Shop No.4, Patidar Society, Opp. Ezone Mall, Malad (W), Mumbai - 400064",
  footer_text: "Your trusted real estate partner in Goregaon and Malad, Mumbai. Professional guidance, personal attention.",
  facebook: "", instagram: "", youtube: "", logo_path: "",
};

export function usePublishedSiteSettings() {
  const [settings, setSettings] = useState<PublishedSiteSettings>(defaultSiteSettings);
  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    let alive = true;
    void Promise.resolve(db.from("cms_published_settings").select("settings").eq("id", true).maybeSingle().then(({ data }) => {
      if (alive && data?.settings) setSettings(current => ({ ...current, ...(data.settings as Partial<PublishedSiteSettings>) }));
    })).catch(() => undefined);
    return () => { alive = false; };
  }, []);
  return settings;
}

export function defaultCmsSection(type: CmsSection["type"] = "text"): CmsSection {
  return { id: crypto.randomUUID(), type, eyebrow: "", title: "New section", accent: "", body: "", button_label: "", button_url: "", media_path: "", mobile_media_path: "", thumbnail_path: "", media_title: "", media_description: "", caption: "", alt_text: "", active: true, items: [] };
}

export async function signedMediaUrl(path?: string | null) {
  if (!path) return "";
  const db = getSupabase();
  if (!db) return "";
  const { data, error } = await db.storage.from(mediaBucket).createSignedUrl(path, 3600);
  return error ? "" : data.signedUrl;
}

export async function uploadCmsMedia(file: File, page: string, section: string) {
  const db = getSupabase();
  if (!db) throw new Error("Supabase is not configured.");
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"];
  if (!allowed.includes(file.type)) throw new Error("Use JPG, PNG, WEBP, AVIF, MP4, or WEBM media.");
  const video = file.type.startsWith("video/");
  const limit = video ? 250 : 20;
  if (file.size > limit * 1024 * 1024) throw new Error(`${video ? "Video" : "Image"} must be ${limit} MB or smaller.`);
  const extension = file.name.split(".").pop()?.toLowerCase() || (video ? "mp4" : "jpg");
  const path = `${page}/${section}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await db.storage.from(mediaBucket).upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const publicUrl = db.storage.from(mediaBucket).getPublicUrl(path).data.publicUrl;
  const { data: asset, error: assetError } = await db.from("media_assets").insert({
    page_slug: page, section_key: section, media_type: video ? "video" : "image", file_path: path,
    public_url: publicUrl, title: file.name.replace(/\.[^.]+$/, ""), description: "", alt_text: "", caption: "", sort_order: 0, is_active: true,
  }).select("id,file_path,media_type,title").single();
  if (assetError) {
    await db.storage.from(mediaBucket).remove([path]);
    throw new Error(assetError.message);
  }
  return asset as { id: string; file_path: string; media_type: "image" | "video"; title: string };
}
