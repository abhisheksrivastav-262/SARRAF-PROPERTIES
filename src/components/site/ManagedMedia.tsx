import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { getSupabase, type MediaAsset } from "@/lib/supabase";

/** A page/section slot keeps the bundled image as a fallback until an admin publishes media. */
export function ManagedMediaImage({ page, section, fallback, ...props }: ImgHTMLAttributes<HTMLImageElement> & { page: string; section: string; fallback: string }) {
  const [media, setMedia] = useState<{ url: string; type: string }>({ url: fallback, type: "image" });
  useEffect(() => {
    const db = getSupabase(); if (!db) return;
    let alive = true;
    void Promise.all([
      db.from("media_slots").select("use_managed_media").eq("page_slug", page).eq("section_key", section).maybeSingle(),
      db.from("media_assets").select("*").eq("page_slug", page).eq("section_key", section).order("sort_order").limit(1),
    ]).then(([slot, media]) => {
      if (!alive) return;
      if (slot.data?.use_managed_media) setMedia(media.data?.[0] ? { url: media.data[0].public_url, type: media.data[0].media_type } : { url: "", type: "image" });
      else if (media.data?.[0]?.public_url) setMedia({ url: media.data[0].public_url, type: media.data[0].media_type });
    }).catch(() => undefined);
    return () => { alive = false; };
  }, [page, section, fallback]);
  if (!media.url) return null;
  if (media.type === "video") return <video className={props.className} src={media.url} autoPlay muted loop playsInline controls={!props.className?.includes("managed-hero-media")} aria-label={typeof props.alt === "string" ? props.alt : undefined} />;
  return <img {...props} src={media.url} />;
}

export function ManagedMediaGallery({ page, section, fallback }: { page: string; section: string; fallback: { src: string; alt: string; title: string }[] }) {
  const [items, setItems] = useState<{ src: string; alt: string; title: string; type?: string }[]>(fallback);
  useEffect(() => {
    const db = getSupabase(); if (!db) return;
    let alive = true;
    void Promise.all([
      db.from("media_slots").select("use_managed_media").eq("page_slug", page).eq("section_key", section).maybeSingle(),
      db.from("media_assets").select("*").eq("page_slug", page).eq("section_key", section).order("sort_order"),
    ]).then(([slot, media]) => {
      if (!alive) return;
      if (slot.data?.use_managed_media) setItems(((media.data || []) as MediaAsset[]).map(row => ({ src: row.public_url, alt: row.alt_text || row.title, title: row.title, type: row.media_type })));
      else if (media.data?.length) setItems((media.data as MediaAsset[]).map(row => ({ src: row.public_url, alt: row.alt_text || row.title, title: row.title, type: row.media_type })));
    }).catch(() => undefined);
    return () => { alive = false; };
  }, [page, section, fallback]);
  return <>{items.map(item => item.type === "video" ? <video key={item.src} src={item.src} controls aria-label={item.title}/> : <img key={item.src} src={item.src} alt={item.alt} title={item.title}/>)}</>;
}
