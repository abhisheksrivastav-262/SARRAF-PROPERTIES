import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as Building2, E as ArrowDown, S as Check, T as ArrowRight, a as Sparkles, c as Phone, d as MapPin, f as Mail, g as Handshake, h as House, l as MessageCircle, o as ShieldCheck, r as TrendingUp, v as Compass, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { i as whatsappUrl, n as enquiryServices, r as openEnquiryForm } from "./SiteLayout-Dq-Wo0wx.mjs";
import { a as residential_tower_default, c as service_consultation_default, d as service_selling_default, i as premium_apartment_default, l as service_investment_default, n as commercial_space_default, o as service_buying_default, r as mumbai_residences_hero_default, s as service_commercial_default, t as ManagedMediaImage, u as service_residential_default } from "./ManagedMedia-CGDyXwYL.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CM7LBAy_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var services = [
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
		icon: Handshake,
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
		icon: Compass,
		image: service_consultation_default,
		title: "Real Estate Consultation",
		text: "Get a personal conversation about the next step in your property journey."
	}
];
var featuredServices = [
	{
		icon: House,
		image: service_residential_default,
		title: "Residential",
		href: "/residential-properties",
		summary: "Explore apartments, flats and homes in Goregaon and Malad with guidance shaped around your priorities.",
		benefits: [
			"Discuss preferred neighbourhoods and property types",
			"Compare options around your needs",
			"Get personal support as you plan property visits"
		]
	},
	{
		icon: Building2,
		image: service_commercial_default,
		title: "Commercial",
		href: "/commercial-properties",
		summary: "Find out about office, retail and business spaces across Mumbai’s western suburbs.",
		benefits: [
			"Start with your intended business use",
			"Discuss location and space requirements",
			"Explore relevant commercial property options"
		]
	},
	{
		icon: Handshake,
		image: service_buying_default,
		title: "Buy Property",
		href: "/buy-property",
		summary: "Get assistance as you define your search, explore options and consider your next move.",
		benefits: [
			"Clarify your requirements and preferred areas",
			"Get support coordinating property conversations",
			"Move through the search with a clear next step"
		]
	},
	{
		icon: Sparkles,
		image: service_selling_default,
		title: "Sell Property",
		href: "/sell-property",
		summary: "Talk through your property and goals with a local real estate partner.",
		benefits: [
			"Discuss your property and preferred timing",
			"Understand the steps involved in your sale",
			"Get support coordinating prospective enquiries"
		]
	}
];
var gallery = [
	{
		image: residential_tower_default,
		title: "Contemporary residences",
		type: "Residential living",
		className: "gallery-large"
	},
	{
		image: premium_apartment_default,
		title: "Thoughtful interiors",
		type: "Premium homes",
		className: ""
	},
	{
		image: commercial_space_default,
		title: "Modern workspaces",
		type: "Commercial spaces",
		className: ""
	}
];
function HomePage() {
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	function handleSubmit(event) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const name = String(form.get("name") ?? "");
		const phone = String(form.get("phone") ?? "");
		const email = String(form.get("email") ?? "");
		const message = String(form.get("message") ?? "");
		const service = String(form.get("service") ?? "General property enquiry");
		const body = [
			`Hello Sarraf Properties, I’m ${name}.`,
			`Mobile: ${phone}`,
			...email ? [`Email: ${email}`] : [],
			`Service: ${service}`,
			...message ? [`Additional message: ${message}`] : []
		].join("\n");
		window.open(whatsappUrl(body), "_blank", "noopener,noreferrer");
		setSubmitted(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "hero",
			id: "home",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
					page: "home",
					section: "hero",
					fallback: mumbai_residences_hero_default,
					alt: "",
					"aria-hidden": "true",
					className: "managed-hero-media"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hero-shade" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-content",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " REAL ESTATE, THOUGHTFULLY GUIDED"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"Find your dream",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"property ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "in Mumbai." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your trusted real estate partner in Goregaon & Malad." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "button-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#properties",
									children: ["Explore properties ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#contact",
								className: "text-link",
								children: ["Speak with our team ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hero-caption",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
						" GOREGAON · MALAD · MUMBAI"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "scroll-cue",
					href: "#about",
					"aria-label": "Scroll to about Sarraf Properties",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "trust-strip",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LOCAL KNOWLEDGE" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PERSONAL SERVICE" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TRUSTED GUIDANCE" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WESTERN MUMBAI" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "about-section section-wrap",
			id: "about",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "about-image-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
					page: "home",
					section: "about",
					fallback: residential_tower_default,
					alt: "A contemporary residence framed by greenery in Mumbai",
					width: 1200,
					height: 912,
					loading: "lazy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "image-note",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "note-mark",
						children: "S."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"Rooted in the",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "neighbourhood." })
					] })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "about-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "eyebrow dark-eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " A LOCAL NAME YOU CAN TRUST"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"About ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Sarraf" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Properties"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "body-large",
						children: "Welcome to Sarraf Properties, your trusted real estate partner in Goregaon and Malad, Mumbai."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We help clients find the right residential and commercial properties with professional guidance, personalized assistance and reliable real estate services." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "benefit-list",
						children: [
							{
								icon: ShieldCheck,
								text: "Trusted property guidance"
							},
							{
								icon: MapPin,
								text: "Local area expertise"
							},
							{
								icon: Handshake,
								text: "Personalized assistance"
							},
							{
								icon: Sparkles,
								text: "Professional service"
							}
						].map(({ icon: Icon, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "benefit",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: text })]
						}, text))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "underlined-link",
						href: "#contact",
						children: ["Get to know us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "showcase-section",
			id: "properties",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-heading heading-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " SPACES WITH POTENTIAL"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["A glimpse of ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "what’s possible." })] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Explore the kinds of homes and spaces we help our clients discover across Mumbai’s western suburbs." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "gallery-grid",
						children: gallery.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `gallery-item ${item.className}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
								page: "home",
								section: `gallery-${index + 1}`,
								fallback: item.image,
								alt: item.title,
								width: 1200,
								height: 912,
								loading: "lazy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "gallery-overlay",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"0",
									index + 1,
									" / ",
									item.type
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.title })]
							})]
						}, item.title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "gallery-note",
						children: "A visual showcase of property styles. Details on individual properties are available on enquiry."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "services-section section-wrap",
			id: "services",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-heading centered-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "eyebrow dark-eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " OUR SIX CORE SERVICES"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: ["Support for every ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "property move." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Local, personal guidance across buying, selling, property search and investment." })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "services-grid",
				children: services.map(({ icon: Icon, image, title, text }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "service-item",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
							page: "home",
							section: `service-${index + 1}`,
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
								children: ["0", index + 1]
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "featured-services-section",
			"aria-labelledby": "featured-services-title",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "featured-services-heading",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "eyebrow dark-eyebrow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " FOUR WAYS WE CAN HELP"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								id: "featured-services-title",
								children: ["Your property journey, ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "personally guided." })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose the support you need in Goregaon, Malad and across Mumbai’s western suburbs." })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "featured-services-grid",
						children: featuredServices.map(({ icon: Icon, image, title, href, summary, benefits }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "featured-service-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagedMediaImage, {
									page: "home",
									section: `featured-${index + 1}`,
									className: "featured-service-image",
									fallback: image,
									alt: `${title} property service`,
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
										children: ["0", index + 1]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: title }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: summary }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: benefits.map((benefit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), benefit] }, benefit)) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href,
									className: "underlined-link",
									children: [
										"Explore ",
										title,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
									]
								})
							]
						}, title))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "featured-enquiry-area",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "featured-call-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "eyebrow",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " READY TO TALK?"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Get personal help with your next move." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tell us what you’re looking for or call Rajan Sarraf directly." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									className: "button-gold call-now-button",
									href: "tel:8652869869",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}),
										" Call now ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "8652869869" })
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "enquiry-panel featured-enquiry-panel",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "form-heading",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PERSONAL PROPERTY GUIDANCE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Make an enquiry" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Share your details and continue in WhatsApp." })
								]
							}), submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "form-success",
								role: "status",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Your enquiry is ready in WhatsApp." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Complete sending your prefilled message in WhatsApp to reach Rajan Sarraf." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => setSubmitted(false),
										children: "Send another enquiry"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "name",
										children: "Your name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										name: "name",
										placeholder: "Name",
										autoComplete: "name",
										minLength: 2,
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "form-row",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "phone",
											children: "Mobile number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "phone",
											name: "phone",
											type: "tel",
											placeholder: "Mobile number",
											autoComplete: "tel",
											pattern: "[+0-9() -]{8,18}",
											minLength: 8,
											required: true
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "email",
											children: "Email (optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "email",
											name: "email",
											type: "email",
											placeholder: "Email address",
											autoComplete: "email"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "service",
										children: "Service you’re interested in"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "service",
										name: "service",
										defaultValue: "",
										required: true,
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
										htmlFor: "message",
										children: "Additional message (optional)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "message",
										name: "message",
										placeholder: "Share your requirements…",
										rows: 3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "button-gold form-submit",
										type: "submit",
										children: ["Continue on WhatsApp ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "form-privacy",
										children: "Your enquiry opens as a prefilled WhatsApp message for you to review and send."
									})
								]
							})]
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "locations-section",
			"aria-labelledby": "locations-title",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-wrap locations-inner",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "locations-copy",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "eyebrow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " KNOW THE NEIGHBOURHOOD"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							id: "locations-title",
							children: [
								"At home in",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "western Mumbai." })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Local insight makes all the difference. We know the character, connections and opportunities of the neighbourhoods we serve." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#contact",
							className: "text-link",
							children: ["Find your place here ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "location-list",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://maps.google.com/?q=Goregaon+Mumbai",
							target: "_blank",
							rel: "noreferrer",
							className: "location-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "location-no",
									children: "01"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Goregaon" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Mumbai, Maharashtra" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://maps.google.com/?q=Malad+Mumbai",
							target: "_blank",
							rel: "noreferrer",
							className: "location-row",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "location-no",
									children: "02"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Malad" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Mumbai, Maharashtra" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "location-stamp",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"YOUR LOCAL",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"PROPERTY PARTNER"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "S." })]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "contact-section section-wrap home-contact-details",
			id: "contact",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "contact-intro",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "eyebrow dark-eyebrow",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), " LET’S FIND YOUR NEXT MOVE"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"Every good move",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"starts with a ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "conversation." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tell us what you’re looking for. Rajan and the team are here to help." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "contact-direct",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "tel:8652869869",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "contact-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "CALL US" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "86528 69869" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: whatsappUrl(),
								target: "_blank",
								rel: "noreferrer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "contact-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "WHATSAPP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Send an enquiry" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "mailto:Sarrafproperties2011@gmail.com",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "contact-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "EMAIL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sarrafproperties2011@gmail.com" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "address-block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Visit our office" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Shop No.4, Patidar Society,",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Opp. Ezone Mall, Malad (W),",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Mumbai - 400064"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "website-link",
						href: "https://www.propsteps.com",
						target: "_blank",
						rel: "noreferrer",
						children: ["www.Propsteps.com ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			})
		})
	] });
}
//#endregion
export { HomePage as component };
