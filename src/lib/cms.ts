import { useEffect, useState } from "react";
import { getSupabase, maxImageMb, maxVideoMb, mediaBucket } from "@/lib/supabase";
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
import logoMark from "@/assets/sarraf-logo-mark.webp";

export const bundledSiteMedia = [
  { key: "static:sarraf-logo-mark", title: "Sarraf Properties logo", url: logoMark },
  { key: "static:mumbai-residences-hero", title: "Mumbai residences hero", url: heroImage },
  { key: "static:residential-tower", title: "Residential tower", url: towerImage },
  { key: "static:premium-apartment", title: "Premium apartment", url: apartmentImage },
  { key: "static:commercial-space", title: "Commercial space", url: commercialImage },
  {
    key: "static:service-residential",
    title: "Residential consultation",
    url: serviceResidentialImage,
  },
  {
    key: "static:service-commercial",
    title: "Commercial consultation",
    url: serviceCommercialImage,
  },
  { key: "static:service-buying", title: "Property buying assistance", url: serviceBuyingImage },
  { key: "static:service-selling", title: "Property selling assistance", url: serviceSellingImage },
  { key: "static:service-investment", title: "Investment guidance", url: serviceInvestmentImage },
  {
    key: "static:service-consultation",
    title: "Real estate consultation",
    url: serviceConsultationImage,
  },
];

const bundledMediaByPage: Record<string, Record<string, string>> = {
  home: {
    hero: "static:mumbai-residences-hero",
    about: "static:residential-tower",
  },
  about: { hero: "static:mumbai-residences-hero", intro: "static:residential-tower" },
  "residential-properties": {
    hero: "static:mumbai-residences-hero",
    intro: "static:premium-apartment",
  },
  "commercial-properties": { hero: "static:commercial-space", intro: "static:commercial-space" },
  "buy-property": { hero: "static:mumbai-residences-hero", intro: "static:premium-apartment" },
  "sell-property": { hero: "static:mumbai-residences-hero", intro: "static:residential-tower" },
  services: { hero: "static:mumbai-residences-hero" },
  locations: {
    hero: "static:mumbai-residences-hero",
    goregaon: "static:residential-tower",
    malad: "static:commercial-space",
  },
  gallery: {
    hero: "static:mumbai-residences-hero",
    gallery: "static:residential-tower\nstatic:premium-apartment\nstatic:commercial-space",
  },
  contact: { hero: "static:mumbai-residences-hero" },
};

const serviceMedia = [
  "static:service-residential",
  "static:service-commercial",
  "static:service-buying",
  "static:service-selling",
  "static:service-investment",
  "static:service-consultation",
];

export function hydrateBundledPageMedia(slug: string, content: CmsDocument): CmsDocument {
  const sectionMedia = bundledMediaByPage[slug] || {};
  const hasGallery = content.sections.some((section) => section.id === "gallery");
  const sections = content.sections.map((section) => {
    const media_path = section.media_path || sectionMedia[section.id] || "";
    const items = section.items?.map((item, index) => ({
      ...item,
      media_path:
        item.media_path ||
        ((slug === "home" || slug === "services") && section.type === "services"
          ? serviceMedia[index] || ""
          : ""),
    }));
    return { ...section, media_path, ...(items ? { items } : {}) };
  });
  if (slug === "home" && !hasGallery) {
    sections.splice(3, 0, {
      id: "gallery",
      type: "gallery",
      eyebrow: "A VISUAL PROPERTY JOURNEY",
      title: "A glimpse of what’s possible.",
      body: "A visual showcase of property styles. Details on individual properties are available on enquiry.",
      media_path: "static:residential-tower\nstatic:premium-apartment\nstatic:commercial-space",
      active: true,
    });
  }
  return {
    ...content,
    sections,
  };
}

