import { useEffect, useState } from "react";
import { ImagePlus, Save, Send } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { bundledSiteMedia, signedMediaUrl, uploadCmsMedia } from "@/lib/cms";

type Settings = {
  site_name?: string;
  default_seo_title?: string;
  default_seo_description?: string;
  global_cta_title?: string;
  global_cta_description?: string;
  global_cta_label?: string;
  logo_path?: string;
  favicon_path?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  footer_text?: string;
};
const defaults: Settings = {
  site_name: "SARRAF PROPERTIES",
  default_seo_title: "Sarraf Properties | Real Estate in Goregaon & Malad, Mumbai",
  default_seo_description:
    "Trusted residential and commercial property guidance across Goregaon and Malad, Mumbai.",
  global_cta_title: "Your next move starts with a conversation.",
  global_cta_description: "Tell us what you’re looking for or contact Rajan Sarraf directly.",
  global_cta_label: "Make an enquiry",
  phone: "8652869869",
  whatsapp: "918652869869",
  email: "Sarrafproperties2011@gmail.com",
  address: "Shop No.4, Patidar Society, Opp. Ezone Mall, Malad (W), Mumbai - 400064",
  facebook: "",
  instagram: "",
  youtube: "",
  footer_text:
    "Your trusted real estate partner in Goregaon and Malad, Mumbai. Professional guidance, personal attention.",
};

