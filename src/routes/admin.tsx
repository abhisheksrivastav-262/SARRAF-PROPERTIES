import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, Film, ImagePlus, LogOut, RefreshCw, Trash2, Upload } from "lucide-react";
import { getSupabase, isMediaAdmin, MEDIA_PAGES, mediaBucket, maxImageMb, maxVideoMb, type MediaAsset } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({ component: AdminRouteShell });
const accept = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm";

function AdminRouteShell() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  return pathname === "/admin" || pathname === "/admin/" ? <AdminDashboard /> : <Outlet />;
}

function AdminDashboard() {
  const navigate = useNavigate(); const supabase = getSupabase();
  const [authorized, setAuthorized] = useState(false); const [checking, setChecking] = useState(true);
  const [page, setPage] = useState<string>("home"); const [section, setSection] = useState("hero");
  const [assets, setAssets] = useState<MediaAsset[]>([]); const [allAssets, setAllAssets] = useState<MediaAsset[]>([]);
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false); const fileRef = useRef<HTMLInputElement>(null);
  const currentPage = MEDIA_PAGES.find(item => item.slug === page)!;
  const loadAssets = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("media_assets").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) { setMessage(`Media database unavailable: ${error.message}. Complete the schema and policies in SUPABASE_SETUP.md.`); return; }
    const rows = (data || []) as MediaAsset[]; setAllAssets(rows); setAssets(rows.filter(item => item.page_slug === page && item.section_key === section));
  }, [supabase, page, section]);
  useEffect(() => {
    let active = true;
    if (!supabase) { setChecking(false); return; }
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!isMediaAdmin(data.user)) { setChecking(false); void navigate({ to: "/admin/login" }); return; }
      setAuthorized(true); setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMediaAdmin(session?.user)) { setAuthorized(false); void navigate({ to: "/admin/login" }); }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [navigate, supabase]);
  useEffect(() => { if (authorized) void loadAssets(); }, [authorized, loadAssets]);
  useEffect(() => { setAssets(allAssets.filter(item => item.page_slug === page && item.section_key === section)); }, [allAssets, page, section]);

  async function uploadFile(file: File, replaceId?: string) {
    if (!supabase) return;
    const video = file.type.startsWith("video/"); const max = (video ? maxVideoMb : maxImageMb) * 1024 * 1024;
    const valid = video ? ["video/mp4", "video/webm"].includes(file.type) : ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type);
    if (!valid) { setMessage("Choose a JPG, PNG, WEBP, AVIF, MP4, or WEBM file."); return; }
    if (file.size > max) { setMessage(`${video ? "Video" : "Image"} exceeds the ${video ? maxVideoMb : maxImageMb} MB limit.`); return; }
    const { data: sessionData } = await supabase.auth.getSession(); const session = sessionData.session;
    if (!session) { setMessage("Your session expired. Please sign in again."); return; }
    setBusy(true); setProgress(0); setMessage("");
    const ext = file.name.split(".").pop()?.toLowerCase() || (video ? "mp4" : "jpg");
    const path = `${page}/${section}/${crypto.randomUUID()}.${ext}`;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${encodeURIComponent(mediaBucket)}/${encodedPath}`;
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest(); xhr.open("POST", endpoint); xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`); xhr.setRequestHeader("apikey", import.meta.env.VITE_SUPABASE_ANON_KEY); xhr.setRequestHeader("Content-Type", file.type); xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = event => { if (event.lengthComputable) setProgress(Math.round(event.loaded / event.total * 100)); };
        xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Storage upload failed (${xhr.status}): ${xhr.responseText}`)); xhr.onerror = () => reject(new Error("Network error while uploading.")); xhr.send(file);
      });
      const { data: publicData } = supabase.storage.from(mediaBucket).getPublicUrl(path);
      const previous = replaceId ? assets.find(item => item.id === replaceId) : undefined;
      const fields = { page_slug: page, section_key: section, media_type: video ? "video" : "image", file_path: path, public_url: publicData.publicUrl, title: previous?.title || file.name.replace(/\.[^.]+$/, ""), alt_text: previous?.alt_text || "", caption: previous?.caption || "", sort_order: previous?.sort_order ?? assets.length };
      const result = previous ? await supabase.from("media_assets").update(fields).eq("id", previous.id) : await supabase.from("media_assets").insert(fields);
      if (result.error) throw new Error(`File uploaded but metadata was not saved: ${result.error.message}`);
      const slot = await supabase.from("media_slots").upsert({ page_slug: page, section_key: section, use_managed_media: true, updated_at: new Date().toISOString() }, { onConflict: "page_slug,section_key" });
      if (slot.error) throw new Error(`Media uploaded, but the page placement could not be enabled: ${slot.error.message}`);
      if (previous?.file_path) await supabase.storage.from(mediaBucket).remove([previous.file_path]);
      setMessage(previous ? "Media replaced successfully." : "Media uploaded successfully."); await loadAssets();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); setProgress(0); }
  }
  async function saveAsset(asset: MediaAsset, patch: Partial<MediaAsset>) {
    if (!supabase) return;
    const { error } = await supabase.from("media_assets").update(patch).eq("id", asset.id);
    if (error) { setMessage(error.message); return; }
    setAllAssets(rows => rows.map(row => row.id === asset.id ? { ...row, ...patch } : row)); setMessage("Media details saved.");
  }
  async function removeAsset(asset: MediaAsset) {
    if (!supabase || !window.confirm(`Remove “${asset.title || asset.file_path}” from the website?`)) return;
    setBusy(true);
    const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
    if (!error) { const removed = await supabase.storage.from(mediaBucket).remove([asset.file_path]); if (removed.error) setMessage(`Metadata removed; storage cleanup needs attention: ${removed.error.message}`); else setMessage("Media removed."); await loadAssets(); }
    else setMessage(error.message);
    setBusy(false);
  }
  async function shift(asset: MediaAsset, offset: number) {
    const ordered = [...assets].sort((a, b) => a.sort_order - b.sort_order); const index = ordered.findIndex(row => row.id === asset.id); const other = ordered[index + offset];
    if (!other || !supabase) return;
    const { error } = await supabase.from("media_assets").update({ sort_order: other.sort_order }).eq("id", asset.id);
    if (!error) await supabase.from("media_assets").update({ sort_order: asset.sort_order }).eq("id", other.id);
    await loadAssets();
  }
  const totals = useMemo(() => ({ images: allAssets.filter(item => item.media_type === "image").length, videos: allAssets.filter(item => item.media_type === "video").length }), [allAssets]);
  async function logout() { await supabase?.auth.signOut(); await navigate({ to: "/admin/login" }); }
  if (checking) return <div className="media-admin-loading">Checking administrator access…</div>;
  if (!authorized) return <div className="media-admin-loading"><p>Supabase configuration is required for the protected dashboard.</p><Link to="/admin/login">Go to sign in</Link></div>;
  return <main className="media-admin"><aside className="media-admin-sidebar"><Link to="/admin" className="media-admin-brand">SARRAF <span>PROPERTIES</span></Link><p className="media-admin-eyebrow">MEDIA STUDIO</p><div className="media-admin-nav"><span className="active">▧ &nbsp; Media library</span><Link to="/">↗ &nbsp; View website</Link></div><button className="media-admin-logout" onClick={logout}><LogOut size={16}/> Sign out</button></aside>
    <section className="media-admin-main"><header className="media-admin-header"><div><p className="media-admin-eyebrow">WEBSITE CONTENT</p><h1>Media library</h1><p className="media-admin-muted">Manage images and videos by page and section.</p></div><button className="media-admin-secondary" onClick={() => void loadAssets()}><RefreshCw size={16}/> Refresh</button></header>
      <div className="media-admin-stats"><article><ImagePlus/><span>Images</span><strong>{totals.images}</strong></article><article><Film/><span>Videos</span><strong>{totals.videos}</strong></article><article><span className="media-admin-stat-icon">10</span><span>Website pages</span><strong>10</strong></article><article><RefreshCw/><span>Recently uploaded</span><strong>{allAssets.slice(0, 5).length}</strong></article></div>
      <section className="media-admin-recent"><div><h2>Recently uploaded</h2><p className="media-admin-muted">Latest media added to your website.</p></div>{allAssets.slice(0, 5).length ? <ul>{allAssets.slice(0, 5).map(item => <li key={item.id}><span className="media-admin-recent-type">{item.media_type === "video" ? <Film size={15}/> : <ImagePlus size={15}/>}</span><span><strong>{item.title || item.file_path.split("/").at(-1)}</strong><small>{MEDIA_PAGES.find(entry => entry.slug === item.page_slug)?.name || item.page_slug} · {item.section_key}</small></span><time>{new Date(item.created_at).toLocaleDateString()}</time></li>)}</ul> : <p className="media-admin-empty">No media uploaded yet.</p>}</section>
      <section className="media-admin-library"><div className="media-admin-library-head"><div><h2>Page media</h2><p className="media-admin-muted">Choose a page and placement to manage its media.</p></div><div className="media-admin-selects"><label>Page<select value={page} onChange={e => { const next = MEDIA_PAGES.find(item => item.slug === e.target.value)!; setPage(next.slug); setSection(next.sections[0]); }}>{MEDIA_PAGES.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label><label>Section<select value={section} onChange={e => setSection(e.target.value)}>{currentPage.sections.map(item => <option key={item} value={item}>{item.replaceAll("-", " ").replace(/\b\w/g, c => c.toUpperCase())}</option>)}</select></label></div></div>
      {message && <div className="media-admin-notice" role="status">{message}</div>}
      <div className={`media-admin-dropzone ${dragging ? "dragging" : ""}`} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); for (const file of Array.from(event.dataTransfer.files)) void uploadFile(file); }}><Upload/><strong>Drop image or video files here</strong><span>JPG, PNG, WEBP, AVIF up to {maxImageMb} MB · MP4, WEBM up to {maxVideoMb} MB</span><button className="media-admin-primary" disabled={busy} onClick={() => fileRef.current?.click()}><ImagePlus size={16}/> Browse files</button><input ref={fileRef} hidden type="file" accept={accept} multiple onChange={event => { for (const file of Array.from(event.target.files || [])) void uploadFile(file); event.currentTarget.value = ""; }}/>{busy && <div className="media-admin-progress"><span style={{ width: `${progress}%` }}/></div>}</div>
      {assets.length === 0 ? <div className="media-admin-empty">No uploaded media in this placement yet. Current site images remain in place until you upload and publish managed media here.</div> : <div className="media-admin-grid">{assets.map((asset, index) => <article className="media-admin-card" key={asset.id}><div className="media-admin-preview">{asset.media_type === "video" ? <video src={asset.public_url} controls preload="metadata"/> : <img src={asset.public_url} alt={asset.alt_text || asset.title}/>}</div><div className="media-admin-fields"><label>Title<input value={asset.title || ""} onChange={e => setAllAssets(rows => rows.map(row => row.id === asset.id ? { ...row, title: e.target.value } : row))} onBlur={e => void saveAsset(asset, { title: e.target.value })}/></label><label>Alt text<input value={asset.alt_text || ""} onChange={e => setAllAssets(rows => rows.map(row => row.id === asset.id ? { ...row, alt_text: e.target.value } : row))} onBlur={e => void saveAsset(asset, { alt_text: e.target.value })}/></label><label>Caption<textarea value={asset.caption || ""} onChange={e => setAllAssets(rows => rows.map(row => row.id === asset.id ? { ...row, caption: e.target.value } : row))} onBlur={e => void saveAsset(asset, { caption: e.target.value })}/></label></div><div className="media-admin-card-actions"><button title="Move up" disabled={index === 0} onClick={() => void shift(asset, -1)}><ArrowUp size={16}/></button><button title="Move down" disabled={index === assets.length - 1} onClick={() => void shift(asset, 1)}><ArrowDown size={16}/></button><label className="media-admin-replace">Replace<input type="file" accept={accept} hidden onChange={e => { const file = e.target.files?.[0]; if (file) void uploadFile(file, asset.id); e.currentTarget.value = ""; }}/></label><button className="danger" title="Remove media" onClick={() => void removeAsset(asset)}><Trash2 size={16}/></button><span className="media-admin-saved"><Check size={13}/></span></div></article>)}</div>}
      </section><p className="media-admin-footnote">Storage and publishing are protected by Supabase Row Level Security. Public pages use the existing site media until managed media integration is configured.</p>
    </section></main>;
}
