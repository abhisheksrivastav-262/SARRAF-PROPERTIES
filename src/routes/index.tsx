import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Compass,
  Handshake,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { enquiryServices, openEnquiryForm, whatsappUrl } from "@/components/site/SiteLayout";
import heroImage from "@/assets/mumbai-residences-hero.jpg";
import towerImage from "@/assets/residential-tower.jpg";
import apartmentImage from "@/assets/premium-apartment.jpg";
import commercialImage from "@/assets/commercial-space.jpg";
import serviceResidentialImage from "@/assets/service-residential.webp";
import serviceCommercialImage from "@/assets/service-commercial.webp";
import serviceBuyingImage from "@/assets/service-buying.webp";
import serviceSellingImage from "@/assets/service-selling.webp";
import serviceInvestmentImage from "@/assets/service-investment.webp";
import serviceConsultationImage from "@/assets/service-consultation.webp";
import { ManagedMediaImage } from "@/components/site/ManagedMedia";
import { PropertyListings } from "@/components/site/PropertyListings";
import { CmsPageView } from "@/components/site/CmsPageView";
import { usePublishedSiteSettings } from "@/lib/cms";
import { isValidPhoneNumber } from "@/lib/contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sarraf Properties | Real Estate in Goregaon & Malad, Mumbai" },
      {
        name: "description",
        content:
          "Find your next home or commercial space with Sarraf Properties, your trusted real estate partner in Goregaon and Malad, Mumbai.",
      },
      { property: "og:title", content: "Sarraf Properties | Mumbai Real Estate" },
      {
        property: "og:description",
        content: "Trusted property guidance across Goregaon and Malad, Mumbai.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const services = [
  { icon: Home, image: serviceResidentialImage, title: "Residential Property Consultation", text: "Explore apartments, flats and homes suited to your needs, preferred neighbourhood and plans." },
  { icon: Building2, image: serviceCommercialImage, title: "Commercial Property Consultation", text: "Discuss office, retail and business space requirements across Goregaon and Malad." },
  { icon: Handshake, image: serviceBuyingImage, title: "Property Buying Assistance", text: "Get clear guidance from initial search and property visits through your decision process." },
  { icon: Sparkles, image: serviceSellingImage, title: "Property Selling Assistance", text: "Plan your sale with attentive local support, thoughtful presentation and enquiry coordination." },
  { icon: TrendingUp, image: serviceInvestmentImage, title: "Property Investment Guidance", text: "Talk through your goals and evaluate property options with a grounded local perspective." },
  { icon: Compass, image: serviceConsultationImage, title: "Real Estate Consultation", text: "Get a personal conversation about the next step in your property journey." },
];

const featuredServices = [
  { icon: Home, image: serviceResidentialImage, title: "Residential", href: "/residential-properties", summary: "Explore apartments, flats and homes in Goregaon and Malad with guidance shaped around your priorities.", benefits: ["Discuss preferred neighbourhoods and property types", "Compare options around your needs", "Get personal support as you plan property visits"] },
  { icon: Building2, image: serviceCommercialImage, title: "Commercial", href: "/commercial-properties", summary: "Find out about office, retail and business spaces across Mumbai’s western suburbs.", benefits: ["Start with your intended business use", "Discuss location and space requirements", "Explore relevant commercial property options"] },
  { icon: Handshake, image: serviceBuyingImage, title: "Buy Property", href: "/buy-property", summary: "Get assistance as you define your search, explore options and consider your next move.", benefits: ["Clarify your requirements and preferred areas", "Get support coordinating property conversations", "Move through the search with a clear next step"] },
  { icon: Sparkles, image: serviceSellingImage, title: "Sell Property", href: "/sell-property", summary: "Talk through your property and goals with a local real estate partner.", benefits: ["Discuss your property and preferred timing", "Understand the steps involved in your sale", "Get support coordinating prospective enquiries"] },
];

