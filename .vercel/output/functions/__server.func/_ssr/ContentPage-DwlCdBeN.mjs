import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Building2, S as Check, T as ArrowRight, a as Sparkles, b as ChevronLeft, c as Phone, d as MapPin, h as House, l as MessageCircle, o as ShieldCheck, r as TrendingUp, t as X, y as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as whatsappUrl, n as enquiryServices, r as openEnquiryForm } from "./SiteLayout-Dq-Wo0wx.mjs";
import { a as residential_tower_default, c as service_consultation_default, d as service_selling_default, i as premium_apartment_default, l as service_investment_default, n as commercial_space_default, o as service_buying_default, r as mumbai_residences_hero_default, s as service_commercial_default, t as ManagedMediaImage, u as service_residential_default } from "./ManagedMedia-CGDyXwYL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ContentPage-DwlCdBeN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var contact = {
	name: "Rajan Sarraf",
	phone: "8652869869",
	email: "Sarrafproperties2011@gmail.com",
	address: "Shop No.4, Patidar Society, Opp. Ezone Mall, Malad (W), Mumbai - 400064"
};
var photos = [
	{
		src: residential_tower_default,
		category: "Residential",
		title: "Contemporary residences",
		alt: "Contemporary residential tower surrounded by greenery"
	},
	{
		src: premium_apartment_default,
		category: "Interiors",
		title: "Warm modern interiors",
		alt: "Premium apartment interior"
	},
	{
		src: commercial_space_default,
		category: "Commercial",
		title: "Modern workspaces",
		alt: "Modern commercial property"
	},
	{
		src: mumbai_residences_hero_default,
		category: "Architecture",
		title: "Mumbai city living",
		alt: "Mumbai residential skyline"
	}
];
var featureData = [
	{
		icon: House,
		image: service_residential_default,
		title: "Residential Property Consultation",
		text: "Explore apartments, flats and homes suited to your needs, preferred neighbourhood and plans."
	},
	{
		icon: Building2,
		image: service_commercial_default,
		title: "Commercial Property Consultation",
		text: "Discuss office, retail and business space requirements across Goregaon and Malad."
	},
	{
		icon: ShieldCheck,
		image: service_buying_default,
		title: "Property Buying Assistance",
		text: "Get clear guidance from initial search and property visits through your decision process."
	},
	{
		icon: Sparkles,
		image: service_selling_default,
		title: "Property Selling Assistance",
		text: "Plan your sale with attentive local support, thoughtful presentation and enquiry coordination."
	},
	{
		icon: TrendingUp,
		image: service_investment_default,
		title: "Property Investment Guidance",
		text: "Talk through your goals and evaluate property options with a grounded local perspective."
	},
	{
		icon: MessageCircle,
		image: service_consultation_default,
		title: "Real Estate Consultation",
		text: "Get a personal conversation about the next step in your property journey."
	}
];
var pageInfo = {
	about: {
		eyebrow: "A LOCAL NAME YOU CAN TRUST",
		title: "Real estate with a",
		accent: "personal touch.",
		intro: "Sarraf Properties is a local real estate partner serving Goregaon and Malad, Mumbai. We bring professional guidance and attentive service to every property conversation."
	},
	residential: {
		eyebrow: "FIND A PLACE TO CALL YOURS",
		title: "Residential spaces",
		accent: "for every chapter.",
		intro: "Explore residential property possibilities across Mumbai’s western suburbs, from apartments and flats to modern homes and residential projects."
	},
	commercial: {
		eyebrow: "SPACE TO DO BUSINESS",
		title: "Commercial property",
		accent: "with purpose.",
		intro: "Discover office, retail and business space opportunities across Goregaon and Malad with a local team ready to understand your requirements."
	},
	buy: {
		eyebrow: "YOUR NEXT MOVE, WELL CONSIDERED",
		title: "Buy property with",
		accent: "clear guidance.",
		intro: "From narrowing down your search to making a confident decision, we help you navigate the property buying process with personal support."
	},
	sell: {
		eyebrow: "A THOUGHTFUL PROPERTY SALE",
		title: "Sell with a local",
		accent: "partner beside you.",
		intro: "Get personal assistance as you prepare to sell, understand your options and connect with prospective property seekers."
	},
	services: {
		eyebrow: "HERE FOR EVERY STEP",
		title: "Real estate, made",
		accent: "more personal.",
		intro: "Considered support for residential and commercial property decisions, whether you are buying, selling or exploring your next move."
	},
	locations: {
		eyebrow: "KNOW THE NEIGHBOURHOOD",
		title: "Rooted in western",
		accent: "Mumbai.",
		intro: "Local insight makes all the difference. We serve the neighbourhoods of Goregaon and Malad, Mumbai."
	},
	gallery: {
		eyebrow: "A VISUAL PROPERTY JOURNEY",
		title: "Spaces with",
		accent: "possibility.",
		intro: "A curated visual showcase of residential, commercial and interior styles. Images illustrate property types and are not current listings."
	},
	contact: {
		eyebrow: "LET’S START A CONVERSATION",
		title: "Tell us what",
		accent: "you’re looking for.",
		intro: "Speak with Rajan Sarraf about your residential or commercial property needs in Goregaon, Malad or the surrounding Mumbai area."
	}
};
function EnquiryForm({ type = "property" }) {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	function submit(event) {
		event.preventDefault();
		setError("");
		const data = new FormData(event.currentTarget);
		const name = String(data.get("name") ?? "").trim();
		const phone = String(data.get("phone") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const message = String(data.get("message") ?? "").trim();
		const service = String(data.get("service") ?? "");
		if (name.length < 2 || !/^[+\d()\s-]{8,18}$/.test(phone) || email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !enquiryServices.includes(service)) {
			setError("Please check your name, mobile number, email and selected service.");
			return;
		}
		const enquiry = [
			`Hello Sarraf Properties, I’m ${name}.`,
			`Mobile: ${phone}`,
			...email ? [`Email: ${email}`] : [],
			`Service: ${service}`,
			...message ? [`Additional message: ${message}`] : []
		].join("\n");
		window.open(whatsappUrl(enquiry), "_blank", "noopener,noreferrer");
		setSent(true);
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "form-success",
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Enquiry ready in WhatsApp" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Complete sending your prefilled message in WhatsApp to reach Rajan Sarraf." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "button-outline",
				onClick: () => setSent(false),
				children: "Send another enquiry"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "enquiry-form",
		onSubmit: submit,
		noValidate: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PERSONAL PROPERTY GUIDANCE" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "How can we help?" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Share a few details and we’ll prepare a WhatsApp enquiry." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: `${type}-name`,
				children: "Your name *"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: `${type}-name`,
				name: "name",
				autoComplete: "name",
				required: true,
				minLength: 2,
				placeholder: "Name"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "form-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: `${type}-phone`,
					children: "Mobile number *"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `${type}-phone`,
					name: "phone",
					type: "tel",
					autoComplete: "tel",
					required: true,
					pattern: "[+0-9() -]{8,18}",
					placeholder: "Mobile number"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: `${type}-email`,
					children: "Email (optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: `${type}-email`,
					name: "email",
					type: "email",
					autoComplete: "email",
					placeholder: "Email address"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: `${type}-service`,
				children: "Service *"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				id: `${type}-service`,
				name: "service",
				required: true,
				defaultValue: type === "buy" ? "Property Buying Assistance" : type === "sell" ? "Property Selling Assistance" : "",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					disabled: true,
					children: "Select a service"
				}), enquiryServices.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: service,
					children: service
				}, service))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: `${type}-message`,
				children: "Additional message (optional)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: `${type}-message`,
				name: "message",
				rows: 4,
				placeholder: "Tell us about your plans…"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "form-error",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "button-gold form-submit",
				type: "submit",
				children: ["Continue on WhatsApp ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
				className: "form-privacy",
				children: "We’ll open WhatsApp with your message ready for you to review and send."
			})
		]
	});
}
function PhotoStrip({ titles = false, page }) {
	const slug = {
		residential: "residential-properties",
		commercial: "commercial-properties",
		buy: "buy-property",
		sell: "sell-property"
	}[page] || page;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "photo-strip",
		children: photos.slice(0, 3).map((photo, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
			page: slug,
			section: `gallery-${index + 1}`,
			fallback: photo.src,
			alt: photo.alt,
			loading: "lazy"
		}), titles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", { children: photo.title })] }, photo.title))
	});
}
function PageHero({ page }) {
	const info = pageInfo[page];
	const slug = {
		residential: "residential-properties",
		commercial: "commercial-properties",
		buy: "buy-property",
		sell: "sell-property"
	}[page] || page;
	const fallback = page === "commercial" ? commercial_space_default : page === "residential" || page === "gallery" ? residential_tower_default : mumbai_residences_hero_default;
	const service = page === "residential" ? "Residential Property Consultation" : page === "commercial" ? "Commercial Property Consultation" : page === "buy" ? "Property Buying Assistance" : page === "sell" ? "Property Selling Assistance" : "Real Estate Consultation";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "page-hero",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
				page: slug,
				section: "hero",
				fallback,
				alt: "",
				"aria-hidden": "true",
				className: "managed-hero-media"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "page-hero-shade" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "page-hero-content",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), info.eyebrow]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						info.title,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: info.accent })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: info.intro }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "button-gold",
						type: "button",
						onClick: () => openEnquiryForm(service),
						children: ["Speak with us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			})
		]
	});
}
function IntroSection({ title, text, image = residential_tower_default, page }) {
	const slug = {
		residential: "residential-properties",
		commercial: "commercial-properties",
		buy: "buy-property",
		sell: "sell-property"
	}[page] || page;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "page-intro section-wrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "page-intro-image",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
				page: slug,
				section: "intro",
				fallback: image,
				alt: "Premium property in Mumbai",
				loading: "lazy"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "eyebrow dark-eyebrow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " SARRAF PROPERTIES"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Every client’s needs are different. We listen first, share clear information and provide personal assistance throughout the conversation." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				className: "underlined-link",
				to: "/contact",
				children: ["Talk to our team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
			})
		] })]
	});
}
function CtaBand({ title = "Let’s find the right next step." }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "cta-band",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "eyebrow",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " YOUR TRUSTED REAL ESTATE PARTNER"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cta-actions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "button-gold",
					type: "button",
					onClick: () => openEnquiryForm(),
					children: ["Make an enquiry ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					className: "cta-whatsapp",
					href: whatsappUrl(),
					target: "_blank",
					rel: "noreferrer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {}), " WhatsApp us"]
				})]
			})]
		})
	});
}
function ContentPage({ page }) {
	const [filters, setFilters] = (0, import_react.useState)(["Residential", "Commercial"]);
	const [lightbox, setLightbox] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `content-page page-${page}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, { page }),
			page === "about" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntroSection, {
					page,
					title: "A trusted local real estate partner.",
					text: "Sarraf Properties helps clients find the right residential and commercial property across Goregaon and Malad, Mumbai. Led by Rajan Sarraf, our approach is built around attentive service, local knowledge and dependable guidance."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "values-section section-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "eyebrow dark-eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " WHAT GUIDES US"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Good property decisions begin with ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "trust." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "value-grid",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Our approach" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Understand each client’s needs and provide practical, personal guidance." })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Our mission" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Make real estate decisions clearer through responsive support and local insight." })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Our vision" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Be the trusted neighbourhood partner people return to for their property needs." })
								] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoStrip, { page })
			] }),
			(page === "residential" || page === "commercial") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntroSection, {
				page,
				image: page === "commercial" ? "/assets/commercial-space-BIhJRfaW.jpg" : "/assets/premium-apartment-D_xQsZhB.jpg",
				title: page === "commercial" ? "Find space for your business." : "Find a home that feels right.",
				text: page === "commercial" ? "We can help you explore office spaces, retail shops, commercial buildings and flexible business spaces in the western suburbs." : "Explore luxury apartments, premium flats, residential projects and modern homes with guidance tailored to your preferences."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "opportunity-section section-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "eyebrow dark-eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " PROPERTY POSSIBILITIES"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page === "commercial" ? "A considered commercial search." : "A more personal home search." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tell us your requirements and we’ll discuss suitable options and next steps. Availability and property details are shared directly on enquiry; no listings or prices are assumed here." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoStrip, {
						titles: true,
						page
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "button-gold",
						type: "button",
						onClick: () => openEnquiryForm(page === "commercial" ? "Commercial Property Consultation" : "Residential Property Consultation"),
						children: [
							"Enquire about ",
							page,
							" properties ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
						]
					})
				]
			})] }),
			(page === "buy" || page === "sell" || page === "contact") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntroSection, {
					page,
					image: page === "sell" ? "/assets/residential-tower-BRNijfrk.jpg" : "/assets/premium-apartment-D_xQsZhB.jpg",
					title: page === "buy" ? "A clear path to your next home." : page === "sell" ? "Thoughtful support for your sale." : "Reach Rajan Sarraf directly.",
					text: page === "buy" ? "We start by understanding your budget, preferred areas, property type and timing. Together, we can define a search, arrange conversations and help you consider your options." : page === "sell" ? "We listen to your goals, discuss your property and preferred timing, then help coordinate the conversations and next steps involved in your sale." : "Call, email or send a WhatsApp enquiry. Sarraf Properties serves Goregaon and Malad, Mumbai."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "process-section section-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "eyebrow dark-eyebrow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
								" ",
								page === "sell" ? "YOUR SELLING JOURNEY" : "YOUR PROPERTY JOURNEY"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page === "sell" ? "How we support sellers." : "How we support buyers." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "steps-grid",
							children: (page === "sell" ? [
								"Share your property goals",
								"Discuss a considered plan",
								"Connect and coordinate enquiries",
								"Move forward with support"
							] : [
								"Share your requirements",
								"Explore relevant options",
								"Visit and consider properties",
								"Make an informed decision"
							]).map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["0", i + 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: step })] }, step))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "form-section section-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "eyebrow dark-eyebrow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
								" ",
								page === "sell" ? "SELLER ENQUIRY" : page === "buy" ? "BUYER ENQUIRY" : "CONTACT FORM"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: page === "sell" ? "Let’s talk about your property." : page === "buy" ? "Tell us what you’re looking for." : "How can we help?" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Use the form to prepare an enquiry message. It opens WhatsApp for you to review and send." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactDetails, {})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiryForm, { type: page })]
				})
			] }),
			page === "services" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "services-section section-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "service-page-intro",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "eyebrow dark-eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " PERSONAL, LOCAL SUPPORT"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Support for every property decision." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "From a first conversation to a confident next step, our services are shaped around you." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "services-grid",
					children: featureData.map(({ icon: Icon, image, title, text }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "service-item",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
								page: "services",
								section: `service-${i + 1}`,
								className: "service-row-image",
								fallback: image,
								alt: `${title} service`,
								width: 1200,
								height: 800,
								loading: "lazy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "service-top",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "service-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "service-index",
									children: ["0", i + 1]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "service-card-actions",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "service-enquiry",
									type: "button",
									onClick: () => openEnquiryForm(title),
									"aria-label": `Enquire about ${title}`,
									children: ["Enquire ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "service-call-now",
									href: "tel:8652869869",
									"aria-label": `Call now about ${title}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}), " Call now"]
								})]
							})
						]
					}, title))
				})]
			}),
			page === "locations" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "locations-detail section-wrap",
				children: ["Goregaon", "Malad"].map((area, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "area-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
						page: "locations",
						section: i ? "malad" : "goregaon",
						fallback: i ? "/assets/commercial-space-BIhJRfaW.jpg" : "/assets/residential-tower-BRNijfrk.jpg",
						alt: `${area}, Mumbai property and neighbourhood`,
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "area-index",
							children: [
								"0",
								i + 1,
								" / MUMBAI"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: area }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [area, " brings together residential communities, everyday amenities and business destinations across Mumbai’s western suburbs. Share your preferred neighbourhood and we’ll help you explore residential or commercial property possibilities nearby."] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "area-tags",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Residential opportunities" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Commercial spaces" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Local guidance" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "underlined-link location-enquiry-button",
							onClick: () => openEnquiryForm("Real Estate Consultation", `Preferred area: ${area}`),
							children: [
								"Enquire in ",
								area,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
							]
						})
					] })]
				}, area))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "map-section section-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "eyebrow dark-eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " VISIT OUR OFFICE"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Find us in Malad West." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: contact.address }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "underlined-link",
						href: "https://maps.google.com/?q=Shop+No.4,+Patidar+Society,+Opp.+Ezone+Mall,+Malad+West,+Mumbai+400064",
						target: "_blank",
						rel: "noreferrer",
						children: ["Open directions ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "Sarraf Properties office location map",
					src: "https://www.google.com/maps?q=Shop%20No.4%20Patidar%20Society%20Opp%20Ezone%20Mall%20Malad%20West%20Mumbai%20400064&output=embed",
					loading: "lazy",
					referrerPolicy: "no-referrer-when-downgrade"
				})]
			})] }),
			page === "gallery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "gallery-page-section section-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "gallery-filter",
						role: "group",
						"aria-label": "Filter gallery images",
						children: ["Residential", "Commercial"].map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": filters.includes(category),
							className: filters.includes(category) ? "selected" : "",
							onClick: () => setFilters((selected) => selected.includes(category) ? selected.length > 1 ? selected.filter((item) => item !== category) : selected : [...selected, category]),
							children: category
						}, category))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "gallery-page-grid",
						children: photos.filter((photo) => filters.includes(photo.category)).map((photo) => {
							const index = photos.indexOf(photo);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "gallery-card",
								onClick: () => setLightbox(index),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
										page: "gallery",
										section: `gallery-${index + 1}`,
										fallback: photo.src,
										alt: photo.alt,
										loading: "lazy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: photo.category }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: photo.title })
								]
							}, photo.title);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "gallery-note",
						children: "Illustrative imagery only. Individual availability, features and pricing are shared on enquiry."
					}),
					lightbox !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lightbox",
						role: "dialog",
						"aria-modal": "true",
						"aria-label": photos[lightbox].title,
						onClick: () => setLightbox(null),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "lightbox-close",
								"aria-label": "Close image",
								onClick: () => setLightbox(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "lightbox-prev",
								"aria-label": "Previous image",
								onClick: (e) => {
									e.stopPropagation();
									setLightbox((lightbox + photos.length - 1) % photos.length);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
								onClick: (e) => e.stopPropagation(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: photos[lightbox].src,
									alt: photos[lightbox].alt
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [
									photos[lightbox].title,
									" · ",
									photos[lightbox].category
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "lightbox-next",
								"aria-label": "Next image",
								onClick: (e) => {
									e.stopPropagation();
									setLightbox((lightbox + 1) % photos.length);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaBand, { title: page === "about" ? "Let’s make your next move together." : "Your next move starts with a conversation." })
		]
	});
}
function ContactDetails() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "contact-details",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "tel:8652869869",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}), "8652869869"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: whatsappUrl(),
				target: "_blank",
				rel: "noreferrer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {}), "WhatsApp Rajan Sarraf"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "mailto:Sarrafproperties2011@gmail.com",
				children: "✉ Sarrafproperties2011@gmail.com"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "https://www.propsteps.com",
				target: "_blank",
				rel: "noreferrer",
				children: "www.Propsteps.com"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {}), contact.address] })
		]
	});
}
//#endregion
export { ContentPage as t };