export type CmsSection = {
  id: string;
  type:
    | "hero"
    | "text"
    | "image"
    | "gallery"
    | "video"
    | "services"
    | "property-list"
    | "contact"
    | "cta";
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
  items?: {
    id: string;
    title: string;
    body: string;
    full_description?: string;
    features?: string;
    button_label?: string;
    button_url?: string;
    media_path?: string;
    additional_media_paths?: string;
    video_path?: string;
    alt_text?: string;
    active?: boolean;
  }[];
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
  ["home", "Home"],
  ["about", "About Us"],
  ["residential-properties", "Residential Properties"],
  ["commercial-properties", "Commercial Properties"],
  ["buy-property", "Buy Property"],
  ["sell-property", "Sell Property"],
  ["services", "Services"],
  ["locations", "Locations"],
  ["gallery", "Gallery"],
  ["contact", "Contact Us"],
] as const;

const legacyServiceDescriptions = [
  "Explore apartments, flats and homes suited to your needs, preferred neighbourhood and plans.",
  "Discuss office, retail and business space requirements across Goregaon and Malad.",
  "Get clear guidance from initial search and property visits through your decision process.",
  "Plan your sale with attentive local support, thoughtful presentation and enquiry coordination.",
  "Talk through your goals and evaluate property options with a grounded local perspective.",
  "Get a personal conversation about the next step in your property journey.",
];
const legacyServiceNames = [
  "Residential Property Consultation",
  "Commercial Property Consultation",
  "Property Buying Assistance",
  "Property Selling Assistance",
  "Property Investment Guidance",
  "Real Estate Consultation",
];
const galleryItems = [
  {
    id: "gallery-residential",
    title: "Contemporary residences",
    body: "Residential",
    media_path: "static:residential-tower",
    alt_text: "Contemporary residential tower surrounded by greenery",
  },
  {
    id: "gallery-interiors",
    title: "Warm modern interiors",
    body: "Interiors",
    media_path: "static:premium-apartment",
    alt_text: "Premium apartment interior",
  },
  {
    id: "gallery-commercial",
    title: "Modern workspaces",
    body: "Commercial",
    media_path: "static:commercial-space",
    alt_text: "Modern commercial property",
  },
  {
    id: "gallery-architecture",
    title: "Mumbai city living",
    body: "Architecture",
    media_path: "static:mumbai-residences-hero",
    alt_text: "Mumbai residential skyline",
  },
];

