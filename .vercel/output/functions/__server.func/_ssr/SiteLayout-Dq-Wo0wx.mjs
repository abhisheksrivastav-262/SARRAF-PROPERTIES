import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { S as Check, T as ArrowRight, c as Phone, l as MessageCircle, t as X, u as Menu } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteLayout-Dq-Wo0wx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sarraf_logo_mark_default = "/assets/sarraf-logo-mark-CJ2XGh_p.webp";
var siteNavigation = [
	["Home", "/"],
	["About Us", "/about"],
	["Residential", "/residential-properties"],
	["Commercial", "/commercial-properties"],
	["Buy Property", "/buy-property"],
	["Sell Property", "/sell-property"],
	["Services", "/services"],
	["Locations", "/locations"],
	["Gallery", "/gallery"],
	["Contact", "/contact"]
];
function whatsappUrl(message = "Hello Sarraf Properties, I would like to enquire about a property.") {
	return `https://wa.me/918652869869?text=${encodeURIComponent(message)}`;
}
var enquiryServices = [
	"Residential Property Consultation",
	"Commercial Property Consultation",
	"Property Buying Assistance",
	"Property Selling Assistance",
	"Property Investment Guidance",
	"Real Estate Consultation"
];
function openEnquiryForm(service, message) {
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("sarraf:open-enquiry", { detail: {
		service,
		message
	} }));
}
function SiteLayout({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [enquiryOpen, setEnquiryOpen] = (0, import_react.useState)(false);
	const [enquirySent, setEnquirySent] = (0, import_react.useState)(false);
	const [servicePrefill, setServicePrefill] = (0, import_react.useState)("");
	const [messagePrefill, setMessagePrefill] = (0, import_react.useState)("");
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	(0, import_react.useEffect)(() => {
		const handleOpen = (event) => {
			const detail = event.detail;
			setServicePrefill(detail?.service && enquiryServices.includes(detail.service) ? detail.service : "");
			setMessagePrefill(detail?.message ?? "");
			setEnquirySent(false);
			setEnquiryOpen(true);
		};
		window.addEventListener("sarraf:open-enquiry", handleOpen);
		return () => window.removeEventListener("sarraf:open-enquiry", handleOpen);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!enquiryOpen) return;
		const previousOverflow = document.body.style.overflow;
		const closeOnEscape = (event) => {
			if (event.key === "Escape") setEnquiryOpen(false);
		};
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", closeOnEscape);
		};
	}, [enquiryOpen]);
	function submitEnquiry(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const name = String(data.get("name") ?? "").trim();
		const phone = String(data.get("phone") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const service = String(data.get("service") ?? "");
		const message = String(data.get("message") ?? "").trim();
		const url = whatsappUrl([
			"Hello Sarraf Properties, I would like to make an enquiry.",
			`Name: ${name}`,
			`Mobile: ${phone}`,
			...email ? [`Email: ${email}`] : [],
			`Service: ${service}`,
			...message ? [`Additional message: ${message}`] : []
		].join("\n"));
		const whatsappWindow = window.open(url, "_blank");
		if (whatsappWindow) whatsappWindow.opener = null;
		else window.location.href = url;
		setEnquirySent(true);
	}
	function closeEnquiry() {
		setEnquiryOpen(false);
		setEnquirySent(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "site-header",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "nav-shell",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "brand",
						"aria-label": "Sarraf Properties home",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: sarraf_logo_mark_default,
							alt: "",
							className: "brand-mark"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "brand-copy",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SARRAF PROPERTIES" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "desktop-nav",
						"aria-label": "Main navigation",
						children: siteNavigation.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to,
							className: pathname === to ? "active" : "",
							"aria-current": pathname === to ? "page" : void 0,
							children: label
						}, to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "menu-toggle",
						type: "button",
						"aria-label": open ? "Close navigation menu" : "Open navigation menu",
						"aria-expanded": open,
						onClick: () => setOpen((value) => !value),
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
					})
				]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mobile-nav",
				"aria-label": "Mobile navigation",
				children: siteNavigation.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					onClick: () => setOpen(false),
					className: pathname === to ? "active" : "",
					children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				}, to))
			})]
		}),
		children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: "site-footer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-main section-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "footer-about",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "brand",
								"aria-label": "Sarraf Properties home",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: sarraf_logo_mark_default,
									alt: "",
									className: "brand-mark"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "brand-copy",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "SARRAF PROPERTIES" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your trusted real estate partner in Goregaon and Malad, Mumbai. Professional guidance, personal attention." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "footer-whatsapp",
								href: whatsappUrl(),
								target: "_blank",
								rel: "noreferrer",
								children: ["WhatsApp us ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "footer-column",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "footer-label",
							children: "EXPLORE"
						}), siteNavigation.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to,
							children: label
						}, to))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "footer-column",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "footer-label",
								children: "OUR SERVICES"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/residential-properties",
								children: "Residential properties"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/commercial-properties",
								children: "Commercial properties"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/buy-property",
								children: "Buying assistance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/sell-property",
								children: "Selling assistance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/services",
								children: "Consultation & investment"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "footer-column footer-contact",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "footer-label",
								children: "GET IN TOUCH"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Rajan Sarraf" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "tel:8652869869",
								children: "8652869869"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "mailto:Sarrafproperties2011@gmail.com",
								children: "Sarrafproperties2011@gmail.com"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Goregaon & Malad, Mumbai" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Shop No.4, Patidar Society,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Opp. Ezone Mall, Malad (W),",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Mumbai - 400064"
							] })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "footer-bottom section-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 SARRAF PROPERTIES. All Rights Reserved." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"GOREGAON ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					" MALAD ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
					" MUMBAI"
				] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "floating-contact",
			"aria-label": "Quick contact",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "floating-contact-link floating-whatsapp",
				type: "button",
				onClick: () => openEnquiryForm(),
				"aria-label": "Start a WhatsApp enquiry",
				title: "Start a WhatsApp enquiry",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WhatsApp" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				className: "floating-contact-link floating-call",
				href: "tel:8652869869",
				"aria-label": "Call Sarraf Properties",
				title: "Call Sarraf Properties",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Call us" })]
			})]
		}),
		enquiryOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "global-enquiry-backdrop",
			onClick: (event) => {
				if (event.target === event.currentTarget) closeEnquiry();
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "global-enquiry-dialog",
				role: "dialog",
				"aria-modal": "true",
				"aria-labelledby": "global-enquiry-title",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "global-enquiry-close",
					type: "button",
					"aria-label": "Close enquiry form",
					onClick: closeEnquiry,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				}), enquirySent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "global-enquiry-success",
					role: "status",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "global-enquiry-title",
							children: "WhatsApp enquiry is ready"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your details are in a prefilled WhatsApp message. Review it and tap Send to reach Sarraf Properties." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "button-gold",
							type: "button",
							onClick: closeEnquiry,
							children: "Done"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "global-enquiry-heading",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PERSONAL PROPERTY GUIDANCE" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "global-enquiry-title",
							children: "Make an enquiry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tell us how to reach you and what service you need." })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "global-enquiry-form",
					onSubmit: submitEnquiry,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "global-enquiry-name",
							children: "Your name *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "global-enquiry-name",
							name: "name",
							autoComplete: "name",
							minLength: 2,
							autoFocus: true,
							required: true,
							placeholder: "Full name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "global-enquiry-phone",
							children: "Mobile number *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "global-enquiry-phone",
							name: "phone",
							type: "tel",
							autoComplete: "tel",
							inputMode: "tel",
							pattern: "[+0-9() -]{8,18}",
							title: "Enter a valid phone number",
							required: true,
							placeholder: "Mobile number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "global-enquiry-email",
							children: ["Email address ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "(optional)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "global-enquiry-email",
							name: "email",
							type: "email",
							autoComplete: "email",
							placeholder: "Email address"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "global-enquiry-service",
							children: "Service *"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "global-enquiry-service",
							name: "service",
							required: true,
							defaultValue: servicePrefill,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								disabled: true,
								children: "Select a service"
							}), enquiryServices.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: service,
								children: service
							}, service))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "global-enquiry-message",
							children: ["Additional message ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "(optional)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "global-enquiry-message",
							name: "message",
							rows: 3,
							defaultValue: messagePrefill,
							placeholder: "Share your requirements or preferred area…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "button-gold global-enquiry-submit",
							type: "submit",
							children: ["Continue on WhatsApp ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "We don’t save enquiries on this website. WhatsApp opens with your details for you to review and send." })
					]
				})] })]
			})
		})
	] });
}
//#endregion
export { whatsappUrl as i, enquiryServices as n, openEnquiryForm as r, SiteLayout as t };