const gallery = [
  { image: towerImage, title: "Contemporary residences", type: "Residential living", className: "gallery-large" },
  { image: apartmentImage, title: "Thoughtful interiors", type: "Premium homes", className: "" },
  { image: commercialImage, title: "Modern workspaces", type: "Commercial spaces", className: "" },
];

function HomePage() {
  return <CmsPageView slug="home" fallback={<LegacyHomePage/>}/>;
}

function LegacyHomePage() {
  const siteSettings = usePublishedSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const service = String(form.get("service") ?? "General property enquiry");
    if (!isValidPhoneNumber(phone)) {
      setPhoneError("Enter a valid phone number with 8–15 digits.");
      return;
    }
    setPhoneError("");
    const body = [`Hello Sarraf Properties, I’m ${name}.`, `Mobile: ${phone}`, ...(email ? [`Email: ${email}`] : []), `Service: ${service}`, ...(message ? [`Additional message: ${message}`] : [])].join("\n");
    window.open(whatsappUrl(body), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <main>
      <section className="hero" id="home">
        <ManagedMediaImage page="home" section="hero" fallback={heroImage} alt="" aria-hidden="true" className="managed-hero-media" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow"><span /> REAL ESTATE, THOUGHTFULLY GUIDED</div>
          <h1>Find your dream<br />property <em>in Mumbai.</em></h1>
          <p>Your trusted real estate partner in Goregaon &amp; Malad.</p>
          <div className="hero-actions">
            <Button asChild className="button-gold"><a href="#properties">Explore properties <ArrowRight /></a></Button>
            <a href="#contact" className="text-link">Speak with our team <ArrowDown /></a>
          </div>
        </div>
        <div className="hero-caption"><span>01</span><i /> GOREGAON · MALAD · MUMBAI</div>
        <a className="scroll-cue" href="#about" aria-label="Scroll to about Sarraf Properties"><ChevronDown /></a>
      </section>

      <div className="trust-strip">
        <span>LOCAL KNOWLEDGE</span><i />
        <span>PERSONAL SERVICE</span><i />
        <span>TRUSTED GUIDANCE</span><i />
        <span>WESTERN MUMBAI</span>
      </div>

      <section className="about-section section-wrap" id="about">
        <div className="about-image-wrap">
          <ManagedMediaImage page="home" section="about" fallback={towerImage} alt="A contemporary residence framed by greenery in Mumbai" width={1200} height={912} loading="lazy" />
          <div className="image-note"><span className="note-mark">S.</span><span>Rooted in the<br /><strong>neighbourhood.</strong></span></div>
        </div>
        <div className="about-copy">
          <div className="eyebrow dark-eyebrow"><span /> A LOCAL NAME YOU CAN TRUST</div>
          <h2>About <em>Sarraf</em><br />Properties</h2>
          <p className="body-large">Welcome to Sarraf Properties, your trusted real estate partner in Goregaon and Malad, Mumbai.</p>
          <p>We help clients find the right residential and commercial properties with professional guidance, personalized assistance and reliable real estate services.</p>
          <div className="benefit-list">
            {[
              { icon: ShieldCheck, text: "Trusted property guidance" },
              { icon: MapPin, text: "Local area expertise" },
              { icon: Handshake, text: "Personalized assistance" },
              { icon: Sparkles, text: "Professional service" },
            ].map(({ icon: Icon, text }) => <div className="benefit" key={text}><Icon /><span>{text}</span></div>)}
          </div>
          <a className="underlined-link" href="#contact">Get to know us <ArrowRight /></a>
        </div>
      </section>

      <section className="showcase-section" id="properties">
        <div className="section-wrap">
          <div className="section-heading heading-row">
            <div><div className="eyebrow"><span /> SPACES WITH POTENTIAL</div><h2>A glimpse of <em>what’s possible.</em></h2></div>
            <p>Explore the kinds of homes and spaces we help our clients discover across Mumbai’s western suburbs.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((item, index) => <article className={`gallery-item ${item.className}`} key={item.title}>
              <ManagedMediaImage page="home" section={`gallery-${index + 1}`} fallback={item.image} alt={item.title} width={1200} height={912} loading="lazy" />
              <div className="gallery-overlay"><span>0{index + 1} / {item.type}</span><h3>{item.title}</h3></div>
            </article>)}
          </div>
          <p className="gallery-note">A visual showcase of property styles. Details on individual properties are available on enquiry.</p>
        </div>
      </section>

      <PropertyListings featuredOnly />

      <section className="services-section section-wrap" id="services">
        <div className="section-heading centered-heading">
          <div className="eyebrow dark-eyebrow"><span /> OUR SIX CORE SERVICES</div>
          <h2>Support for every <em>property move.</em></h2>
          <p>Local, personal guidance across buying, selling, property search and investment.</p>
        </div>
        <div className="services-grid">
          {services.map(({ icon: Icon, image, title, text }, index) => <article className="service-item" key={title}>
            <ManagedMediaImage page="home" section={`service-${index + 1}`} className="service-row-image" fallback={image} alt={`${title} service`} width={1200} height={800} loading="lazy" />
            <div className="service-top"><span className="service-icon"><Icon /></span><span className="service-index">0{index + 1}</span></div>
            <h3>{title}</h3><p>{text}</p>
            <div className="service-card-actions"><button className="service-enquiry" type="button" onClick={() => openEnquiryForm(title)} aria-label={`Enquire about ${title}`}>Enquire <ArrowRight /></button><a className="service-call-now" href={`tel:${siteSettings.phone}`} aria-label={`Call now about ${title}`}><Phone /> Call now</a></div>
          </article>)}
        </div>
      </section>

      <section className="featured-services-section" aria-labelledby="featured-services-title">
        <div className="section-wrap">
          <div className="featured-services-heading">
            <div className="eyebrow dark-eyebrow"><span /> FOUR WAYS WE CAN HELP</div>
            <h2 id="featured-services-title">Your property journey, <em>personally guided.</em></h2>
            <p>Choose the support you need in Goregaon, Malad and across Mumbai’s western suburbs.</p>
          </div>
          <div className="featured-services-grid">
            {featuredServices.map(({ icon: Icon, image, title, href, summary, benefits }, index) => <article className="featured-service-card" key={title}>
              <ManagedMediaImage page="home" section={`featured-${index + 1}`} className="featured-service-image" fallback={image} alt={`${title} property service`} width={1200} height={800} loading="lazy" />
              <div className="service-top"><span className="service-icon"><Icon /></span><span className="service-index">0{index + 1}</span></div>
              <h3>{title}</h3><p>{summary}</p>
              <ul>{benefits.map((benefit) => <li key={benefit}><Check />{benefit}</li>)}</ul>
              <a href={href} className="underlined-link">Explore {title} <ArrowRight /></a>
            </article>)}
          </div>
          <div className="featured-enquiry-area">
            <div className="featured-call-card">
              <div className="eyebrow"><span /> READY TO TALK?</div>
              <h3>Get personal help with your next move.</h3>
              <p>Tell us what you’re looking for or call Rajan Sarraf directly.</p>
              <a className="button-gold call-now-button" href={`tel:${siteSettings.phone}`}><Phone /> Call now <span>{siteSettings.phone}</span></a>
            </div>
            <div className="enquiry-panel featured-enquiry-panel">
              <div className="form-heading"><span>PERSONAL PROPERTY GUIDANCE</span><h3>Make an enquiry</h3><p>Share your details and continue in WhatsApp.</p></div>
              {submitted ? <div className="form-success" role="status"><span><Check /></span><h3>Your enquiry is ready in WhatsApp.</h3><p>Complete sending your prefilled message in WhatsApp to reach Rajan Sarraf.</p><Button variant="outline" onClick={() => setSubmitted(false)}>Send another enquiry</Button></div> : <form onSubmit={handleSubmit}>
                <label htmlFor="name">Your name</label><Input id="name" name="name" placeholder="Name" autoComplete="name" minLength={2} required />
                <div className="form-row"><div><label htmlFor="phone">Mobile number</label><Input id="phone" name="phone" type="tel" inputMode="tel" maxLength={24} placeholder="Mobile number" autoComplete="tel-national" required />{phoneError && <small className="global-enquiry-error" role="alert">{phoneError}</small>}</div><div><label htmlFor="email">Email (optional)</label><Input id="email" name="email" type="email" placeholder="Email address" autoComplete="email" /></div></div>
                <label htmlFor="service">Service you’re interested in</label><select id="service" name="service" defaultValue="" required><option value="" disabled>Select a service</option>{enquiryServices.map((service) => <option key={service} value={service}>{service}</option>)}</select>
                <label htmlFor="message">Additional message (optional)</label><Textarea id="message" name="message" placeholder="Share your requirements…" rows={3} />
                <Button className="button-gold form-submit" type="submit">Continue on WhatsApp <MessageCircle /></Button>
                <small className="form-privacy">Your enquiry opens as a prefilled WhatsApp message for you to review and send.</small>
              </form>}
            </div>
          </div>
        </div>
      </section>

      <section className="locations-section" aria-labelledby="locations-title">
        <div className="section-wrap locations-inner">
          <div className="locations-copy">
            <div className="eyebrow"><span /> KNOW THE NEIGHBOURHOOD</div>
            <h2 id="locations-title">At home in<br /><em>western Mumbai.</em></h2>
            <p>Local insight makes all the difference. We know the character, connections and opportunities of the neighbourhoods we serve.</p>
            <a href="#contact" className="text-link">Find your place here <ArrowRight /></a>
          </div>
          <div className="location-list">
            <a href="https://maps.google.com/?q=Goregaon+Mumbai" target="_blank" rel="noreferrer" className="location-row">
              <span className="location-no">01</span><span><strong>Goregaon</strong><small>Mumbai, Maharashtra</small></span><MapPin />
            </a>
            <a href="https://maps.google.com/?q=Malad+Mumbai" target="_blank" rel="noreferrer" className="location-row">
              <span className="location-no">02</span><span><strong>Malad</strong><small>Mumbai, Maharashtra</small></span><MapPin />
            </a>
            <div className="location-stamp"><span>YOUR LOCAL<br />PROPERTY PARTNER</span><b>S.</b></div>
          </div>
        </div>
      </section>

      <section className="contact-section section-wrap home-contact-details" id="contact">
        <div className="contact-intro">
          <div className="eyebrow dark-eyebrow"><span /> LET’S FIND YOUR NEXT MOVE</div>
          <h2>Every good move<br />starts with a <em>conversation.</em></h2>
          <p>Tell us what you’re looking for. Rajan and the team are here to help.</p>
          <div className="contact-direct">
            <a href={`tel:${siteSettings.phone}`}><span className="contact-icon"><Phone /></span><span><small>CALL US</small><strong>{siteSettings.phone}</strong></span><ArrowRight /></a>
            <a href={whatsappUrl(undefined, siteSettings.whatsapp)} target="_blank" rel="noreferrer"><span className="contact-icon"><MessageCircle /></span><span><small>WHATSAPP</small><strong>Send an enquiry</strong></span><ArrowRight /></a>
            <a href="mailto:Sarrafproperties2011@gmail.com"><span className="contact-icon"><Mail /></span><span><small>EMAIL</small><strong>Sarrafproperties2011@gmail.com</strong></span><ArrowRight /></a>
          </div>
          <div className="address-block"><MapPin /><p><strong>Visit our office</strong><br />Shop No.4, Patidar Society,<br />Opp. Ezone Mall, Malad (W),<br />Mumbai - 400064</p></div>
        </div>
      </section>

    </main>
  );
}