export function legacyWebsitePageContent(slug: string): CmsDocument | null {
  const services = legacyServiceNames.map((title, index) => ({
    id: `legacy-service-${index + 1}`,
    title,
    body: legacyServiceDescriptions[index] || "",
    media_path: serviceMedia[index] || "",
    button_label: "Enquire",
    button_url: "#contact",
    active: true,
  }));
  const featuredServices = [
    {
      title: "Residential",
      body: "Explore apartments, flats and homes in Goregaon and Malad with guidance shaped around your priorities.",
      features:
        "Discuss preferred neighbourhoods and property types\nCompare options around your needs\nGet personal support as you plan property visits",
      button_url: "/residential-properties",
    },
    {
      title: "Commercial",
      body: "Find out about office, retail and business spaces across Mumbai’s western suburbs.",
      features:
        "Start with your intended business use\nDiscuss location and space requirements\nExplore relevant commercial property options",
      button_url: "/commercial-properties",
    },
    {
      title: "Buy Property",
      body: "Get assistance as you define your search, explore options and consider your next move.",
      features:
        "Clarify your requirements and preferred areas\nGet support coordinating property conversations\nMove through the search with a clear next step",
      button_url: "/buy-property",
    },
    {
      title: "Sell Property",
      body: "Talk through your property and goals with a local real estate partner.",
      features:
        "Discuss your property and preferred timing\nUnderstand the steps involved in your sale\nGet support coordinating prospective enquiries",
      button_url: "/sell-property",
    },
  ].map((service, index) => ({
    id: `legacy-featured-service-${index + 1}`,
    ...service,
    media_path: serviceMedia[index] || "",
    button_label: "Explore",
    active: true,
  }));
  const pages: Record<string, CmsSection[]> = {
    home: [
      {
        id: "hero",
        type: "hero",
        eyebrow: "REAL ESTATE, THOUGHTFULLY GUIDED",
        title: "Find your dream property",
        accent: "in Mumbai.",
        body: "Your trusted real estate partner in Goregaon & Malad.",
        button_label: "Explore properties",
        button_url: "#properties",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "about",
        type: "text",
        eyebrow: "A LOCAL NAME YOU CAN TRUST",
        title: "About Sarraf Properties",
        body: "Welcome to Sarraf Properties, your trusted real estate partner in Goregaon and Malad, Mumbai.\n\nWe help clients find the right residential and commercial properties with professional guidance, personalized assistance and reliable real estate services.",
        media_path: "static:residential-tower",
        button_label: "Get to know us",
        button_url: "/about",
        active: true,
      },
      {
        id: "gallery",
        type: "gallery",
        eyebrow: "SPACES WITH POTENTIAL",
        title: "A glimpse of what’s possible.",
        body: "Local knowledge · Personal service · Trusted guidance · Western Mumbai. A visual showcase of property styles. Details on individual properties are available on enquiry.",
        items: galleryItems.slice(0, 3),
        active: true,
      },
      {
        id: "properties",
        type: "property-list",
        title: "Featured properties",
        body: "Explore published residential and commercial property options.",
        active: true,
      },
      {
        id: "services",
        type: "services",
        eyebrow: "OUR SIX CORE SERVICES",
        title: "Support for every property move.",
        body: "Local, personal guidance across buying, selling, property search and investment.",
        items: services,
        active: true,
      },
      {
        id: "featured-services",
        type: "services",
        eyebrow: "FOUR WAYS WE CAN HELP",
        title: "Your property journey, personally guided.",
        body: "Choose the support you need in Goregaon, Malad and across Mumbai’s western suburbs.",
        items: featuredServices,
        active: true,
      },
      {
        id: "locations",
        type: "text",
        eyebrow: "LOCAL KNOWLEDGE",
        title: "Rooted in Goregaon and Malad.",
        body: "Local knowledge, personal service and trusted guidance across western Mumbai.",
        media_path: "static:commercial-space",
        button_label: "Explore our locations",
        button_url: "/locations",
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        title: "Get personal help with your next move.",
        body: "Tell us what you’re looking for or contact Rajan Sarraf directly.",
        active: true,
      },
    ],
    about: [
      {
        id: "hero",
        type: "hero",
        eyebrow: "A LOCAL NAME YOU CAN TRUST",
        title: "Real estate with a",
        accent: "personal touch.",
        body: "Sarraf Properties is a local real estate partner serving Goregaon and Malad, Mumbai. We bring professional guidance and attentive service to every property conversation.",
        button_label: "Speak with us",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "intro",
        type: "text",
        title: "A trusted local real estate partner.",
        body: "Sarraf Properties helps clients find the right residential and commercial property across Goregaon and Malad, Mumbai. Led by Rajan Sarraf, our approach is built around attentive service, local knowledge and dependable guidance.",
        media_path: "static:residential-tower",
        active: true,
      },
      {
        id: "values",
        type: "text",
        eyebrow: "WHAT GUIDES US",
        title: "Good property decisions begin with trust.",
        body: "Our approach: understand each client’s needs and provide practical, personal guidance.\n\nOur mission: make real estate decisions clearer through responsive support and local insight.\n\nOur vision: be the trusted neighbourhood partner people return to for their property needs.",
        active: true,
      },
      {
        id: "gallery",
        type: "gallery",
        title: "Rooted in the neighbourhood.",
        items: galleryItems.slice(0, 3),
        active: true,
      },
    ],
    "residential-properties": [
      {
        id: "hero",
        type: "hero",
        eyebrow: "FIND A PLACE TO CALL YOURS",
        title: "Residential spaces",
        accent: "for every chapter.",
        body: "Explore residential property possibilities across Mumbai’s western suburbs, from apartments and flats to modern homes and residential projects.",
        button_label: "Enquire about homes",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "intro",
        type: "text",
        title: "Find a home that feels right.",
        body: "Explore luxury apartments, premium flats, residential projects and modern homes with guidance tailored to your preferences.\n\nEvery client’s needs are different. We listen first, share clear information and provide personal assistance throughout the conversation.",
        media_path: "static:premium-apartment",
        active: true,
      },
      {
        id: "opportunities",
        type: "text",
        eyebrow: "PROPERTY POSSIBILITIES",
        title: "A more personal home search.",
        body: "Tell us your requirements and we’ll discuss suitable options and next steps. Availability and property details are shared directly on enquiry; no listings or prices are assumed here.",
        active: true,
      },
      {
        id: "gallery",
        type: "gallery",
        title: "Residential possibilities",
        items: galleryItems.slice(0, 3),
        active: true,
      },
      {
        id: "listings",
        type: "property-list",
        title: "Explore current properties.",
        body: "Published residential listings are shown here.",
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        title: "Enquire about residential properties.",
        active: true,
      },
    ],
    "commercial-properties": [
      {
        id: "hero",
        type: "hero",
        eyebrow: "SPACE TO DO BUSINESS",
        title: "Commercial property",
        accent: "with purpose.",
        body: "Discover office, retail and business space opportunities across Goregaon and Malad with a local team ready to understand your requirements.",
        button_label: "Discuss your requirements",
        button_url: "#contact",
        media_path: "static:commercial-space",
        active: true,
      },
      {
        id: "intro",
        type: "text",
        title: "Find space for your business.",
        body: "We can help you explore office spaces, retail shops, commercial buildings and flexible business spaces in the western suburbs.\n\nEvery client’s needs are different. We listen first, share clear information and provide personal assistance throughout the conversation.",
        media_path: "static:commercial-space",
        active: true,
      },
      {
        id: "opportunities",
        type: "text",
        eyebrow: "PROPERTY POSSIBILITIES",
        title: "A considered commercial search.",
        body: "Tell us your requirements and we’ll discuss suitable options and next steps. Availability and property details are shared directly on enquiry; no listings or prices are assumed here.",
        active: true,
      },
      {
        id: "gallery",
        type: "gallery",
        title: "Commercial possibilities",
        items: galleryItems.slice(0, 3),
        active: true,
      },
      {
        id: "listings",
        type: "property-list",
        title: "Explore current properties.",
        body: "Published commercial listings are shown here.",
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        title: "Enquire about commercial properties.",
        active: true,
      },
    ],
    "buy-property": [
      {
        id: "hero",
        type: "hero",
        eyebrow: "YOUR NEXT MOVE, WELL CONSIDERED",
        title: "Buy property with",
        accent: "clear guidance.",
        body: "From narrowing down your search to making a confident decision, we help you navigate the property buying process with personal support.",
        button_label: "Start a buying enquiry",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "intro",
        type: "text",
        title: "A clear path to your next home.",
        body: "We start by understanding your budget, preferred areas, property type and timing. Together, we can define a search, arrange conversations and help you consider your options.",
        media_path: "static:premium-apartment",
        active: true,
      },
      {
        id: "steps",
        type: "text",
        eyebrow: "YOUR PROPERTY JOURNEY",
        title: "How we support buyers.",
        body: "01 · Share your requirements\n02 · Explore relevant options\n03 · Visit and consider properties\n04 · Make an informed decision",
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        eyebrow: "BUYER ENQUIRY",
        title: "Tell us what you’re looking for.",
        body: "Use the enquiry form to prepare a WhatsApp message for our team.",
        active: true,
      },
    ],
    "sell-property": [
      {
        id: "hero",
        type: "hero",
        eyebrow: "A THOUGHTFUL PROPERTY SALE",
        title: "Sell with a local",
        accent: "partner beside you.",
        body: "Get personal assistance as you prepare to sell, understand your options and connect with prospective property seekers.",
        button_label: "Discuss your sale",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "intro",
        type: "text",
        title: "Thoughtful support for your sale.",
        body: "We listen to your goals, discuss your property and preferred timing, then help coordinate the conversations and next steps involved in your sale.",
        media_path: "static:residential-tower",
        active: true,
      },
      {
        id: "steps",
        type: "text",
        eyebrow: "YOUR SELLING JOURNEY",
        title: "How we support sellers.",
        body: "01 · Share your property goals\n02 · Discuss a considered plan\n03 · Connect and coordinate enquiries\n04 · Move forward with support",
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        eyebrow: "SELLER ENQUIRY",
        title: "Let’s talk about your property.",
        body: "Use the enquiry form to prepare a WhatsApp message for our team.",
        active: true,
      },
    ],
    services: [
      {
        id: "hero",
        type: "hero",
        eyebrow: "HERE FOR EVERY STEP",
        title: "Real estate, made",
        accent: "more personal.",
        body: "Considered support for residential and commercial property decisions, whether you are buying, selling or exploring your next move.",
        button_label: "Make an enquiry",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "services",
        type: "services",
        eyebrow: "PERSONAL, LOCAL SUPPORT",
        title: "Support for every property decision.",
        body: "From a first conversation to a confident next step, our services are shaped around you.",
        items: services,
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        title: "Talk through your next property step.",
        active: true,
      },
    ],
    locations: [
      {
        id: "hero",
        type: "hero",
        eyebrow: "KNOW THE NEIGHBOURHOOD",
        title: "Rooted in western",
        accent: "Mumbai.",
        body: "Local insight makes all the difference. We serve the neighbourhoods of Goregaon and Malad, Mumbai.",
        button_label: "Ask about your area",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "goregaon",
        type: "text",
        title: "Goregaon",
        body: "Residential communities, everyday amenities and business destinations across Mumbai’s western suburbs.",
        media_path: "static:residential-tower",
        button_label: "Enquire in Goregaon",
        button_url: "#contact",
        active: true,
      },
      {
        id: "malad",
        type: "text",
        title: "Malad",
        body: "Share your preferred neighbourhood and we’ll help you explore residential or commercial property possibilities nearby.",
        media_path: "static:commercial-space",
        button_label: "Enquire in Malad",
        button_url: "#contact",
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        title: "Visit our Malad West office.",
        body: "Open directions using the address in the published website settings.",
        active: true,
      },
    ],
    gallery: [
      {
        id: "hero",
        type: "hero",
        eyebrow: "A VISUAL PROPERTY JOURNEY",
        title: "Spaces with",
        accent: "possibility.",
        body: "A curated visual showcase of residential, commercial and interior styles. Images illustrate property types and are not current listings.",
        button_label: "Discuss a property",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "gallery",
        type: "gallery",
        title: "Property gallery",
        body: "Illustrative imagery only. Individual availability, features and pricing are shared on enquiry.",
        items: galleryItems,
        active: true,
      },
      { id: "contact", type: "contact", title: "Discuss a property.", active: true },
    ],
    contact: [
      {
        id: "hero",
        type: "hero",
        eyebrow: "LET’S START A CONVERSATION",
        title: "Tell us what",
        accent: "you’re looking for.",
        body: "Speak with Rajan Sarraf about your residential or commercial property needs in Goregaon, Malad or the surrounding Mumbai area.",
        button_label: "Make an enquiry",
        button_url: "#contact",
        media_path: "static:mumbai-residences-hero",
        active: true,
      },
      {
        id: "intro",
        type: "text",
        title: "Reach Rajan Sarraf directly.",
        body: "Call, email or send a WhatsApp enquiry. Sarraf Properties serves Goregaon and Malad, Mumbai.",
        media_path: "static:premium-apartment",
        active: true,
      },
      {
        id: "contact",
        type: "contact",
        eyebrow: "CONTACT FORM",
        title: "How can we help?",
        body: "Use the enquiry form to prepare a WhatsApp message. Call, WhatsApp and email contact details are shown here.",
        active: true,
      },
    ],
  };
  const sections = pages[slug];
  return sections ? { sections } : null;
}