export function CmsSettingsManager() {
  const db = getSupabase();
  const [settings, setSettings] = useState<Settings>(defaults);
  const [logo, setLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    void db
      ?.from("cms_site_settings")
      .select("draft_settings")
      .eq("id", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive || !data?.draft_settings) return;
        const next = { ...defaults, ...(data.draft_settings as Settings) };
        setSettings(next);
        if (next.logo_path)
          void signedMediaUrl(next.logo_path).then((url) => {
            if (alive) setLogo(url);
          });
        if (next.favicon_path)
          void signedMediaUrl(next.favicon_path).then((url) => {
            if (alive) setFavicon(url);
          });
      });
    return () => {
      alive = false;
    };
  }, [db]);
  function patch(field: keyof Settings, value: string) {
    setSettings((current) => ({ ...current, [field]: value }));
  }
  async function save(publish: boolean) {
    if (!db) return;
    setBusy(true);
    setError("");
    setMessage("");
    const { error: draftError } = await db
      .from("cms_site_settings")
      .upsert(
        { id: true, draft_settings: settings, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    if (draftError) {
      setError(draftError.message);
      setBusy(false);
      return;
    }
    if (publish) {
      const { error: publishError } = await db
        .from("cms_published_settings")
        .upsert(
          { id: true, settings, published_at: new Date().toISOString() },
          { onConflict: "id" },
        );
      if (publishError) setError(publishError.message);
      else setMessage("Website settings published.");
    } else setMessage("Settings draft saved.");
    setBusy(false);
  }
  async function uploadLogo(file?: File) {
    if (!file || !db) return;
    setBusy(true);
    setError("");
    try {
      const asset = await uploadCmsMedia(file, "settings", "logo");
      patch("logo_path", asset.file_path);
      setLogo(await signedMediaUrl(asset.file_path));
      setMessage("Logo uploaded. Save and publish settings to make it live.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Logo upload failed.");
    } finally {
      setBusy(false);
    }
  }
  async function uploadFavicon(file?: File) {
    if (!file || !db) return;
    setBusy(true);
    setError("");
    try {
      const asset = await uploadCmsMedia(file, "settings", "favicon");
      patch("favicon_path", asset.file_path);
      setFavicon(await signedMediaUrl(asset.file_path));
      setMessage("Favicon uploaded. Save and publish settings to make it live.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Favicon upload failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="cms-admin">
      <div className="cms-admin-section-heading">
        <div>
          <span className="media-admin-eyebrow">GLOBAL WEBSITE CONTENT</span>
          <h2>Website settings</h2>
        </div>
      </div>
      {error && (
        <div className="media-admin-error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="media-admin-notice" role="status">
          {message}
        </div>
      )}
      <section className="cms-admin-card">
        <div className="cms-admin-card-title">
          <div>
            <span className="media-admin-eyebrow">BRAND AND CONTACT</span>
            <h2>Header, contact and footer</h2>
          </div>
        </div>
        <div className="cms-admin-fields">
          <label>
            Website name
            <input
              value={settings.site_name || ""}
              onChange={(event) => patch("site_name", event.target.value)}
            />
          </label>
          <label>
            Default SEO title
            <input
              value={settings.default_seo_title || ""}
              onChange={(event) => patch("default_seo_title", event.target.value)}
            />
          </label>
          <label className="wide">
            Default SEO description
            <textarea
              rows={2}
              value={settings.default_seo_description || ""}
              onChange={(event) => patch("default_seo_description", event.target.value)}
            />
          </label>
          <label className="wide">
            Global CTA heading
            <input
              value={settings.global_cta_title || ""}
              onChange={(event) => patch("global_cta_title", event.target.value)}
            />
          </label>
          <label className="wide">
            Global CTA description
            <textarea
              rows={2}
              value={settings.global_cta_description || ""}
              onChange={(event) => patch("global_cta_description", event.target.value)}
            />
          </label>
          <label>
            Global CTA button label
            <input
              value={settings.global_cta_label || ""}
              onChange={(event) => patch("global_cta_label", event.target.value)}
            />
          </label>
          <label>
            Phone number
            <input
              value={settings.phone || ""}
              onChange={(event) => patch("phone", event.target.value)}
            />
          </label>
          <label>
            WhatsApp number (international digits)
            <input
              value={settings.whatsapp || ""}
              onChange={(event) => patch("whatsapp", event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={settings.email || ""}
              onChange={(event) => patch("email", event.target.value)}
            />
          </label>
          <label>
            Address
            <input
              value={settings.address || ""}
              onChange={(event) => patch("address", event.target.value)}
            />
          </label>
          <label>
            Facebook URL
            <input
              type="url"
              value={settings.facebook || ""}
              onChange={(event) => patch("facebook", event.target.value)}
            />
          </label>
          <label>
            Instagram URL
            <input
              type="url"
              value={settings.instagram || ""}
              onChange={(event) => patch("instagram", event.target.value)}
            />
          </label>
          <label>
            YouTube URL
            <input
              type="url"
              value={settings.youtube || ""}
              onChange={(event) => patch("youtube", event.target.value)}
            />
          </label>
          <label className="wide">
            Footer description
            <textarea
              rows={3}
              value={settings.footer_text || ""}
              onChange={(event) => patch("footer_text", event.target.value)}
            />
          </label>
          <label>
            Logo from existing website
            <select
              value={settings.logo_path || ""}
              onChange={(event) => {
                patch("logo_path", event.target.value);
                void signedMediaUrl(event.target.value).then(setLogo);
              }}
            >
              <option value="">Keep current site logo</option>
              {bundledSiteMedia.map((asset) => (
                <option key={asset.key} value={asset.key}>
                  {asset.title}
                </option>
              ))}
            </select>
          </label>
          <label className="cms-upload-field">
            <span>
              Upload logo <ImagePlus size={14} />
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={busy}
              onChange={(event) => {
                void uploadLogo(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
          {logo && (
            <div className="cms-admin-preview cms-logo-preview">
              <img src={logo} alt="Logo preview" />
            </div>
          )}
          <label>
            Favicon from existing website
            <select
              value={settings.favicon_path || ""}
              onChange={(event) => {
                patch("favicon_path", event.target.value);
                void signedMediaUrl(event.target.value).then(setFavicon);
              }}
            >
              <option value="">No custom favicon</option>
              {bundledSiteMedia.map((asset) => (
                <option key={asset.key} value={asset.key}>
                  {asset.title}
                </option>
              ))}
            </select>
          </label>
          <label className="cms-upload-field">
            <span>
              Upload favicon <ImagePlus size={14} />
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              disabled={busy}
              onChange={(event) => {
                void uploadFavicon(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </label>
          {favicon && (
            <div className="cms-admin-preview cms-favicon-preview">
              <img src={favicon} alt="Favicon preview" />
            </div>
          )}
        </div>
        <div className="cms-admin-actions">
          <button
            className="media-admin-secondary"
            type="button"
            disabled={busy}
            onClick={() => void save(false)}
          >
            <Save size={15} /> Save draft
          </button>
          <button
            className="media-admin-primary"
            type="button"
            disabled={busy}
            onClick={() => void save(true)}
          >
            <Send size={15} /> Publish settings
          </button>
        </div>
      </section>
    </div>
  );
}
