import { useEffect, useState, type FormEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Check, Menu, MessageCircle, Phone, Send, X } from "lucide-react";
import logoMark from "@/assets/sarraf-logo-mark.webp";
import { getSupabase } from "@/lib/supabase";
import { signedMediaUrl, usePublishedSiteSettings } from "@/lib/cms";

export const siteNavigation = [
  ["Home", "/"], ["About Us", "/about"], ["Residential", "/residential-properties"],
  ["Commercial", "/commercial-properties"], ["Buy Property", "/buy-property"],
  ["Sell Property", "/sell-property"], ["Services", "/services"],
  ["Locations", "/locations"], ["Gallery", "/gallery"], ["Contact", "/contact"],
] as const;

export function whatsappUrl(message = "Hello Sarraf Properties, I would like to enquire about a property.", number = "918652869869") {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export const enquiryServices = [
  "Residential Property Consultation",
  "Commercial Property Consultation",
  "Property Buying Assistance",
  "Property Selling Assistance",
  "Property Investment Guidance",
  "Real Estate Consultation",
] as const;

export function openEnquiryForm(service?: string, message?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sarraf:open-enquiry", { detail: { service, message } }));
  }
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [servicePrefill, setServicePrefill] = useState("");
  const [messagePrefill, setMessagePrefill] = useState("");
  const siteSettings = usePublishedSiteSettings();
  const [publishedLogo, setPublishedLogo] = useState("");
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    let alive = true;
    void getSupabase()?.from("cms_published_settings").select("settings").eq("id", true).maybeSingle().then(({ data }) => {
      if (!alive || !data?.settings) return;
      const values = data.settings as Record<string, string>;
      if (values["logo_path"]) void signedMediaUrl(values["logo_path"]).then(url => { if (alive && url) setPublishedLogo(url); });
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ service?: string; message?: string }>).detail;
      setServicePrefill(detail?.service && enquiryServices.includes(detail.service as (typeof enquiryServices)[number]) ? detail.service : "");
      setMessagePrefill(detail?.message ?? "");
      setEnquirySent(false);
      setEnquiryOpen(true);
    };
    window.addEventListener("sarraf:open-enquiry", handleOpen);
    return () => window.removeEventListener("sarraf:open-enquiry", handleOpen);
  }, []);

  useEffect(() => {
    if (!enquiryOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setEnquiryOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [enquiryOpen]);

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "");
    const message = String(data.get("message") ?? "").trim();
    const lines = [
      "Hello Sarraf Properties, I would like to make an enquiry.",
      `Name: ${name}`,
      `Mobile: ${phone}`,
      ...(email ? [`Email: ${email}`] : []),
      `Service: ${service}`,
      ...(message ? [`Additional message: ${message}`] : []),
    ];
    const url = whatsappUrl(lines.join("\n"), siteSettings["whatsapp"]);
    const whatsappWindow = window.open(url, "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;
    else window.location.href = url;
    setEnquirySent(true);
  }

  function closeEnquiry() {
    setEnquiryOpen(false);
    setEnquirySent(false);
  }
  return <>
      <header className="site-header">
      <div className="nav-shell">
        <Link to="/" className="brand" aria-label="Sarraf Properties home"><img src={publishedLogo || logoMark} alt="" className="brand-mark" /><span className="brand-copy"><strong>SARRAF PROPERTIES</strong></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{siteNavigation.map(([label, to]) => <Link key={to} to={to} className={pathname === to ? "active" : ""} aria-current={pathname === to ? "page" : undefined}>{label}</Link>)}</nav>
        <button className="menu-toggle" type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">{siteNavigation.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className={pathname === to ? "active" : ""}>{label}<ArrowRight /></Link>)}</nav>}
    </header>
    {children}
    <footer className="site-footer" id="contact"><div className="footer-main section-wrap">
      <div className="footer-about"><Link to="/" className="brand" aria-label="Sarraf Properties home"><img src={publishedLogo || logoMark} alt="" className="brand-mark" /><span className="brand-copy"><strong>SARRAF PROPERTIES</strong></span></Link><p>{siteSettings["footer_text"]}</p><a className="footer-whatsapp" href={whatsappUrl(undefined, siteSettings["whatsapp"])} target="_blank" rel="noreferrer">WhatsApp us <ArrowRight /></a><div className="footer-social-links">{siteSettings.facebook && <a href={siteSettings.facebook} target="_blank" rel="noreferrer">Facebook</a>}{siteSettings.instagram && <a href={siteSettings.instagram} target="_blank" rel="noreferrer">Instagram</a>}{siteSettings.youtube && <a href={siteSettings.youtube} target="_blank" rel="noreferrer">YouTube</a>}</div></div>
      <div className="footer-column"><span className="footer-label">EXPLORE</span>{siteNavigation.map(([label, to]) => <Link key={to} to={to}>{label}</Link>)}</div>
      <div className="footer-column"><span className="footer-label">OUR SERVICES</span><Link to="/residential-properties">Residential properties</Link><Link to="/commercial-properties">Commercial properties</Link><Link to="/buy-property">Buying assistance</Link><Link to="/sell-property">Selling assistance</Link><Link to="/services">Consultation & investment</Link></div>
      <div className="footer-column footer-contact"><span className="footer-label">GET IN TOUCH</span><strong>Rajan Sarraf</strong><a href={`tel:${siteSettings["phone"]}`}>{siteSettings["phone"]}</a><a href={`mailto:${siteSettings["email"]}`}>{siteSettings["email"]}</a><span>Goregaon &amp; Malad, Mumbai</span><p>{siteSettings["address"]}</p></div>
    </div><div className="footer-bottom section-wrap"><span>© 2026 SARRAF PROPERTIES. All Rights Reserved.</span><span>GOREGAON <i /> MALAD <i /> MUMBAI</span></div></footer>
    <div className="floating-contact" aria-label="Quick contact">
      <button className="floating-contact-link floating-whatsapp" type="button" onClick={() => openEnquiryForm()} aria-label="Start a WhatsApp enquiry" title="Start a WhatsApp enquiry"><MessageCircle /><span>WhatsApp</span></button>
      <a className="floating-contact-link floating-call" href={`tel:${siteSettings["phone"]}`} aria-label="Call Sarraf Properties" title="Call Sarraf Properties"><Phone /><span>Call us</span></a>
    </div>
    {enquiryOpen && <div className="global-enquiry-backdrop" onClick={(event) => { if (event.target === event.currentTarget) closeEnquiry(); }}>
      <section className="global-enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="global-enquiry-title">
        <button className="global-enquiry-close" type="button" aria-label="Close enquiry form" onClick={closeEnquiry}><X /></button>
        {enquirySent ? <div className="global-enquiry-success" role="status"><span><Check /></span><h2 id="global-enquiry-title">WhatsApp enquiry is ready</h2><p>Your details are in a prefilled WhatsApp message. Review it and tap Send to reach Sarraf Properties.</p><button className="button-gold" type="button" onClick={closeEnquiry}>Done</button></div> : <>
          <div className="global-enquiry-heading"><span>PERSONAL PROPERTY GUIDANCE</span><h2 id="global-enquiry-title">Make an enquiry</h2><p>Tell us how to reach you and what service you need.</p></div>
          <form className="global-enquiry-form" onSubmit={submitEnquiry}>
            <label htmlFor="global-enquiry-name">Your name *</label><input id="global-enquiry-name" name="name" autoComplete="name" minLength={2} autoFocus required placeholder="Full name" />
            <label htmlFor="global-enquiry-phone">Mobile number *</label><input id="global-enquiry-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[+0-9() -]{8,18}" title="Enter a valid phone number" required placeholder="Mobile number" />
            <label htmlFor="global-enquiry-email">Email address <span>(optional)</span></label><input id="global-enquiry-email" name="email" type="email" autoComplete="email" placeholder="Email address" />
            <label htmlFor="global-enquiry-service">Service *</label><select id="global-enquiry-service" name="service" required defaultValue={servicePrefill}><option value="" disabled>Select a service</option>{enquiryServices.map((service) => <option key={service} value={service}>{service}</option>)}</select>
            <label htmlFor="global-enquiry-message">Additional message <span>(optional)</span></label><textarea id="global-enquiry-message" name="message" rows={3} defaultValue={messagePrefill} placeholder="Share your requirements or preferred area…" />
            <button className="button-gold global-enquiry-submit" type="submit">Continue on WhatsApp <MessageCircle /></button>
            <small>We don’t save enquiries on this website. WhatsApp opens with your details for you to review and send.</small>
          </form>
        </>}
      </section>
    </div>}
  </>;
}
