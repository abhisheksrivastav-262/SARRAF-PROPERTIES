import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  FilePlus2,
  ImagePlus,
  Save,
  Send,
  Trash2,
  Video,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { CmsDocumentPreview } from "@/components/site/CmsPageView";
import {
  bundledSiteMedia,
  CMS_PAGES,
  defaultCmsSection,
  hydrateBundledPageMedia,
  legacyWebsitePageContent,
  signedMediaUrl,
  uploadCmsMedia,
  type CmsDocument,
  type CmsSection,
} from "@/lib/cms";

type AdminPage = {
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  draft_content: CmsDocument;
  updated_at: string;
};
type Asset = {
  id: string;
  page_slug: string;
  section_key: string;
  media_type: "image" | "video";
  file_path: string;
  title: string;
  description: string;
  alt_text: string;
  caption: string;
  is_active: boolean;
};
const types: CmsSection["type"][] = [
  "hero",
  "text",
  "image",
  "gallery",
  "video",
  "services",
  "property-list",
  "contact",
  "cta",
];

function snapshot(page: AdminPage, content: CmsDocument) {
  return JSON.stringify({
    title: page.title,
    seo_title: page.seo_title,
    seo_description: page.seo_description,
    content,
  });
}

export function CmsPageManager({
  pageSlug,
  onDirtyChange,
}: {
  pageSlug?: string;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const db = getSupabase();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [slug, setSlug] = useState<string>(pageSlug || CMS_PAGES[0][0]);
  const [page, setPage] = useState<AdminPage | null>(null);
  const [draft, setDraft] = useState<CmsDocument>({ sections: [] });
  const [savedDraft, setSavedDraft] = useState<CmsDocument | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [signed, setSigned] = useState<Record<string, string>>({});
  const [published, setPublished] = useState(false);
  const [legacyAvailable, setLegacyAvailable] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const currentSnapshot = page ? snapshot(page, draft) : "";
  const dirty = Boolean(page && savedSnapshot && currentSnapshot !== savedSnapshot);

  useEffect(() => {
    if (pageSlug && pageSlug !== slug) setSlug(pageSlug);
  }, [pageSlug, slug]);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    const protectUnsaved = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", protectUnsaved);
    return () => window.removeEventListener("beforeunload", protectUnsaved);
  }, [dirty]);

  const loadPage = useCallback(
    async (nextSlug = slug) => {
      if (!db) return;
      const [pageResult, assetResult, publishedResult] = await Promise.all([
        db
          .from("cms_pages")
          .select("slug,title,seo_title,seo_description,draft_content,updated_at")
          .eq("slug", nextSlug)
          .maybeSingle(),
        db
          .from("media_assets")
          .select(
            "id,page_slug,section_key,media_type,file_path,title,description,alt_text,caption,is_active",
          )
          .order("created_at", { ascending: false }),
        db.from("cms_published_pages").select("slug").eq("slug", nextSlug).maybeSingle(),
      ]);
      if (pageResult.error) {
        setError(pageResult.error.message);
        return;
      }
      if (pageResult.data) {
        const row = pageResult.data as AdminPage;
        const savedContent = hydrateBundledPageMedia(
          nextSlug,
          row.draft_content || { sections: [] },
        );
        const useLegacyBaseline = Boolean(
          !publishedResult.data &&
          window.localStorage.getItem(`sarraf-cms-draft-saved:${nextSlug}`) !== "true",
        );
        const content = useLegacyBaseline
          ? legacyWebsitePageContent(nextSlug) || savedContent
          : savedContent;
        setPage(row);
        setSavedDraft(savedContent);
        setDraft(content);
        setSavedSnapshot(snapshot(row, savedContent));
        setLegacyAvailable(useLegacyBaseline);
      } else {
        setPage(null);
        setSavedDraft(null);
        setDraft({ sections: [] });
        setSavedSnapshot("");
        setError(
          `No CMS draft exists for ${nextSlug}. Existing website content was left unchanged.`,
        );
      }
      if (assetResult.error) setError(assetResult.error.message);
      else setAssets((assetResult.data || []) as Asset[]);
      setPublished(Boolean(publishedResult.data));
    },
    [db, slug],
  );

  useEffect(() => {
    void loadPage(slug);
  }, [loadPage, slug]);
  useEffect(() => {
    let alive = true;
    const paths = [
      ...new Set(
        draft.sections
          .flatMap((section) => [
            section.media_path,
            section.mobile_media_path,
            section.thumbnail_path,
            ...(section.items || []).flatMap((item) => [
              item.media_path,
              item.video_path,
              ...(item.additional_media_paths || "").split("\n"),
            ]),
          ])
          .flatMap((path) =>
            (path || "")
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
      ),
    ];
    void Promise.all(paths.map(async (path) => [path, await signedMediaUrl(path)] as const)).then(
      (values) => {
        if (alive) setSigned(Object.fromEntries(values));
      },
    );
    return () => {
      alive = false;
    };
  }, [draft]);

  const sections = draft.sections || [];
  const pageName = useMemo(() => CMS_PAGES.find(([key]) => key === slug)?.[1] || slug, [slug]);
  function patchSection(index: number, patch: Partial<CmsSection>) {
    setDraft((value) => ({
      ...value,
      sections: value.sections.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    }));
  }
  function patchItem(
    sectionIndex: number,
    itemIndex: number,
    patch: Partial<NonNullable<CmsSection["items"]>[number]>,
  ) {
    const current = sections[sectionIndex];
    if (!current) return;
    const items = [...(current.items || [])];
    const item = items[itemIndex];
    if (!item) return;
    items[itemIndex] = { ...item, ...patch };
    patchSection(sectionIndex, { items });
  }
  function moveItem(sectionIndex: number, itemIndex: number, delta: number) {
    const current = sections[sectionIndex];
    const items = [...(current?.items || [])];
    const target = itemIndex + delta;
    if (!current || target < 0 || target >= items.length) return;
    [items[itemIndex], items[target]] = [items[target]!, items[itemIndex]!];
    patchSection(sectionIndex, { items });
  }
  function moveSection(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    setDraft((value) => {
      const result = [...value.sections];
      const current = result[index];
      const next = result[target];
      if (!current || !next) return value;
      result[index] = next;
      result[target] = current;
      return { ...value, sections: result };
    });
  }
  function changeMetadata(patch: Partial<AdminPage>) {
    setPage((value) => ({
      ...(value || {
        slug,
        title: pageName,
        seo_title: "",
        seo_description: "",
        draft_content: draft,
        updated_at: "",
      }),
      ...patch,
    }));
  }

  async function persistDraft() {
    if (!db || !page) return false;
    const values = {
      slug,
      title: page.title,
      seo_title: page.seo_title,
      seo_description: page.seo_description,
      draft_content: draft,
      updated_at: new Date().toISOString(),
    };
    const { error: saveError } = await db.from("cms_pages").upsert(values, { onConflict: "slug" });
    if (saveError) {
      setError(saveError.message);
      return false;
    }
    window.localStorage.setItem(`sarraf-cms-draft-saved:${slug}`, "true");
    setSavedSnapshot(snapshot(page, draft));
    setSavedDraft(draft);
    setLegacyAvailable(false);
    setNotice("Draft saved.");
    setError("");
    await loadPage(slug);
    return true;
  }
  async function publishPage() {
    if (!db || !page) return;
    setBusy(true);
    setNotice("");
    setError("");
    const { error: saveError } = await db.from("cms_pages").upsert(
      {
        slug,
        title: page.title,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        draft_content: draft,
      },
      { onConflict: "slug" },
    );
    if (saveError) {
      setError(saveError.message);
      setBusy(false);
      return;
    }
    window.localStorage.setItem(`sarraf-cms-draft-saved:${slug}`, "true");
    setSavedDraft(draft);
    setLegacyAvailable(false);
    setSavedSnapshot(currentSnapshot);
    const { error: publishError } = await db.from("cms_published_pages").upsert(
      {
        slug,
        title: page.title,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        content: draft,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
    if (publishError) setError(publishError.message);
    else {
      setPublished(true);
      setNotice(`${pageName} published. The live page now uses this content.`);
    }
    setBusy(false);
  }
  async function unpublishPage() {
    if (
      !db ||
      !window.confirm(`Unpublish ${pageName}? The live page will return to its built-in content.`)
    )
      return;
    setBusy(true);
    const { error: result } = await db.from("cms_published_pages").delete().eq("slug", slug);
    if (result) setError(result.message);
    else {
      setPublished(false);
      setNotice("Page unpublished; built-in page content is live again.");
    }
    setBusy(false);
  }
  async function uploadFiles(
    section: CmsSection,
    files: FileList | null,
    field: "media_path" | "mobile_media_path" | "thumbnail_path",
  ) {
    if (!files) return;
    const index = sections.findIndex((item) => item.id === section.id);
    setBusy(true);
    setError("");
    try {
      const paths: string[] = [];
      const uploadedFiles = Array.from(files);
      for (const file of uploadedFiles) {
        const asset = await uploadCmsMedia(file, slug, section.id);
        paths.push(asset.file_path);
        if (field !== "media_path") break;
      }
      if (paths[0]) {
        const patch: Partial<CmsSection> = {
          [field]:
            field === "media_path" && section.type === "gallery"
              ? [section.media_path, ...paths].filter(Boolean).join("\n")
              : paths[0],
        };
        if (section.type === "gallery" && field === "media_path") {
          patch.items = [
            ...(section.items || []),
            ...paths.map((path, mediaIndex) => ({
              id: crypto.randomUUID(),
              title: uploadedFiles[mediaIndex]?.name.replace(/\.[^.]+$/, "") || "Gallery image",
              body: "",
              media_path: path,
              alt_text: "",
              active: true,
            })),
          ];
        }
        patchSection(index, patch);
      }
      const { data } = await db!
        .from("media_assets")
        .select(
          "id,page_slug,section_key,media_type,file_path,title,description,alt_text,caption,is_active",
        )
        .order("created_at", { ascending: false });
      setAssets((data || []) as Asset[]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  function addSection() {
    setDraft((value) => ({ ...value, sections: [...value.sections, defaultCmsSection()] }));
  }

  async function uploadServiceMedia(
    sectionIndex: number,
    itemIndex: number,
    files: FileList | null,
    field: "media_path" | "video_path" | "additional_media_paths",
  ) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const section = sections[sectionIndex];
      if (!section) return;
      const asset = await uploadCmsMedia(file, slug, section.id);
      const item = section.items?.[itemIndex];
      if (!item) return;
      const value =
        field === "additional_media_paths"
          ? [item.additional_media_paths, asset.file_path].filter(Boolean).join("\n")
          : asset.file_path;
      patchItem(sectionIndex, itemIndex, { [field]: value });
      const { data } = await db!
        .from("media_assets")
        .select(
          "id,page_slug,section_key,media_type,file_path,title,description,alt_text,caption,is_active",
        )
        .order("created_at", { ascending: false });
      setAssets((data || []) as Asset[]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Service media upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function restoreSavedCmsDraft() {
    if (!savedDraft || !page) return;
    if (
      !window.confirm(
        "Restore the saved CMS draft? The current built-in website snapshot will be discarded from this editor; the saved CMS draft in Supabase has not been changed.",
      )
    )
      return;
    setDraft(savedDraft);
    setLegacyAvailable(false);
    setNotice("Saved CMS draft restored in the editor.");
    setError("");
  }

  return (
    <div className="cms-admin">
      <div className="cms-admin-toolbar">
        <div>
          <span className="media-admin-eyebrow">EDITING WEBSITE PAGE</span>
          <strong>{pageName}</strong>
          {dirty && <span className="cms-unsaved-badge">Unsaved changes</span>}
        </div>
        <button
          type="button"
          className="media-admin-secondary"
          onClick={() => setPreviewOpen(true)}
          disabled={!page}
        >
          <Eye size={15} /> Preview draft
        </button>
        {legacyAvailable && (
          <button type="button" className="media-admin-secondary" onClick={restoreSavedCmsDraft}>
            Restore saved CMS draft
          </button>
        )}
      </div>
      {error && (
        <div className="media-admin-error" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="media-admin-notice" role="status">
          {notice}
        </div>
      )}
      {legacyAvailable && (
        <div className="media-admin-notice" role="status">
          Showing the current built-in website content. The saved CMS draft remains unchanged until
          you save this version. Use “Restore saved CMS draft” to switch back.
        </div>
      )}
      {page && (
        <>
          <section className="cms-admin-card">
            <div className="cms-admin-card-title">
              <div>
                <span className="media-admin-eyebrow">PAGE SETTINGS</span>
                <h2>{pageName}</h2>
              </div>
              <span className={`property-admin-status ${published ? "published" : "draft"}`}>
                {published ? "Published" : "Draft only"}
              </span>
            </div>
            <div className="cms-admin-fields">
              <label>
                Page title
                <input
                  value={page.title}
                  onChange={(event) => changeMetadata({ title: event.target.value })}
                />
              </label>
              <label>
                SEO title
                <input
                  value={page.seo_title}
                  onChange={(event) => changeMetadata({ seo_title: event.target.value })}
                />
              </label>
              <label className="wide">
                SEO description
                <textarea
                  rows={2}
                  value={page.seo_description}
                  onChange={(event) => changeMetadata({ seo_description: event.target.value })}
                />
              </label>
            </div>
            <div className="cms-admin-actions">
              <button
                type="button"
                className="media-admin-secondary"
                disabled={busy || !dirty}
                onClick={() => void persistDraft()}
              >
                <Save size={15} /> Save draft
              </button>
              <button
                type="button"
                className="media-admin-primary"
                disabled={busy || !dirty}
                onClick={() => void publishPage()}
              >
                <Send size={15} /> {busy ? "Saving…" : "Publish changes"}
              </button>
              {published && (
                <button
                  type="button"
                  className="media-admin-secondary"
                  disabled={busy}
                  onClick={() => void unpublishPage()}
                >
                  Unpublish
                </button>
              )}
            </div>
          </section>
          <div className="cms-admin-section-heading">
            <div>
              <span className="media-admin-eyebrow">PAGE CONTENT</span>
              <h2>
                Sections <small>{sections.length}</small>
              </h2>
            </div>
            <button className="media-admin-primary" type="button" onClick={addSection}>
              <FilePlus2 size={15} /> Add section
            </button>
          </div>
          {sections.map((section, index) => (
            <article className="cms-admin-section" key={section.id}>
              <header>
                <div>
                  <span className="cms-section-order">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{section.title || section.type}</strong>
                  <select
                    aria-label="Section type"
                    value={section.type}
                    onChange={(event) =>
                      patchSection(index, { type: event.target.value as CmsSection["type"] })
                    }
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type.replaceAll("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    title="Move up"
                    disabled={!index}
                    onClick={() => moveSection(index, -1)}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    title="Move down"
                    disabled={index === sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    className="danger"
                    title="Delete section"
                    onClick={() =>
                      setDraft((value) => ({
                        ...value,
                        sections: value.sections.filter((item) => item.id !== section.id),
                      }))
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </header>
              <div className="cms-admin-fields">
                <label>
                  Eyebrow
                  <input
                    value={section.eyebrow || ""}
                    onChange={(event) => patchSection(index, { eyebrow: event.target.value })}
                  />
                </label>
                <label>
                  Heading
                  <input
                    value={section.title || ""}
                    onChange={(event) => patchSection(index, { title: event.target.value })}
                  />
                </label>
                {section.type === "hero" && (
                  <label>
                    Heading accent
                    <input
                      value={section.accent || ""}
                      onChange={(event) => patchSection(index, { accent: event.target.value })}
                    />
                  </label>
                )}
                <label className="wide">
                  Description / paragraphs
                  <textarea
                    rows={4}
                    value={section.body || ""}
                    onChange={(event) => patchSection(index, { body: event.target.value })}
                  />
                </label>
                <label>
                  Button label
                  <input
                    value={section.button_label || ""}
                    onChange={(event) => patchSection(index, { button_label: event.target.value })}
                  />
                </label>
                <label>
                  Button link
                  <input
                    value={section.button_url || ""}
                    onChange={(event) => patchSection(index, { button_url: event.target.value })}
                    placeholder="/contact or #contact"
                  />
                </label>
                {["image", "gallery", "video", "hero", "text", "cta"].includes(section.type) && (
                  <>
                    {section.type !== "gallery" && (
                      <label>
                        Desktop image / video
                        <select
                          value={section.media_path || ""}
                          onChange={(event) =>
                            patchSection(index, { media_path: event.target.value })
                          }
                        >
                          <option value="">No media</option>
                          {assets.map((asset) => (
                            <option value={asset.file_path} key={asset.id}>
                              {asset.media_type === "video" ? "Video · " : "Image · "}
                              {asset.title || asset.file_path}
                            </option>
                          ))}
                          {bundledSiteMedia.map((asset) => (
                            <option value={asset.key} key={asset.key}>
                              Existing website image · {asset.title}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                    <label className="cms-upload-field">
                      <span>
                        {section.type === "gallery"
                          ? "Upload gallery images or videos"
                          : "Upload desktop media"}{" "}
                        <ImagePlus size={14} />
                        <Video size={14} />
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
                        multiple={section.type === "gallery"}
                        disabled={busy}
                        onChange={(event) => {
                          void uploadFiles(section, event.target.files, "media_path");
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {section.type === "gallery" && (
                      <>
                        {(!section.items || section.items.length === 0) && (
                          <div className="cms-gallery-assets wide">
                            {(section.media_path || "")
                              .split("\n")
                              .filter(Boolean)
                              .map((path, mediaIndex, paths) => (
                                <div key={`${path}-${mediaIndex}`}>
                                  {signed[path] &&
                                    (path.match(/\.(mp4|webm)$/i) ? (
                                      <video
                                        className="cms-gallery-thumb"
                                        src={signed[path]}
                                        muted
                                        preload="metadata"
                                      />
                                    ) : (
                                      <img
                                        className="cms-gallery-thumb"
                                        src={signed[path]}
                                        alt={section.alt_text || "Gallery preview"}
                                      />
                                    ))}
                                  <select
                                    aria-label={`Gallery item ${mediaIndex + 1}`}
                                    value={path}
                                    onChange={(event) => {
                                      const next = [...paths];
                                      next[mediaIndex] = event.target.value;
                                      patchSection(index, { media_path: next.join("\n") });
                                    }}
                                  >
                                    <option value={path}>
                                      {assets.find((asset) => asset.file_path === path)?.title ||
                                        path}
                                    </option>
                                    {assets.map((asset) => (
                                      <option key={asset.id} value={asset.file_path}>
                                        {asset.media_type === "video" ? "Video · " : "Image · "}
                                        {asset.title}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    disabled={mediaIndex === 0}
                                    aria-label="Move media up"
                                    onClick={() => {
                                      const next = [...paths];
                                      const current = next[mediaIndex];
                                      const before = next[mediaIndex - 1];
                                      if (!current || !before) return;
                                      next[mediaIndex - 1] = current;
                                      next[mediaIndex] = before;
                                      patchSection(index, { media_path: next.join("\n") });
                                    }}
                                  >
                                    <ArrowUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={mediaIndex === paths.length - 1}
                                    aria-label="Move media down"
                                    onClick={() => {
                                      const next = [...paths];
                                      const current = next[mediaIndex];
                                      const after = next[mediaIndex + 1];
                                      if (!current || !after) return;
                                      next[mediaIndex + 1] = current;
                                      next[mediaIndex] = after;
                                      patchSection(index, { media_path: next.join("\n") });
                                    }}
                                  >
                                    <ArrowDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="danger"
                                    aria-label="Remove from gallery"
                                    onClick={() =>
                                      patchSection(index, {
                                        media_path: paths
                                          .filter((_, itemIndex) => itemIndex !== mediaIndex)
                                          .join("\n"),
                                      })
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                        <div className="cms-items-editor wide">
                          <div className="cms-admin-section-heading">
                            <strong>Gallery items and captions</strong>
                            <button
                              type="button"
                              className="media-admin-secondary"
                              onClick={() =>
                                patchSection(index, {
                                  items: [
                                    ...(section.items || []),
                                    {
                                      id: crypto.randomUUID(),
                                      title: "New gallery item",
                                      body: "",
                                      media_path: "",
                                      alt_text: "",
                                      active: true,
                                    },
                                  ],
                                })
                              }
                            >
                              <FilePlus2 size={14} /> Add gallery item
                            </button>
                          </div>
                          {(section.items || []).map((item, itemIndex) => (
                            <div className="cms-item-fields" key={item.id}>
                              <div className="cms-item-heading">
                                <strong>
                                  {String(itemIndex + 1).padStart(2, "0")} ·{" "}
                                  {item.title || "Gallery item"}
                                </strong>
                                <div>
                                  <button
                                    type="button"
                                    title="Move up"
                                    disabled={!itemIndex}
                                    onClick={() => moveItem(index, itemIndex, -1)}
                                  >
                                    <ArrowUp size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    title="Move down"
                                    disabled={itemIndex === (section.items || []).length - 1}
                                    onClick={() => moveItem(index, itemIndex, 1)}
                                  >
                                    <ArrowDown size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="danger"
                                    title="Remove from page"
                                    onClick={() =>
                                      patchSection(index, {
                                        items: (section.items || []).filter(
                                          (_, row) => row !== itemIndex,
                                        ),
                                      })
                                    }
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <label>
                                Image or video
                                <select
                                  value={item.media_path || ""}
                                  onChange={(event) =>
                                    patchItem(index, itemIndex, { media_path: event.target.value })
                                  }
                                >
                                  <option value="">Choose media</option>
                                  {assets.map((asset) => (
                                    <option key={asset.id} value={asset.file_path}>
                                      {asset.media_type === "video" ? "Video · " : "Image · "}
                                      {asset.title}
                                    </option>
                                  ))}
                                  {bundledSiteMedia.map((asset) => (
                                    <option key={asset.key} value={asset.key}>
                                      Existing website image · {asset.title}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                Title
                                <input
                                  value={item.title}
                                  onChange={(event) =>
                                    patchItem(index, itemIndex, { title: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                Category / caption
                                <input
                                  value={item.body}
                                  onChange={(event) =>
                                    patchItem(index, itemIndex, { body: event.target.value })
                                  }
                                />
                              </label>
                              <label>
                                Alt text
                                <input
                                  value={item.alt_text || ""}
                                  onChange={(event) =>
                                    patchItem(index, itemIndex, { alt_text: event.target.value })
                                  }
                                />
                              </label>
                              {item.media_path && signed[item.media_path] && (
                                <div className="cms-admin-preview">
                                  {item.media_path.match(/\.(mp4|webm)$/i) ? (
                                    <video
                                      src={signed[item.media_path]}
                                      controls
                                      preload="metadata"
                                    />
                                  ) : (
                                    <img
                                      src={signed[item.media_path]}
                                      alt={item.alt_text || item.title}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <label>
                      Mobile image variant
                      <select
                        value={section.mobile_media_path || ""}
                        onChange={(event) =>
                          patchSection(index, { mobile_media_path: event.target.value })
                        }
                      >
                        <option value="">Use desktop image</option>
                        {assets
                          .filter((asset) => asset.media_type === "image")
                          .map((asset) => (
                            <option value={asset.file_path} key={asset.id}>
                              {asset.title || asset.file_path}
                            </option>
                          ))}
                        {bundledSiteMedia.map((asset) => (
                          <option value={asset.key} key={asset.key}>
                            Existing website image · {asset.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="cms-upload-field">
                      <span>
                        Upload mobile image <ImagePlus size={14} />
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={busy}
                        onChange={(event) => {
                          void uploadFiles(section, event.target.files, "mobile_media_path");
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    <label>
                      Image alt text
                      <input
                        value={section.alt_text || ""}
                        onChange={(event) => patchSection(index, { alt_text: event.target.value })}
                      />
                    </label>
                    <label>
                      Image/video title
                      <input
                        value={section.media_title || ""}
                        onChange={(event) =>
                          patchSection(index, { media_title: event.target.value })
                        }
                      />
                    </label>
                    <label className="wide">
                      Media description / caption
                      <textarea
                        rows={2}
                        value={section.media_description || section.caption || ""}
                        onChange={(event) =>
                          patchSection(index, {
                            media_description: event.target.value,
                            caption: event.target.value,
                          })
                        }
                      />
                    </label>
                    {section.type === "video" && (
                      <>
                        <label>
                          Video thumbnail
                          <select
                            value={section.thumbnail_path || ""}
                            onChange={(event) =>
                              patchSection(index, { thumbnail_path: event.target.value })
                            }
                          >
                            <option value="">No thumbnail</option>
                            {assets
                              .filter((asset) => asset.media_type === "image")
                              .map((asset) => (
                                <option value={asset.file_path} key={asset.id}>
                                  {asset.title || asset.file_path}
                                </option>
                              ))}
                            {bundledSiteMedia.map((asset) => (
                              <option key={asset.key} value={asset.key}>
                                Existing website image · {asset.title}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="cms-upload-field">
                          <span>
                            Upload video thumbnail <ImagePlus size={14} />
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            disabled={busy}
                            onChange={(event) => {
                              void uploadFiles(section, event.target.files, "thumbnail_path");
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                      </>
                    )}
                    {section.media_path && signed[section.media_path.split("\n")[0] || ""] && (
                      <div className="cms-admin-preview">
                        {section.media_path.split("\n")[0]?.match(/\.(mp4|webm)$/i) ? (
                          <video
                            src={signed[section.media_path.split("\n")[0] || ""]}
                            controls
                            preload="metadata"
                          />
                        ) : (
                          <img
                            src={signed[section.media_path.split("\n")[0] || ""]}
                            alt={section.alt_text || "Selected media preview"}
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
                <label>
                  <span>Section active</span>
                  <input
                    type="checkbox"
                    checked={section.active !== false}
                    onChange={(event) => patchSection(index, { active: event.target.checked })}
                  />
                </label>
                {section.type === "services" && (
                  <div className="cms-items-editor wide">
                    <div className="cms-admin-section-heading">
                      <strong>Services and page cards</strong>
                      <button
                        type="button"
                        className="media-admin-secondary"
                        onClick={() =>
                          patchSection(index, {
                            items: [
                              ...(section.items || []),
                              {
                                id: crypto.randomUUID(),
                                title: "New service",
                                body: "",
                                full_description: "",
                                features: "",
                                button_label: "Enquire",
                                button_url: "#contact",
                                media_path: "",
                                additional_media_paths: "",
                                video_path: "",
                                alt_text: "",
                                active: true,
                              },
                            ],
                          })
                        }
                      >
                        <FilePlus2 size={14} /> Add service
                      </button>
                    </div>
                    {(section.items || []).map((item, itemIndex) => (
                      <div className="cms-item-fields" key={item.id}>
                        <div className="cms-item-heading">
                          <strong>
                            {String(itemIndex + 1).padStart(2, "0")} ·{" "}
                            {item.title || "Untitled service"}
                          </strong>
                          <div>
                            <button
                              type="button"
                              title="Move service up"
                              disabled={!itemIndex}
                              onClick={() => moveItem(index, itemIndex, -1)}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              title="Move service down"
                              disabled={itemIndex === (section.items || []).length - 1}
                              onClick={() => moveItem(index, itemIndex, 1)}
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                        </div>
                        <label>
                          Service name
                          <input
                            value={item.title}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { title: event.target.value })
                            }
                          />
                        </label>
                        <label>
                          Short description
                          <textarea
                            rows={2}
                            value={item.body}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { body: event.target.value })
                            }
                          />
                        </label>
                        <label className="wide">
                          Full description
                          <textarea
                            rows={3}
                            value={item.full_description || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { full_description: event.target.value })
                            }
                          />
                        </label>
                        <label className="wide">
                          Features (one per line)
                          <textarea
                            rows={3}
                            value={item.features || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { features: event.target.value })
                            }
                          />
                        </label>
                        <label>
                          Enquiry button text
                          <input
                            value={item.button_label || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { button_label: event.target.value })
                            }
                          />
                        </label>
                        <label>
                          Button link
                          <input
                            value={item.button_url || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { button_url: event.target.value })
                            }
                          />
                        </label>
                        <label>
                          Service image
                          <select
                            value={item.media_path || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { media_path: event.target.value })
                            }
                          >
                            <option value="">No image selected</option>
                            {assets
                              .filter((asset) => asset.media_type === "image")
                              .map((asset) => (
                                <option key={asset.id} value={asset.file_path}>
                                  {asset.title || asset.file_path}
                                </option>
                              ))}
                            {bundledSiteMedia.map((asset) => (
                              <option key={asset.key} value={asset.key}>
                                Existing website image · {asset.title}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="cms-upload-field">
                          <span>
                            Upload or replace service image <ImagePlus size={14} />
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            disabled={busy}
                            onChange={(event) => {
                              void uploadServiceMedia(
                                index,
                                itemIndex,
                                event.target.files,
                                "media_path",
                              );
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                        <label>
                          Service video
                          <select
                            value={item.video_path || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { video_path: event.target.value })
                            }
                          >
                            <option value="">No video selected</option>
                            {assets
                              .filter((asset) => asset.media_type === "video")
                              .map((asset) => (
                                <option key={asset.id} value={asset.file_path}>
                                  {asset.title || asset.file_path}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label className="cms-upload-field">
                          <span>
                            Upload or replace service video <Video size={14} />
                          </span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            disabled={busy}
                            onChange={(event) => {
                              void uploadServiceMedia(
                                index,
                                itemIndex,
                                event.target.files,
                                "video_path",
                              );
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                        <label className="wide cms-upload-field">
                          <span>
                            Add supporting image or video <ImagePlus size={14} />
                            <Video size={14} />
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
                            disabled={busy}
                            onChange={(event) => {
                              void uploadServiceMedia(
                                index,
                                itemIndex,
                                event.target.files,
                                "additional_media_paths",
                              );
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                        <label>
                          Image alt text
                          <input
                            value={item.alt_text || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { alt_text: event.target.value })
                            }
                          />
                        </label>
                        <label className="cms-item-active">
                          <input
                            type="checkbox"
                            checked={item.active !== false}
                            onChange={(event) =>
                              patchItem(index, itemIndex, { active: event.target.checked })
                            }
                          />{" "}
                          Show this service
                        </label>
                        <label className="wide">
                          Supporting media paths
                          <textarea
                            rows={2}
                            value={item.additional_media_paths || ""}
                            onChange={(event) =>
                              patchItem(index, itemIndex, {
                                additional_media_paths: event.target.value,
                              })
                            }
                            placeholder="One uploaded media path per line"
                          />
                        </label>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Remove “${item.title}” from this page? Its media files will remain in the library.`,
                              )
                            )
                              patchSection(index, {
                                items: (section.items || []).filter(
                                  (_, item) => item !== itemIndex,
                                ),
                              });
                          }}
                        >
                          <Trash2 size={14} /> Remove service
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
          {!sections.length && (
            <div className="media-admin-empty">
              No sections yet. Add a section to start building this page.
            </div>
          )}
        </>
      )}
      {previewOpen && page && (
        <div
          className="cms-preview-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewOpen(false);
          }}
        >
          <section
            className="cms-preview-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${pageName} draft preview`}
          >
            <header>
              <div>
                <span className="media-admin-eyebrow">PRIVATE PREVIEW</span>
                <h2>{pageName} · Draft</h2>
              </div>
              <button
                type="button"
                className="property-admin-icon"
                aria-label="Close draft preview"
                onClick={() => setPreviewOpen(false)}
              >
                ×
              </button>
            </header>
            <div className="cms-preview-scroll">
              <CmsDocumentPreview slug={slug} content={draft} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