export type PublishedSiteSettings = {
  site_name: string;
  default_seo_title: string;
  default_seo_description: string;
  global_cta_title: string;
  global_cta_description: string;
  global_cta_label: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  footer_text: string;
  facebook: string;
  instagram: string;
  youtube: string;
  logo_path: string;
  favicon_path: string;
};
const defaultSiteSettings: PublishedSiteSettings = {
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
  footer_text:
    "Your trusted real estate partner in Goregaon and Malad, Mumbai. Professional guidance, personal attention.",
  facebook: "",
  instagram: "",
  youtube: "",
  logo_path: "",
  favicon_path: "",
};

export function usePublishedSiteSettings() {
  const [settings, setSettings] = useState<PublishedSiteSettings>(defaultSiteSettings);
  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    let alive = true;
    void Promise.resolve(
      db
        .from("cms_published_settings")
        .select("settings")
        .eq("id", true)
        .maybeSingle()
        .then(({ data }) => {
          if (alive && data?.settings) {
            setSettings((current) => ({
              ...current,
              ...(data.settings as Partial<PublishedSiteSettings>),
            }));
            const faviconPath = (data.settings as Partial<PublishedSiteSettings>).favicon_path;
            if (faviconPath)
              void signedMediaUrl(faviconPath).then((url) => {
                if (!alive || !url || typeof document === "undefined") return;
                let link = document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
                if (!link) {
                  link = document.createElement("link");
                  link.rel = "icon";
                  document.head.append(link);
                }
                link.href = url;
              });
          }
        }),
    ).catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
  return settings;
}

