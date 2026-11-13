import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Check, ExternalLink, ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { getSupabase, mediaBucket, maxImageMb } from "@/lib/supabase";
import type { MediaAsset } from "@/lib/supabase";
import { Link } from "@tanstack/react-router";
import { signedMediaUrl } from "@/lib/cms";

type PropertyImage = { id: string; sort_order: number; media_assets: Pick<MediaAsset, "id" | "file_path" | "public_url" | "title" | "alt_text"> | null };
type PropertyRow = {
  id: string; title: string; slug: string; property_type: "residential" | "commercial";
  description: string; seo_title: string; seo_description: string; location: string; city: string; address: string | null;
  price: number | null; currency: string; bedrooms: number | null; bathrooms: number | null;
  area_sqft: number | null; status: "draft" | "published"; featured: boolean;
  sort_order: number; published_at: string | null; created_at: string; updated_at: string;
  property_images: PropertyImage[];
};
type PropertyForm = {
  title: string; slug: string; property_type: "residential" | "commercial"; description: string; seo_title: string; seo_description: string;
  location: string; city: string; address: string; price: string; currency: string;
  bedrooms: string; bathrooms: string; area_sqft: string; status: "draft" | "published";
  featured: boolean;
};
const emptyForm: PropertyForm = { title: "", slug: "", property_type: "residential", description: "", seo_title: "", seo_description: "", location: "", city: "Mumbai", address: "", price: "", currency: "INR", bedrooms: "", bathrooms: "", area_sqft: "", status: "draft", featured: false };
const propertySelect = "id,title,slug,property_type,description,seo_title,seo_description,location,city,address,price,currency,bedrooms,bathrooms,area_sqft,status,featured,sort_order,published_at,created_at,updated_at,property_images(id,sort_order,media_assets(id,file_path,public_url,title,alt_text))";
const imageMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export function PropertyManager() {
  const supabase = getSupabase();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [filter, setFilter] = useState<"all" | "residential" | "commercial">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyRow | null>(null);
  const [form, setForm] = useState<PropertyForm>(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProperties = useCallback(async () => {
    if (!supabase) { setLoading(false); setError("Supabase client is not configured."); return; }
    setLoading(true);
    let query = supabase.from("properties").select(propertySelect).order("featured", { ascending: false }).order("sort_order").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("property_type", filter);
    const { data, error: queryError } = await query;
    if (queryError) setError(`Could not load properties: ${queryError.message}`);
    else {
      const rows = (data || []) as unknown as PropertyRow[];
      const hydrated = await Promise.all(rows.map(async item => ({ ...item, property_images: await Promise.all([...(item.property_images || [])].sort((a, b) => a.sort_order - b.sort_order).map(async image => image.media_assets ? ({ ...image, media_assets: { ...image.media_assets, public_url: await signedMediaUrl(image.media_assets.file_path) } }) : image)) })));
      setProperties(hydrated); setError("");
    }
    setLoading(false);
  }, [supabase, filter]);
  useEffect(() => { void loadProperties(); }, [loadProperties]);

  function startNew() { setEditorOpen(true); setEditing(null); setForm(emptyForm); setFiles([]); setError(""); setNotice(""); }
  function startEdit(item: PropertyRow) {
    setEditorOpen(true); setEditing(item); setFiles([]); setError(""); setNotice("");
    setForm({ title: item.title, slug: item.slug, property_type: item.property_type, description: item.description || "", seo_title: item.seo_title || "", seo_description: item.seo_description || "", location: item.location, city: item.city, address: item.address || "", price: item.price === null ? "" : String(item.price), currency: item.currency || "INR", bedrooms: item.bedrooms === null ? "" : String(item.bedrooms), bathrooms: item.bathrooms === null ? "" : String(item.bathrooms), area_sqft: item.area_sqft === null ? "" : String(item.area_sqft), status: item.status, featured: item.featured });
  }
  function closeEditor() { setEditorOpen(false); setEditing(null); setForm(emptyForm); setFiles([]); }
  function setField<K extends keyof PropertyForm>(key: K, value: PropertyForm[K]) { setForm(current => ({ ...current, [key]: value })); }

  async function uploadImages(property: PropertyRow, selectedFiles: File[]) {
    if (!supabase) throw new Error("Supabase client is not configured.");
    for (const file of selectedFiles) {
      if (!imageMimeTypes.includes(file.type)) throw new Error(`${file.name}: choose JPG, PNG, WEBP, or AVIF.`);
      if (file.size > maxImageMb * 1024 * 1024) throw new Error(`${file.name}: file exceeds the ${maxImageMb} MB image limit.`);
    }
    let nextOrder = property.property_images.length;
    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `properties/${property.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(mediaBucket).upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw new Error(`Could not upload ${file.name}: ${uploadError.message}`);
      const publicUrl = supabase.storage.from(mediaBucket).getPublicUrl(path).data.publicUrl;
      const title = file.name.replace(/\.[^.]+$/, "");
      const { data: asset, error: assetError } = await supabase.from("media_assets").insert({ page_slug: "properties", section_key: property.id, media_type: "image", file_path: path, public_url: publicUrl, title, alt_text: title, caption: "", sort_order: nextOrder, is_active: true }).select("id").single();
      if (assetError || !asset) {
        await supabase.storage.from(mediaBucket).remove([path]);
        throw new Error(`Image uploaded but its media record could not be saved: ${assetError?.message || "no asset returned"}`);
      }
      const { error: relationError } = await supabase.from("property_images").insert({ property_id: property.id, media_asset_id: asset.id, sort_order: nextOrder });
      if (relationError) {
        await supabase.from("media_assets").delete().eq("id", asset.id);
        await supabase.storage.from(mediaBucket).remove([path]);
        throw new Error(`Image uploaded but could not be linked to the property: ${relationError.message}`);
      }
      nextOrder += 1;
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase) return;
    setBusy(true); setError(""); setNotice("");
    const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!form.title.trim() || !slug || !form.location.trim()) { setError("Title, URL slug, and location are required."); setBusy(false); return; }
    const fields = {
      title: form.title.trim(), slug, property_type: form.property_type, description: form.description.trim(), seo_title: form.seo_title.trim(), seo_description: form.seo_description.trim(),
      location: form.location.trim(), city: form.city.trim() || "Mumbai", address: form.address.trim() || null,
      price: form.price ? Number(form.price) : null, currency: form.currency.trim() || "INR",
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null, bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      area_sqft: form.area_sqft ? Number(form.area_sqft) : null, status: form.status, featured: form.featured,
      published_at: form.status === "published" ? editing?.published_at || new Date().toISOString() : null,
    };
    const result = editing
      ? await supabase.from("properties").update(fields).eq("id", editing.id).select("id,title,slug,property_type,description,seo_title,seo_description,location,city,address,price,currency,bedrooms,bathrooms,area_sqft,status,featured,sort_order,published_at,created_at,updated_at").single()
      : await supabase.from("properties").insert(fields).select("id,title,slug,property_type,description,seo_title,seo_description,location,city,address,price,currency,bedrooms,bathrooms,area_sqft,status,featured,sort_order,published_at,created_at,updated_at").single();
    if (result.error || !result.data) { setError(result.error?.message || "Property could not be saved."); setBusy(false); return; }
    const property = { ...result.data, property_images: editing?.property_images || [] } as PropertyRow;
    try {
      if (files.length) await uploadImages(property, files);
      setNotice(editing ? "Property updated." : "Property created."); closeEditor(); await loadProperties();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Property saved, but image upload failed.");
      await loadProperties();
    }
    setBusy(false);
  }

  async function removeProperty(item: PropertyRow) {
    if (!supabase || !window.confirm(`Delete “${item.title}”? Its property image records will be removed too.`)) return;
    setBusy(true); setError(""); setNotice("");
    const filePaths = item.property_images.map(image => image.media_assets?.file_path).filter((path): path is string => !!path);
    const assetIds = item.property_images.map(image => image.media_assets?.id).filter((id): id is string => !!id);
    const { error: deleteError } = await supabase.from("properties").delete().eq("id", item.id);
    if (deleteError) { setError(deleteError.message); setBusy(false); return; }
    if (assetIds.length) {
      const { error: assetError } = await supabase.from("media_assets").delete().in("id", assetIds);
      if (assetError) setError(`Property was deleted but some media records remain: ${assetError.message}`);
    }
    if (filePaths.length) {
      const { error: storageError } = await supabase.storage.from(mediaBucket).remove(filePaths);
      if (storageError) setError(`Property was deleted but image cleanup needs attention: ${storageError.message}`);
    }
    setNotice("Property deleted.");
    if (editing?.id === item.id) closeEditor();
    await loadProperties(); setBusy(false);
  }

  async function removeImage(image: PropertyImage) {
    if (!supabase || !window.confirm("Remove this property image?")) return;
    const asset = image.media_assets;
    const { error: relationError } = await supabase.from("property_images").delete().eq("id", image.id);
    if (relationError) { setError(relationError.message); return; }
    if (asset) {
      const { error: assetError } = await supabase.from("media_assets").delete().eq("id", asset.id);
      const { error: storageError } = await supabase.storage.from(mediaBucket).remove([asset.file_path]);
      if (assetError || storageError) setError(`Image link removed; cleanup needs attention: ${assetError?.message || storageError?.message}`);
    }
    await loadProperties();
    if (editing) {
      const { data } = await supabase.from("properties").select(propertySelect).eq("id", editing.id).maybeSingle();
      if (data) setEditing(data as unknown as PropertyRow);
    }
  }

  async function moveImage(item: PropertyRow, index: number, offset: number) {
    if (!supabase) return;
    const ordered = [...item.property_images].sort((a, b) => a.sort_order - b.sort_order);
    const image = ordered[index]; const neighbor = ordered[index + offset];
    if (!image || !neighbor) return;
    const first = await supabase.from("property_images").update({ sort_order: neighbor.sort_order }).eq("id", image.id);
    if (first.error) { setError(first.error.message); return; }
    const second = await supabase.from("property_images").update({ sort_order: image.sort_order }).eq("id", neighbor.id);
    if (second.error) setError(second.error.message);
    await loadProperties();
  }

  const input = (label: string, key: keyof PropertyForm, type = "text", required = false) => <label className="property-admin-field">{label}<input type={type} required={required} min={type === "number" ? "0" : undefined} step={type === "number" ? "any" : undefined} value={String(form[key])} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))}/></label>;

  return <section className="property-admin">
    <div className="property-admin-heading"><div><h2>Property listings</h2><p className="media-admin-muted">Create and manage residential and commercial listings.</p></div><button type="button" className="media-admin-primary" onClick={startNew}><Plus size={16}/> Add property</button></div>
    {error && <div className="media-admin-notice" role="alert">{error}</div>}{notice && <div className="property-admin-success" role="status"><Check size={15}/>{notice}</div>}
    {editorOpen && <form className="property-admin-editor" onSubmit={save}>
      <div className="property-admin-editor-head"><div><span className="media-admin-eyebrow">{editing ? "EDIT LISTING" : "NEW LISTING"}</span><h3>{editing ? editing.title : "Add a property"}</h3></div><button type="button" className="property-admin-icon" aria-label="Close editor" onClick={closeEditor}><X/></button></div>
      <div className="property-admin-form-grid">{input("Property title *", "title", "text", true)}{input("URL slug *", "slug", "text", true)}
        <label className="property-admin-field">Property type<select value={form.property_type} onChange={e => setField("property_type", e.target.value as PropertyForm["property_type"])}><option value="residential">Residential</option><option value="commercial">Commercial</option></select></label>
        <label className="property-admin-field">Status<select value={form.status} onChange={e => setField("status", e.target.value as PropertyForm["status"])}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        {input("Location *", "location", "text", true)}{input("City", "city")}{input("Price", "price", "number")}{input("Currency", "currency")}{input("Bedrooms", "bedrooms", "number")}{input("Bathrooms", "bathrooms", "number")}{input("Area (sq ft)", "area_sqft", "number")}{input("Address", "address")}
        <label className="property-admin-field property-admin-description">Description<textarea rows={4} value={form.description} onChange={e => setField("description", e.target.value)}/></label>
        <label className="property-admin-field">SEO title<input value={form.seo_title} onChange={e => setField("seo_title", e.target.value)}/></label><label className="property-admin-field property-admin-description">SEO description<textarea rows={2} value={form.seo_description} onChange={e => setField("seo_description", e.target.value)}/></label>
        <label className="property-admin-featured"><input type="checkbox" checked={form.featured} onChange={e => setField("featured", e.target.checked)}/> Feature this property on the website</label>
      </div>
      {editing && <div className="property-admin-image-editor"><div className="property-admin-images-heading"><strong>Property photos</strong><span>Up to {maxImageMb} MB per image</span></div><div className="property-admin-image-grid">{[...editing.property_images].sort((a,b)=>a.sort_order-b.sort_order).map((image,index)=><article key={image.id}><img src={image.media_assets?.public_url || ""} alt={image.media_assets?.alt_text || editing.title}/><div><button type="button" title="Move up" disabled={index===0} onClick={()=>void moveImage(editing,index,-1)}><ArrowUp size={14}/></button><button type="button" title="Move down" disabled={index===editing.property_images.length-1} onClick={()=>void moveImage(editing,index,1)}><ArrowDown size={14}/></button><button type="button" className="danger" title="Remove image" onClick={()=>void removeImage(image)}><Trash2 size={14}/></button></div></article>)}</div></div>}
      <label className="property-admin-upload"><ImagePlus size={17}/><span>Add multiple property images</span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={e=>setFiles(Array.from(e.target.files || []))}/><small>{files.length ? `${files.length} selected` : "JPG, PNG, WEBP, AVIF"}</small></label>
      <div className="property-admin-editor-actions"><button type="button" className="media-admin-secondary" onClick={closeEditor}>Cancel</button><button type="submit" className="media-admin-primary" disabled={busy}>{busy ? "Saving…" : <><Save size={16}/> Save property</>}</button></div>
    </form>}
    <div className="property-admin-list-head"><strong>{properties.length} properties</strong><select aria-label="Filter properties" value={filter} onChange={e=>setFilter(e.target.value as typeof filter)}><option value="all">All types</option><option value="residential">Residential</option><option value="commercial">Commercial</option></select></div>
    {loading ? <div className="media-admin-empty">Loading properties…</div> : properties.length ? <div className="property-admin-list">{properties.map(item=>{
      const cover=[...item.property_images].sort((a,b)=>a.sort_order-b.sort_order)[0]?.media_assets;
      return <article className="property-admin-row" key={item.id}><div className="property-admin-row-image">{cover?.public_url?<img src={cover.public_url} alt={cover.alt_text||item.title}/>:<ImagePlus/>}</div><div className="property-admin-row-copy"><span className={`property-admin-status ${item.status}`}>{item.status}</span>{item.featured&&<span className="property-admin-featured-label">Featured</span>}<h3>{item.title}</h3><p>{item.property_type} · {item.location}, {item.city}{item.price!==null?` · ${item.currency} ${Number(item.price).toLocaleString("en-IN")}`:""}</p><small>{item.property_images.length} photos · /property/{item.slug}</small></div><div className="property-admin-row-actions"><button type="button" onClick={()=>startEdit(item)}>Edit</button>{item.status==="published"&&<Link to="/property/$slug" params={{slug:item.slug}} target="_blank" aria-label={`View ${item.title}`}><ExternalLink size={15}/></Link>}<button type="button" className="danger" onClick={()=>void removeProperty(item)} disabled={busy} aria-label={`Delete ${item.title}`}><Trash2 size={16}/></button></div></article>;
    })}</div> : <div className="media-admin-empty">No properties yet. Add a listing to get started.</div>}
  </section>;
}
