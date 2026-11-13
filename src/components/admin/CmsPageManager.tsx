import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Eye, FilePlus2, ImagePlus, Save, Send, Trash2, Video } from "lucide-react";
import { getSupabase, mediaBucket } from "@/lib/supabase";
import { CMS_PAGES, defaultCmsSection, signedMediaUrl, uploadCmsMedia, type CmsDocument, type CmsPage, type CmsSection } from "@/lib/cms";

type AdminPage = { slug: string; title: string; seo_title: string; seo_description: string; draft_content: CmsDocument; updated_at: string };
type Asset = { id: string; page_slug: string; section_key: string; media_type: "image" | "video"; file_path: string; title: string; description: string; alt_text: string; caption: string; is_active: boolean };
const types: CmsSection["type"][] = ["hero", "text", "image", "gallery", "video", "services", "property-list", "contact", "cta"];

export function CmsPageManager() {
  const db = getSupabase();
  const [pages, setPages] = useState<AdminPage[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [slug, setSlug] = useState<string>(CMS_PAGES[0][0]);
  const [page, setPage] = useState<AdminPage | null>(null);
  const [draft, setDraft] = useState<CmsDocument>({ sections: [] });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [signed, setSigned] = useState<Record<string, string>>({});
  const [published, setPublished] = useState(false);

  const loadPage = useCallback(async (nextSlug = slug) => {
    if (!db) return;
    const [pageResult, assetResult, publishedResult] = await Promise.all([
      db.from("cms_pages").select("slug,title,seo_title,seo_description,draft_content,updated_at").eq("slug", nextSlug).maybeSingle(),
      db.from("media_assets").select("id,page_slug,section_key,media_type,file_path,title,description,alt_text,caption,is_active").eq("page_slug", nextSlug).order("created_at", { ascending: false }),
      db.from("cms_published_pages").select("slug").eq("slug", nextSlug).maybeSingle(),
    ]);
    if (pageResult.error) { setError(pageResult.error.message); return; }
    if (pageResult.data) {
      const row = pageResult.data as AdminPage;
      setPage(row); setDraft(row.draft_content || { sections: [] });
    } else { setPage(null); setDraft({ sections: [] }); }
    if (assetResult.error) setError(assetResult.error.message); else setAssets((assetResult.data || []) as Asset[]);
    setPublished(Boolean(publishedResult.data));
  }, [db, slug]);

  useEffect(() => { void loadPage(slug); }, [loadPage, slug]);
  useEffect(() => {
    let alive = true;
    const paths = [...new Set(draft.sections.flatMap(section => [section.media_path, section.mobile_media_path, section.thumbnail_path]).filter((item): item is string => Boolean(item)))];
    void Promise.all(paths.map(async path => [path, await signedMediaUrl(path)] as const)).then(values => {
      if (alive) setSigned(Object.fromEntries(values));
    });
    return () => { alive = false; };
  }, [draft]);

  const sections = draft.sections || [];
  const pageName = useMemo(() => CMS_PAGES.find(([key]) => key === slug)?.[1] || slug, [slug]);
  function patchSection(index: number, patch: Partial<CmsSection>) {
    setDraft(value => ({ ...value, sections: value.sections.map((section, i) => i === index ? { ...section, ...patch } : section) }));
  }
  function patchItem(sectionIndex: number, itemIndex: number, patch: Partial<NonNullable<CmsSection["items"]>[number]>) {
    const current = sections[sectionIndex];
    if (!current) return;
    const items = [...(current.items || [])];
    const item = items[itemIndex];
    if (!item) return;
    items[itemIndex] = { ...item, ...patch };
    patchSection(sectionIndex, { items });
  }
  function moveSection(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    setDraft(value => { const result = [...value.sections]; const current = result[index]; const next = result[target]; if (!current || !next) return value; result[index] = next; result[target] = current; return { ...value, sections: result }; });
  }
  function changeMetadata(patch: Partial<AdminPage>) { setPage(value => ({ ...(value || { slug, title: pageName, seo_title: "", seo_description: "", draft_content: draft, updated_at: "" }), ...patch })); }

  async function persistDraft() {
    if (!db || !page) return false;
    const values = { slug, title: page.title, seo_title: page.seo_title, seo_description: page.seo_description, draft_content: draft, updated_at: new Date().toISOString() };
    const { error: saveError } = await db.from("cms_pages").upsert(values, { onConflict: "slug" });
    if (saveError) { setError(saveError.message); return false; }
    setNotice("Draft saved."); setError(""); await loadPage(slug); return true;
  }
  async function publishPage() {
    if (!db || !page) return;
    setBusy(true); setNotice(""); setError("");
    const { error: saveError } = await db.from("cms_pages").upsert({ slug, title: page.title, seo_title: page.seo_title, seo_description: page.seo_description, draft_content: draft }, { onConflict: "slug" });
    if (saveError) { setError(saveError.message); setBusy(false); return; }
    const { error: publishError } = await db.from("cms_published_pages").upsert({ slug, title: page.title, seo_title: page.seo_title, seo_description: page.seo_description, content: draft, published_at: new Date().toISOString() }, { onConflict: "slug" });
    if (publishError) setError(publishError.message); else { setPublished(true); setNotice(`${pageName} published. The live page now uses this content.`); }
    setBusy(false);
  }
  async function unpublishPage() {
    if (!db || !window.confirm(`Unpublish ${pageName}? The live page will return to its built-in content.`)) return;
    setBusy(true);
    const { error: result } = await db.from("cms_published_pages").delete().eq("slug", slug);
    if (result) setError(result.message); else { setPublished(false); setNotice("Page unpublished; built-in page content is live again."); }
    setBusy(false);
  }
  async function uploadFiles(section: CmsSection, files: FileList | null, field: "media_path" | "mobile_media_path" | "thumbnail_path") {
    if (!files) return;
    const index = sections.findIndex(item => item.id === section.id);
    setBusy(true); setError("");
    try {
      let paths: string[] = [];
      for (const file of Array.from(files)) {
        const asset = await uploadCmsMedia(file, slug, section.id);
        paths.push(asset.file_path);
        if (field !== "media_path") break;
      }
      if (paths[0]) patchSection(index, { [field]: field === "media_path" && section.type === "gallery" ? [section.media_path, ...paths].filter(Boolean).join("\n") : paths[0] });
      const { data } = await db!.from("media_assets").select("id,page_slug,section_key,media_type,file_path,title,description,alt_text,caption,is_active").eq("page_slug", slug).order("created_at", { ascending: false });
      setAssets((data || []) as Asset[]);
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Upload failed."); }
    finally { setBusy(false); }
  }
  function addSection() { setDraft(value => ({ ...value, sections: [...value.sections, defaultCmsSection()] })); }

  return <div className="cms-admin">
    <div className="cms-admin-toolbar"><label>Website page<select value={slug} onChange={event => setSlug(event.target.value)}>{CMS_PAGES.map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label><div className="cms-admin-actions"><a className="media-admin-secondary" href={slug === "home" ? "/" : `/${slug}`} target="_blank" rel="noreferrer"><Eye size={15}/> Preview</a></div></div>
    {error && <div className="media-admin-error" role="alert">{error}</div>}{notice && <div className="media-admin-notice" role="status">{notice}</div>}
    {page && <>
      <section className="cms-admin-card"><div className="cms-admin-card-title"><div><span className="media-admin-eyebrow">PAGE SETTINGS</span><h2>{pageName}</h2></div><span className={`property-admin-status ${published ? "published" : "draft"}`}>{published ? "Published" : "Draft only"}</span></div>
        <div className="cms-admin-fields"><label>Page title<input value={page.title} onChange={event => changeMetadata({ title: event.target.value })}/></label><label>SEO title<input value={page.seo_title} onChange={event => changeMetadata({ seo_title: event.target.value })}/></label><label className="wide">SEO description<textarea rows={2} value={page.seo_description} onChange={event => changeMetadata({ seo_description: event.target.value })}/></label></div>
        <div className="cms-admin-actions"><button type="button" className="media-admin-secondary" disabled={busy} onClick={() => void persistDraft()}><Save size={15}/> Save draft</button><button type="button" className="media-admin-primary" disabled={busy} onClick={() => void publishPage()}><Send size={15}/> {busy ? "Saving…" : "Publish changes"}</button>{published && <button type="button" className="media-admin-secondary" disabled={busy} onClick={() => void unpublishPage()}>Unpublish</button>}</div>
      </section>
      <div className="cms-admin-section-heading"><div><span className="media-admin-eyebrow">PAGE CONTENT</span><h2>Sections <small>{sections.length}</small></h2></div><button className="media-admin-primary" type="button" onClick={addSection}><FilePlus2 size={15}/> Add section</button></div>
      {sections.map((section, index) => <article className="cms-admin-section" key={section.id}><header><div><span className="cms-section-order">{String(index + 1).padStart(2, "0")}</span><strong>{section.title || section.type}</strong><select aria-label="Section type" value={section.type} onChange={event => patchSection(index, { type: event.target.value as CmsSection["type"] })}>{types.map(type => <option key={type} value={type}>{type.replaceAll("-", " ")}</option>)}</select></div><div><button type="button" title="Move up" disabled={!index} onClick={() => moveSection(index, -1)}><ArrowUp size={15}/></button><button type="button" title="Move down" disabled={index === sections.length - 1} onClick={() => moveSection(index, 1)}><ArrowDown size={15}/></button><button type="button" className="danger" title="Delete section" onClick={() => setDraft(value => ({ ...value, sections: value.sections.filter(item => item.id !== section.id) }))}><Trash2 size={15}/></button></div></header>
        <div className="cms-admin-fields"><label>Eyebrow<input value={section.eyebrow || ""} onChange={event => patchSection(index, { eyebrow: event.target.value })}/></label><label>Heading<input value={section.title || ""} onChange={event => patchSection(index, { title: event.target.value })}/></label>{section.type === "hero" && <label>Heading accent<input value={section.accent || ""} onChange={event => patchSection(index, { accent: event.target.value })}/></label>}<label className="wide">Description / paragraphs<textarea rows={4} value={section.body || ""} onChange={event => patchSection(index, { body: event.target.value })}/></label><label>Button label<input value={section.button_label || ""} onChange={event => patchSection(index, { button_label: event.target.value })}/></label><label>Button link<input value={section.button_url || ""} onChange={event => patchSection(index, { button_url: event.target.value })} placeholder="/contact or #contact"/></label>
          {["image", "gallery", "video", "hero", "text", "cta"].includes(section.type) && <>
            {section.type !== "gallery" && <label>Desktop image / video<select value={section.media_path || ""} onChange={event => patchSection(index, { media_path: event.target.value })}><option value="">No media</option>{assets.map(asset => <option value={asset.file_path} key={asset.id}>{asset.media_type === "video" ? "Video · " : "Image · "}{asset.title || asset.file_path}</option>)}</select></label>}<label className="cms-upload-field"><span>{section.type === "gallery" ? "Upload gallery images or videos" : "Upload desktop media"} <ImagePlus size={14}/><Video size={14}/></span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm" multiple={section.type === "gallery"} disabled={busy} onChange={event => { void uploadFiles(section, event.target.files, "media_path"); event.currentTarget.value = ""; }}/></label>
            {section.type === "gallery" && <div className="cms-gallery-assets wide">{(section.media_path || "").split("\n").filter(Boolean).map((path, mediaIndex, paths) => <div key={`${path}-${mediaIndex}`}>{signed[path] && (path.match(/\.(mp4|webm)$/i) ? <video className="cms-gallery-thumb" src={signed[path]} muted preload="metadata"/> : <img className="cms-gallery-thumb" src={signed[path]} alt={section.alt_text || "Gallery preview"}/>)}<select aria-label={`Gallery item ${mediaIndex + 1}`} value={path} onChange={event => { const next = [...paths]; next[mediaIndex] = event.target.value; patchSection(index, { media_path: next.join("\n") }); }}><option value={path}>{assets.find(asset => asset.file_path === path)?.title || path}</option>{assets.map(asset => <option key={asset.id} value={asset.file_path}>{asset.media_type === "video" ? "Video · " : "Image · "}{asset.title}</option>)}</select><button type="button" disabled={mediaIndex === 0} aria-label="Move media up" onClick={() => { const next = [...paths]; const current = next[mediaIndex]; const before = next[mediaIndex - 1]; if (!current || !before) return; next[mediaIndex - 1] = current; next[mediaIndex] = before; patchSection(index, { media_path: next.join("\n") }); }}><ArrowUp size={14}/></button><button type="button" disabled={mediaIndex === paths.length - 1} aria-label="Move media down" onClick={() => { const next = [...paths]; const current = next[mediaIndex]; const after = next[mediaIndex + 1]; if (!current || !after) return; next[mediaIndex + 1] = current; next[mediaIndex] = after; patchSection(index, { media_path: next.join("\n") }); }}><ArrowDown size={14}/></button><button type="button" className="danger" aria-label="Remove from gallery" onClick={() => patchSection(index, { media_path: paths.filter((_, itemIndex) => itemIndex !== mediaIndex).join("\n") })}><Trash2 size={14}/></button></div>)}</div>}
            <label>Mobile image variant<select value={section.mobile_media_path || ""} onChange={event => patchSection(index, { mobile_media_path: event.target.value })}><option value="">Use desktop image</option>{assets.filter(asset => asset.media_type === "image").map(asset => <option value={asset.file_path} key={asset.id}>{asset.title || asset.file_path}</option>)}</select></label><label className="cms-upload-field"><span>Upload mobile image <ImagePlus size={14}/></span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={event => { void uploadFiles(section, event.target.files, "mobile_media_path"); event.currentTarget.value = ""; }}/></label>
            <label>Image alt text<input value={section.alt_text || ""} onChange={event => patchSection(index, { alt_text: event.target.value })}/></label><label>Image/video title<input value={section.media_title || ""} onChange={event => patchSection(index, { media_title: event.target.value })}/></label><label className="wide">Media description / caption<textarea rows={2} value={section.media_description || section.caption || ""} onChange={event => patchSection(index, { media_description: event.target.value, caption: event.target.value })}/></label>
            {section.type === "video" && <><label>Video thumbnail<select value={section.thumbnail_path || ""} onChange={event => patchSection(index, { thumbnail_path: event.target.value })}><option value="">No thumbnail</option>{assets.filter(asset => asset.media_type === "image").map(asset => <option value={asset.file_path} key={asset.id}>{asset.title || asset.file_path}</option>)}</select></label><label className="cms-upload-field"><span>Upload video thumbnail <ImagePlus size={14}/></span><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={event => { void uploadFiles(section, event.target.files, "thumbnail_path"); event.currentTarget.value = ""; }}/></label></>}
            {section.media_path && signed[section.media_path.split("\n")[0] || ""] && <div className="cms-admin-preview">{section.media_path.split("\n")[0]?.match(/\.(mp4|webm)$/i) ? <video src={signed[section.media_path.split("\n")[0] || ""]} controls preload="metadata"/> : <img src={signed[section.media_path.split("\n")[0] || ""]} alt={section.alt_text || "Selected media preview"}/>}</div>}
          </>}
          <label><span>Section active</span><input type="checkbox" checked={section.active !== false} onChange={event => patchSection(index, { active: event.target.checked })}/></label>
          {section.type === "services" && <div className="cms-items-editor wide"><div className="cms-admin-section-heading"><strong>Editable service cards</strong><button type="button" className="media-admin-secondary" onClick={() => patchSection(index, { items: [...(section.items || []), { id: crypto.randomUUID(), title: "New service", body: "", button_label: "Enquire", button_url: "/contact", media_path: "", alt_text: "" }] })}><FilePlus2 size={14}/> Add service</button></div>{(section.items || []).map((item, itemIndex) => <div className="cms-item-fields" key={item.id}><label>Service title<input value={item.title} onChange={event => patchItem(index, itemIndex, { title: event.target.value })}/></label><label>Button label<input value={item.button_label || ""} onChange={event => patchItem(index, itemIndex, { button_label: event.target.value })}/></label><label className="wide">Description<textarea rows={2} value={item.body} onChange={event => patchItem(index, itemIndex, { body: event.target.value })}/></label><label>Button link<input value={item.button_url || ""} onChange={event => patchItem(index, itemIndex, { button_url: event.target.value })}/></label><label>Card image<select value={item.media_path || ""} onChange={event => patchItem(index, itemIndex, { media_path: event.target.value })}><option value="">No image</option>{assets.filter(asset => asset.media_type === "image").map(asset => <option key={asset.id} value={asset.file_path}>{asset.title}</option>)}</select></label><label>Image alt text<input value={item.alt_text || ""} onChange={event => patchItem(index, itemIndex, { alt_text: event.target.value })}/></label><button type="button" className="danger" onClick={() => patchSection(index, { items: (section.items || []).filter((_, i) => i !== itemIndex) })}><Trash2 size={14}/> Remove service</button></div>)}</div>}
        </div>
      </article>)}
      {!sections.length && <div className="media-admin-empty">No sections yet. Add a section to start building this page.</div>}
    </>}
  </div>;
}