export function defaultCmsSection(type: CmsSection["type"] = "text"): CmsSection {
  return {
    id: crypto.randomUUID(),
    type,
    eyebrow: "",
    title: "New section",
    accent: "",
    body: "",
    button_label: "",
    button_url: "",
    media_path: "",
    mobile_media_path: "",
    thumbnail_path: "",
    media_title: "",
    media_description: "",
    caption: "",
    alt_text: "",
    active: true,
    items: [],
  };
}

export async function signedMediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("static:")) {
    return bundledSiteMedia.find((asset) => asset.key === path)?.url || "";
  }
  const db = getSupabase();
  if (!db) return "";
  const { data, error } = await db.storage.from(mediaBucket).createSignedUrl(path, 3600);
  return error ? "" : data.signedUrl;
}

export async function uploadCmsMedia(file: File, page: string, section: string) {
  const db = getSupabase();
  if (!db) throw new Error("Supabase is not configured.");
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "video/mp4",
    "video/webm",
  ];
  if (!allowed.includes(file.type))
    throw new Error("Use JPG, PNG, WEBP, AVIF, MP4, or WEBM media.");
  const video = file.type.startsWith("video/");
  const limit = video ? maxVideoMb : maxImageMb;
  if (file.size > limit * 1024 * 1024)
    throw new Error(`${video ? "Video" : "Image"} must be ${limit} MB or smaller.`);
  const extension = file.name.split(".").pop()?.toLowerCase() || (video ? "mp4" : "jpg");
  const path = `${page}/${section}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await db.storage
    .from(mediaBucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const publicUrl = db.storage.from(mediaBucket).getPublicUrl(path).data.publicUrl;
  const { data: asset, error: assetError } = await db
    .from("media_assets")
    .insert({
      page_slug: page,
      section_key: section,
      media_type: video ? "video" : "image",
      file_path: path,
      public_url: publicUrl,
      title: file.name.replace(/\.[^.]+$/, ""),
      description: "",
      alt_text: "",
      caption: "",
      sort_order: 0,
      is_active: true,
    })
    .select("id,file_path,media_type,title")
    .single();
  if (assetError) {
    await db.storage.from(mediaBucket).remove([path]);
    throw new Error(assetError.message);
  }
  return asset as { id: string; file_path: string; media_type: "image" | "video"; title: string };
}
