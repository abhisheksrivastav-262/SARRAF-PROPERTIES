import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Building2,
  Check,
  FileText,
  Film,
  Home,
  ImagePlus,
  Images,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Phone,
  RefreshCw,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  getSupabase,
  isMediaAdmin,
  MEDIA_PAGES,
  mediaBucket,
  maxImageMb,
  maxVideoMb,
  type MediaAsset,
} from "@/lib/supabase";
import { PropertyManager } from "@/components/admin/PropertyManager";
import { CmsPageManager } from "@/components/admin/CmsPageManager";
import { CmsSettingsManager } from "@/components/admin/CmsSettingsManager";
import { AdminOverview, type AdminDestination } from "@/components/admin/AdminOverview";
import { bundledSiteMedia, CMS_PAGES, signedMediaUrl } from "@/lib/cms";
import adminLogo from "@/assets/sarraf-logo-mark.webp";

export const Route = createFileRoute("/admin")({ component: AdminRouteShell });
const accept = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm";
const formatAssetSize = (bytes?: number) =>
  bytes === undefined
    ? "Size unavailable"
    : bytes < 1024 * 1024
      ? `${Math.max(1, Math.round(bytes / 1024))} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

function AdminRouteShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/admin" || pathname === "/admin/" ? <AdminDashboard /> : <Outlet />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const supabase = getSupabase();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [page, setPage] = useState<string>("home");
  const [section, setSection] = useState("hero");
  const [activePanel, setActivePanel] = useState<AdminDestination>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmsDirty, setCmsDirty] = useState(false);
  const [allAssets, setAllAssets] = useState<MediaAsset[]>([]);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [assetSizes, setAssetSizes] = useState<Record<string, number>>({});
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "image" | "video">("all");
  const [mediaPageFilter, setMediaPageFilter] = useState("all");
  const [mediaSectionFilter, setMediaSectionFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const currentPage = MEDIA_PAGES.find((item) => item.slug === page)!;
  const activePageSlug = activePanel.startsWith("page:") ? activePanel.slice("page:".length) : "";
  const activePageName = CMS_PAGES.find(([slug]) => slug === activePageSlug)?.[1];
  const panelTitle =
    activePanel === "dashboard"
      ? "Dashboard"
      : activePanel === "media"
        ? "Media Library"
        : activePanel === "properties"
          ? "Property Management"
          : activePanel === "settings"
            ? "CMS Settings"
            : activePageName || "Page Management";
  const panelDescription =
    activePanel === "dashboard"
      ? "A live overview of your website content and listings."
      : activePanel === "media"
        ? "Search, preview, and manage managed images and videos."
        : activePanel === "properties"
          ? "Manage existing listings, property media, and publishing."
          : activePanel === "settings"
            ? "Edit the brand and contact details used across the website."
            : `Manage the ${activePageName || "selected"} page content, media, and publishing.`;
  const visibleAssets = useMemo(
    () =>
      allAssets.filter((asset) => {
        const search = mediaSearch.trim().toLowerCase();
        return (
          (!search ||
            `${asset.title} ${asset.file_path} ${asset.description} ${asset.caption}`
              .toLowerCase()
              .includes(search)) &&
          (mediaTypeFilter === "all" || asset.media_type === mediaTypeFilter) &&
          (mediaPageFilter === "all" || asset.page_slug === mediaPageFilter) &&
          (mediaSectionFilter === "all" || asset.section_key === mediaSectionFilter)
        );
      }),
    [allAssets, mediaPageFilter, mediaSearch, mediaSectionFilter, mediaTypeFilter],
  );
  function navigatePanel(destination: AdminDestination) {
    if (
      cmsDirty &&
      !window.confirm("You have unsaved page changes. Leave this editor and discard them?")
    )
      return;
    setCmsDirty(false);
    setActivePanel(destination);
    setMenuOpen(false);
  }
  const loadAssets = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("media_assets")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) {
      setMessage(
        `Media database unavailable: ${error.message}. Complete the schema and policies in SUPABASE_SETUP.md.`,
      );
      return;
    }
    const rows = (data || []) as MediaAsset[];
    setAllAssets(rows);
    const urls = await Promise.all(
      rows.map(async (row) => [row.id, await signedMediaUrl(row.file_path)] as const),
    );
    setAssetUrls(Object.fromEntries(urls));
    const folders = [
      ...new Set(
        rows.map((row) => row.file_path.slice(0, row.file_path.lastIndexOf("/"))).filter(Boolean),
      ),
    ];
    const sizes: Record<string, number> = {};
    for (let index = 0; index < folders.length; index += 8) {
      const folderResults = await Promise.all(
        folders.slice(index, index + 8).map(async (folder) => ({
          folder,
          result: await supabase.storage.from(mediaBucket).list(folder, { limit: 1000 }),
        })),
      );
      for (const { folder, result } of folderResults) {
        if (result.error) continue;
        for (const entry of result.data || []) {
          const size = Number(entry.metadata?.size);
          if (Number.isFinite(size)) sizes[`${folder}/${entry.name}`] = size;
        }
      }
    }
    setAssetSizes(sizes);
  }, [supabase]);
  useEffect(() => {
    let active = true;
    if (!supabase) {
      setChecking(false);
      return;
    }
    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!isMediaAdmin(data.user)) {
        setChecking(false);
        void navigate({ to: "/admin/login" });
        return;
      }
      setAuthorized(true);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMediaAdmin(session?.user)) {
        setAuthorized(false);
        void navigate({ to: "/admin/login" });
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate, supabase]);
  useEffect(() => {
    if (authorized) void loadAssets();
  }, [authorized, loadAssets]);

  async function uploadFile(file: File, replaceId?: string) {
    if (!supabase) return;
    const video = file.type.startsWith("video/");
    const max = (video ? maxVideoMb : maxImageMb) * 1024 * 1024;
    const valid = video
      ? ["video/mp4", "video/webm"].includes(file.type)
      : ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type);
    if (!valid) {
      setMessage("Choose a JPG, PNG, WEBP, AVIF, MP4, or WEBM file.");
      return;
    }
    if (file.size > max) {
      setMessage(
        `${video ? "Video" : "Image"} exceeds the ${video ? maxVideoMb : maxImageMb} MB limit.`,
      );
      return;
    }
    const previous = replaceId ? allAssets.find((item) => item.id === replaceId) : undefined;
    if (previous) {
      const [draftPages, livePages, settingsResult, propertyResult, propertyVideoResult] =
        await Promise.all([
          supabase.from("cms_pages").select("draft_content"),
          supabase.from("cms_published_pages").select("content"),
          supabase.from("cms_published_settings").select("settings").eq("id", true),
          supabase.from("property_images").select("id").eq("media_asset_id", previous.id).limit(1),
          supabase.from("property_videos").select("id").eq("media_asset_id", previous.id).limit(1),
        ]);
      if (
        draftPages.error ||
        livePages.error ||
        settingsResult.error ||
        propertyResult.error ||
        propertyVideoResult.error
      ) {
        setMessage("Could not verify media references. Nothing was replaced.");
        return;
      }
      const paths = [
        previous.file_path,
        previous.mobile_file_path,
        previous.thumbnail_file_path,
      ].filter((value): value is string => Boolean(value));
      const documents = [
        ...(draftPages.data || []),
        ...(livePages.data || []),
        ...(settingsResult.data || []),
      ];
      if (
        propertyResult.data?.length ||
        propertyVideoResult.data?.length ||
        documents.some((row) => paths.some((item) => JSON.stringify(row).includes(item)))
      ) {
        setMessage(
          "This media is assigned to page or property content. Replace it in that content, publish, then delete the old unused file.",
        );
        return;
      }
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      setMessage("Your session expired. Please sign in again.");
      return;
    }
    setBusy(true);
    setProgress(0);
    setMessage("");
    const ext = file.name.split(".").pop()?.toLowerCase() || (video ? "mp4" : "jpg");
    const targetPage = previous?.page_slug || page;
    const targetSection = previous?.section_key || section;
    const path = `${targetPage}/${targetSection}/${crypto.randomUUID()}.${ext}`;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const endpoint = `${import.meta.env["VITE_SUPABASE_URL"]}/storage/v1/object/${encodeURIComponent(mediaBucket)}/${encodedPath}`;
    try {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", endpoint);
        xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
        xhr.setRequestHeader("apikey", import.meta.env["VITE_SUPABASE_ANON_KEY"]);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) setProgress(Math.round((event.loaded / event.total) * 100));
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error(`Storage upload failed (${xhr.status}): ${xhr.responseText}`));
        xhr.onerror = () => reject(new Error("Network error while uploading."));
        xhr.send(file);
      });
      const { data: publicData } = supabase.storage.from(mediaBucket).getPublicUrl(path);
      const fields = {
        page_slug: targetPage,
        section_key: targetSection,
        media_type: video ? "video" : "image",
        file_path: path,
        public_url: publicData.publicUrl,
        title: previous?.title || file.name.replace(/\.[^.]+$/, ""),
        alt_text: previous?.alt_text || "",
        caption: previous?.caption || "",
        sort_order:
          previous?.sort_order ??
          allAssets.filter(
            (item) => item.page_slug === targetPage && item.section_key === targetSection,
          ).length,
      };
      const result = previous
        ? await supabase.from("media_assets").update(fields).eq("id", previous.id)
        : await supabase.from("media_assets").insert(fields);
      if (result.error)
        throw new Error(`File uploaded but metadata was not saved: ${result.error.message}`);
      const slot = await supabase.from("media_slots").upsert(
        {
          page_slug: targetPage,
          section_key: targetSection,
          use_managed_media: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_slug,section_key" },
      );
      if (slot.error)
        throw new Error(
          `Media uploaded, but the page placement could not be enabled: ${slot.error.message}`,
        );
      if (previous?.file_path)
        await supabase.storage.from(mediaBucket).remove([previous.file_path]);
      setMessage(previous ? "Media replaced successfully." : "Media uploaded successfully.");
      await loadAssets();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }
  async function importBundledMedia(asset: (typeof bundledSiteMedia)[number]) {
    if (!supabase) return;
    const ext = asset.url.split("?")[0]?.split(".").pop()?.toLowerCase() || "webp";
    const path = `site-imports/${asset.key.replace("static:", "")}.${ext}`;
    if (allAssets.some((row) => row.file_path === path)) {
      setMessage(`${asset.title} is already in the Media Library.`);
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(asset.url);
      if (!response.ok) throw new Error(`Could not read bundled image (${response.status}).`);
      const blob = await response.blob();
      const mime = blob.type || (ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/webp");
      const { error: uploadError } = await supabase.storage
        .from(mediaBucket)
        .upload(path, blob, { contentType: mime, upsert: false });
      if (uploadError) throw new Error(`Storage import failed: ${uploadError.message}`);
      const publicUrl = supabase.storage.from(mediaBucket).getPublicUrl(path).data.publicUrl;
      const { error: metadataError } = await supabase.from("media_assets").insert({
        page_slug: page,
        section_key: "imported-site-assets",
        media_type: "image",
        file_path: path,
        public_url: publicUrl,
        title: asset.title,
        description: "Imported from a bundled Sarraf Properties website image.",
        alt_text: asset.title,
        caption: "",
        sort_order: allAssets.length,
        is_active: true,
      });
      if (metadataError) {
        await supabase.storage.from(mediaBucket).remove([path]);
        throw new Error(
          `Storage upload was rolled back because metadata could not be saved: ${metadataError.message}`,
        );
      }
      await loadAssets();
      setMessage(`${asset.title} imported. The original bundled file remains unchanged.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Bundled image import failed.");
    } finally {
      setBusy(false);
    }
  }
  async function saveAsset(asset: MediaAsset, patch: Partial<MediaAsset>) {
    if (!supabase) return;
    const { error } = await supabase.from("media_assets").update(patch).eq("id", asset.id);
    if (error) {
      setMessage(error.message);
      return;
    }
    setAllAssets((rows) => rows.map((row) => (row.id === asset.id ? { ...row, ...patch } : row)));
    setMessage("Media details saved.");
  }
  async function removeAsset(asset: MediaAsset) {
    if (
      !supabase ||
      !window.confirm(`Remove “${asset.title || asset.file_path}” from the website?`)
    )
      return;
    setBusy(true);
    const [draftPages, livePages, publishedSettings, propertyLink, propertyVideoLink] =
      await Promise.all([
        supabase.from("cms_pages").select("draft_content"),
        supabase.from("cms_published_pages").select("content"),
        supabase.from("cms_published_settings").select("settings").eq("id", true),
        supabase.from("property_images").select("id").eq("media_asset_id", asset.id).limit(1),
        supabase.from("property_videos").select("id").eq("media_asset_id", asset.id).limit(1),
      ]);
    if (
      draftPages.error ||
      livePages.error ||
      publishedSettings.error ||
      propertyLink.error ||
      propertyVideoLink.error
    ) {
      setMessage(
        "Could not verify media references. Nothing was deleted; retry after the CMS schema is available.",
      );
      setBusy(false);
      return;
    }
    const assetPaths = [asset.file_path, asset.mobile_file_path, asset.thumbnail_file_path].filter(
      (path): path is string => Boolean(path),
    );
    const documents = [
      ...(draftPages.data || []),
      ...(livePages.data || []),
      ...(publishedSettings.data || []),
    ];
    const referenced =
      Boolean(propertyLink.data?.length || propertyVideoLink.data?.length) ||
      documents.some((row) => assetPaths.some((path) => JSON.stringify(row).includes(path)));
    if (referenced) {
      setMessage(
        "This media is assigned to a page or property. Remove it from that content and save/unpublish before deleting the file.",
      );
      setBusy(false);
      return;
    }
    const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
    if (!error) {
      const removed = await supabase.storage.from(mediaBucket).remove(assetPaths);
      if (removed.error)
        setMessage(`Metadata removed; storage cleanup needs attention: ${removed.error.message}`);
      else setMessage("Media removed.");
      await loadAssets();
    } else setMessage(error.message);
    setBusy(false);
  }
  async function shift(asset: MediaAsset, offset: number) {
    const ordered = allAssets
      .filter((row) => row.page_slug === asset.page_slug && row.section_key === asset.section_key)
      .sort((a, b) => a.sort_order - b.sort_order);
    const index = ordered.findIndex((row) => row.id === asset.id);
    const other = ordered[index + offset];
    if (!other || !supabase) return;
    const { error } = await supabase
      .from("media_assets")
      .update({ sort_order: other.sort_order })
      .eq("id", asset.id);
    if (!error)
      await supabase
        .from("media_assets")
        .update({ sort_order: asset.sort_order })
        .eq("id", other.id);
    await loadAssets();
  }
  const totals = useMemo(
    () => ({
      images: allAssets.filter((item) => item.media_type === "image").length,
      videos: allAssets.filter((item) => item.media_type === "video").length,
    }),
    [allAssets],
  );
  async function logout() {
    await supabase?.auth.signOut();
    await navigate({ to: "/admin/login" });
  }
  if (checking) return <div className="media-admin-loading">Checking administrator access…</div>;
  if (!authorized)
    return (
      <div className="media-admin-loading">
        <p>Supabase configuration is required for the protected dashboard.</p>
        <Link to="/admin/login">Go to sign in</Link>
      </div>
    );
  return (
    <main className="media-admin">
      {menuOpen && (
        <button
          type="button"
          className="media-admin-drawer-backdrop"
          aria-label="Close admin navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`media-admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="media-admin-sidebar-head">
          <Link
            to="/admin"
            className="media-admin-brand"
            onClick={() => navigatePanel("dashboard")}
          >
            <img className="media-admin-brand-mark" src={adminLogo} alt="" />
            <span>
              SARRAF <b>PROPERTIES</b>
            </span>
          </Link>
          <button
            type="button"
            className="media-admin-drawer-close"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={19} />
          </button>
        </div>
        <p className="media-admin-eyebrow">WEBSITE ADMIN</p>
        <nav className="media-admin-nav" aria-label="Admin navigation">
          <span className="media-admin-nav-label">OVERVIEW</span>
          <button
            type="button"
            className={activePanel === "dashboard" ? "active" : ""}
            aria-current={activePanel === "dashboard" ? "page" : undefined}
            onClick={() => navigatePanel("dashboard")}
          >
            <LayoutDashboard size={17} /> Dashboard
          </button>
          <span className="media-admin-nav-label">WEBSITE PAGES</span>
          {CMS_PAGES.map(([slug, label]) => {
            const Icon =
              slug === "home"
                ? Home
                : slug === "locations"
                  ? MapPin
                  : slug === "gallery"
                    ? Images
                    : slug === "services"
                      ? Building2
                      : slug === "contact"
                        ? Phone
                        : FileText;
            const destination: AdminDestination = `page:${slug}`;
            return (
              <button
                key={slug}
                type="button"
                className={activePanel === destination ? "active" : ""}
                aria-current={activePanel === destination ? "page" : undefined}
                onClick={() => navigatePanel(destination)}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
          <span className="media-admin-nav-label">MANAGEMENT</span>
          <button
            type="button"
            className={activePanel === "properties" ? "active" : ""}
            aria-current={activePanel === "properties" ? "page" : undefined}
            onClick={() => navigatePanel("properties")}
          >
            <Building2 size={17} /> Properties
          </button>
          <button
            type="button"
            className={activePanel === "media" ? "active" : ""}
            aria-current={activePanel === "media" ? "page" : undefined}
            onClick={() => navigatePanel("media")}
          >
            <Images size={17} /> Media Library
          </button>
          <button
            type="button"
            className={activePanel === "settings" ? "active" : ""}
            aria-current={activePanel === "settings" ? "page" : undefined}
            onClick={() => navigatePanel("settings")}
          >
            <Settings size={17} /> CMS Settings
          </button>
          <Link to="/" target="_blank" rel="noreferrer">
            <ArrowUpRight size={17} /> View website
          </Link>
        </nav>
        <button className="media-admin-logout" onClick={logout}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <section className="media-admin-main">
        <header className="media-admin-header">
          <div className="media-admin-header-title">
            <button
              type="button"
              className="media-admin-drawer-toggle"
              aria-label="Open admin navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="media-admin-eyebrow">WEBSITE CONTENT</p>
              <h1>{panelTitle}</h1>
              <p className="media-admin-muted">{panelDescription}</p>
            </div>
          </div>
          {activePanel === "media" && (
            <button className="media-admin-secondary" onClick={() => void loadAssets()}>
              <RefreshCw size={16} /> Refresh
            </button>
          )}
        </header>
        {activePanel === "dashboard" ? (
          <AdminOverview onNavigate={navigatePanel} />
        ) : activePanel === "settings" ? (
          <CmsSettingsManager />
        ) : activePanel === "properties" ? (
          <PropertyManager />
        ) : activePanel.startsWith("page:") ? (
          <CmsPageManager pageSlug={activePageSlug} onDirtyChange={setCmsDirty} />
        ) : (
          <>
            <div className="media-admin-stats">
              <article>
                <ImagePlus />
                <span>Images</span>
                <strong>{totals.images}</strong>
              </article>
              <article>
                <Film />
                <span>Videos</span>
                <strong>{totals.videos}</strong>
              </article>
              <article>
                <span className="media-admin-stat-icon">10</span>
                <span>Website pages</span>
                <strong>10</strong>
              </article>
              <article>
                <RefreshCw />
                <span>Recently uploaded</span>
                <strong>{allAssets.slice(0, 5).length}</strong>
              </article>
            </div>
            <section className="media-admin-recent">
              <div>
                <h2>Recently uploaded</h2>
                <p className="media-admin-muted">Latest media added to your website.</p>
              </div>
              {allAssets.slice(0, 5).length ? (
                <ul>
                  {allAssets.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <span className="media-admin-recent-type">
                        {item.media_type === "video" ? <Film size={15} /> : <ImagePlus size={15} />}
                      </span>
                      <span>
                        <strong>{item.title || item.file_path.split("/").at(-1)}</strong>
                        <small>
                          {MEDIA_PAGES.find((entry) => entry.slug === item.page_slug)?.name ||
                            item.page_slug}{" "}
                          · {item.section_key}
                        </small>
                      </span>
                      <time>{new Date(item.created_at).toLocaleDateString()}</time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="media-admin-empty">No media uploaded yet.</p>
              )}
            </section>
            <section className="media-admin-library">
              <div className="media-admin-library-head">
                <div>
                  <h2>All managed media</h2>
                  <p className="media-admin-muted">
                    Search and manage media already assigned to pages and properties.
                  </p>
                </div>
              </div>
              <div className="media-admin-selects media-admin-upload-target">
                <label>
                  Upload to page
                  <select
                    value={page}
                    onChange={(e) => {
                      const next = MEDIA_PAGES.find((item) => item.slug === e.target.value)!;
                      setPage(next.slug);
                      setSection(next.sections[0]);
                    }}
                  >
                    {MEDIA_PAGES.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                    <option value="properties">Properties</option>
                  </select>
                </label>
                <label>
                  Upload to section
                  <select value={section} onChange={(e) => setSection(e.target.value)}>
                    {(currentPage?.sections || ["library"]).map((item) => (
                      <option key={item} value={item}>
                        {item.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="media-admin-library-filters">
                <label>
                  Search media
                  <input
                    type="search"
                    value={mediaSearch}
                    onChange={(event) => setMediaSearch(event.target.value)}
                    placeholder="Filename, title, caption…"
                  />
                </label>
                <label>
                  Type
                  <select
                    value={mediaTypeFilter}
                    onChange={(event) =>
                      setMediaTypeFilter(event.target.value as typeof mediaTypeFilter)
                    }
                  >
                    <option value="all">All types</option>
                    <option value="image">Images</option>
                    <option value="video">Videos</option>
                  </select>
                </label>
                <label>
                  Assigned page
                  <select
                    value={mediaPageFilter}
                    onChange={(event) => {
                      setMediaPageFilter(event.target.value);
                      setMediaSectionFilter("all");
                    }}
                  >
                    <option value="all">All pages</option>
                    {[...new Set(allAssets.map((asset) => asset.page_slug))].map((slug) => (
                      <option key={slug} value={slug}>
                        {MEDIA_PAGES.find((entry) => entry.slug === slug)?.name || slug}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Section
                  <select
                    value={mediaSectionFilter}
                    onChange={(event) => setMediaSectionFilter(event.target.value)}
                  >
                    <option value="all">All sections</option>
                    {[
                      ...new Set(
                        allAssets
                          .filter(
                            (asset) =>
                              mediaPageFilter === "all" || asset.page_slug === mediaPageFilter,
                          )
                          .map((asset) => asset.section_key),
                      ),
                    ].map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </label>
                <span>{visibleAssets.length} items</span>
              </div>
              <section className="media-admin-imports">
                <div>
                  <h3>Existing bundled website images</h3>
                  <p>
                    Import a copy into private Supabase Storage. The project originals remain
                    untouched.
                  </p>
                </div>
                <div className="media-admin-import-grid">
                  {bundledSiteMedia.map((asset) => {
                    const ext = asset.url.split("?")[0]?.split(".").pop()?.toLowerCase() || "webp";
                    const imported = allAssets.some(
                      (row) =>
                        row.file_path === `site-imports/${asset.key.replace("static:", "")}.${ext}`,
                    );
                    return (
                      <article key={asset.key}>
                        <img src={asset.url} alt={asset.title} />
                        <strong>{asset.title}</strong>
                        <button
                          type="button"
                          className={imported ? "media-admin-secondary" : "media-admin-primary"}
                          disabled={busy || imported}
                          onClick={() => void importBundledMedia(asset)}
                        >
                          {imported ? "Imported" : "Import to library"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </section>
              {message && (
                <div className="media-admin-notice" role="status">
                  {message}
                </div>
              )}
              <div
                className={`media-admin-dropzone ${dragging ? "dragging" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  for (const file of Array.from(event.dataTransfer.files)) void uploadFile(file);
                }}
              >
                <Upload />
                <strong>Drop image or video files here</strong>
                <span>
                  JPG, PNG, WEBP, AVIF up to {maxImageMb} MB · MP4, WEBM up to {maxVideoMb} MB
                </span>
                <button
                  className="media-admin-primary"
                  disabled={busy}
                  onClick={() => fileRef.current?.click()}
                >
                  <ImagePlus size={16} /> Browse files
                </button>
                <input
                  ref={fileRef}
                  hidden
                  type="file"
                  accept={accept}
                  multiple
                  onChange={(event) => {
                    for (const file of Array.from(event.target.files || [])) void uploadFile(file);
                    event.currentTarget.value = "";
                  }}
                />
                {busy && (
                  <div className="media-admin-progress">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>
              {visibleAssets.length === 0 ? (
                <div className="media-admin-empty">
                  No managed media matches these filters. Existing static website images remain in
                  place until you import them to this library.
                </div>
              ) : (
                <div className="media-admin-grid">
                  {visibleAssets.map((asset) => {
                    const placement = allAssets
                      .filter(
                        (item) =>
                          item.page_slug === asset.page_slug &&
                          item.section_key === asset.section_key,
                      )
                      .sort((a, b) => a.sort_order - b.sort_order);
                    const position = placement.findIndex((item) => item.id === asset.id);
                    return (
                      <article className="media-admin-card" key={asset.id}>
                        <div className="media-admin-preview">
                          {asset.media_type === "video" ? (
                            <video src={assetUrls[asset.id]} controls preload="metadata" />
                          ) : (
                            <img src={assetUrls[asset.id]} alt={asset.alt_text || asset.title} />
                          )}
                        </div>
                        <div className="media-admin-asset-meta">
                          <span>
                            {asset.media_type === "video" ? "VIDEO" : "IMAGE"} ·{" "}
                            {formatAssetSize(assetSizes[asset.file_path])}
                          </span>
                          <span>
                            {MEDIA_PAGES.find((entry) => entry.slug === asset.page_slug)?.name ||
                              asset.page_slug}{" "}
                            / {asset.section_key}
                          </span>
                          <time>{new Date(asset.created_at).toLocaleDateString()}</time>
                        </div>
                        <div className="media-admin-fields">
                          <label>
                            Title
                            <input
                              value={asset.title || ""}
                              onChange={(e) =>
                                setAllAssets((rows) =>
                                  rows.map((row) =>
                                    row.id === asset.id ? { ...row, title: e.target.value } : row,
                                  ),
                                )
                              }
                              onBlur={(e) => void saveAsset(asset, { title: e.target.value })}
                            />
                          </label>
                          <label>
                            Description
                            <textarea
                              value={asset.description || ""}
                              onChange={(e) =>
                                setAllAssets((rows) =>
                                  rows.map((row) =>
                                    row.id === asset.id
                                      ? { ...row, description: e.target.value }
                                      : row,
                                  ),
                                )
                              }
                              onBlur={(e) => void saveAsset(asset, { description: e.target.value })}
                            />
                          </label>
                          <label>
                            Alt text
                            <input
                              value={asset.alt_text || ""}
                              onChange={(e) =>
                                setAllAssets((rows) =>
                                  rows.map((row) =>
                                    row.id === asset.id
                                      ? { ...row, alt_text: e.target.value }
                                      : row,
                                  ),
                                )
                              }
                              onBlur={(e) => void saveAsset(asset, { alt_text: e.target.value })}
                            />
                          </label>
                          <label>
                            Caption
                            <textarea
                              value={asset.caption || ""}
                              onChange={(e) =>
                                setAllAssets((rows) =>
                                  rows.map((row) =>
                                    row.id === asset.id ? { ...row, caption: e.target.value } : row,
                                  ),
                                )
                              }
                              onBlur={(e) => void saveAsset(asset, { caption: e.target.value })}
                            />
                          </label>
                        </div>
                        <div className="media-admin-card-actions">
                          <button
                            title="Move up in this placement"
                            disabled={position <= 0}
                            onClick={() => void shift(asset, -1)}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            title="Move down in this placement"
                            disabled={position < 0 || position === placement.length - 1}
                            onClick={() => void shift(asset, 1)}
                          >
                            <ArrowDown size={16} />
                          </button>
                          <label className="media-admin-replace">
                            Replace
                            <input
                              type="file"
                              accept={accept}
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void uploadFile(file, asset.id);
                                e.currentTarget.value = "";
                              }}
                            />
                          </label>
                          <button
                            className="danger"
                            title="Remove media"
                            onClick={() => void removeAsset(asset)}
                          >
                            <Trash2 size={16} />
                          </button>
                          <span className="media-admin-saved">
                            <Check size={13} />
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
            <p className="media-admin-footnote">
              Storage and publishing are protected by Supabase Row Level Security. Public pages use
              the existing site media until managed media integration is configured.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
