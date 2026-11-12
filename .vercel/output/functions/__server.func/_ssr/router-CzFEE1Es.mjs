import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as SiteLayout } from "./SiteLayout-Dq-Wo0wx.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CzFEE1Es.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BMF20NEW.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Sarraf Properties | Mumbai Real Estate" },
			{
				name: "description",
				content: "Trusted property guidance in Goregaon and Malad, Mumbai."
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Sarraf Properties | Mumbai Real Estate"
			},
			{
				property: "og:description",
				content: "Trusted property guidance in Goregaon and Malad, Mumbai."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: pathname.startsWith("/admin") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$11 = () => import("./routes-CM7LBAy_.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Sarraf Properties | Real Estate in Goregaon & Malad, Mumbai" },
		{
			name: "description",
			content: "Find your next home or commercial space with Sarraf Properties, your trusted real estate partner in Goregaon and Malad, Mumbai."
		},
		{
			property: "og:title",
			content: "Sarraf Properties | Mumbai Real Estate"
		},
		{
			property: "og:description",
			content: "Trusted property guidance across Goregaon and Malad, Mumbai."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./about-S_tRQlyN.mjs");
var Route$10 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "About Sarraf Properties | Mumbai Real Estate" }, {
		name: "description",
		content: "Meet Sarraf Properties, your trusted local real estate partner in Goregaon and Malad, Mumbai."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin-Cykr7DsH.mjs");
var Route$9 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./buy-property-Bya_YsBK.mjs");
var Route$8 = createFileRoute("/buy-property")({
	head: () => ({ meta: [{ title: "Buy Property | Sarraf Properties" }, {
		name: "description",
		content: "Get personal guidance buying a property in Goregaon, Malad and Mumbai's western suburbs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./commercial-properties-BoLNwYjJ.mjs");
var Route$7 = createFileRoute("/commercial-properties")({
	head: () => ({ meta: [{ title: "Commercial Properties | Sarraf Properties" }, {
		name: "description",
		content: "Discuss office, retail and commercial property options in Goregaon and Malad, Mumbai."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./contact-PYeGYfhs.mjs");
var Route$6 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact Sarraf Properties | Mumbai" }, {
		name: "description",
		content: "Contact Rajan Sarraf at Sarraf Properties by phone, WhatsApp, email or visit the Malad West office."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./gallery-BSdruT5w.mjs");
var Route$5 = createFileRoute("/gallery")({
	head: () => ({ meta: [{ title: "Property Gallery | Sarraf Properties" }, {
		name: "description",
		content: "Browse a visual gallery of residential, commercial and interior property styles in Mumbai."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./locations-Kr_M9pjr.mjs");
var Route$4 = createFileRoute("/locations")({
	head: () => ({ meta: [{ title: "Locations in Goregaon & Malad | Sarraf Properties" }, {
		name: "description",
		content: "Explore Sarraf Properties service locations in Goregaon and Malad, Mumbai. Find our Malad West office."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./residential-properties-B_msbKM5.mjs");
var Route$3 = createFileRoute("/residential-properties")({
	head: () => ({ meta: [{ title: "Residential Properties | Sarraf Properties" }, {
		name: "description",
		content: "Explore residential property possibilities in Goregaon and Malad, Mumbai with Sarraf Properties."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./sell-property-Be1Klsrf.mjs");
var Route$2 = createFileRoute("/sell-property")({
	head: () => ({ meta: [{ title: "Sell Property | Sarraf Properties" }, {
		name: "description",
		content: "Speak with Sarraf Properties about selling a residential or commercial property in Mumbai."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./services-4Wimh8Kc.mjs");
var Route$1 = createFileRoute("/services")({
	head: () => ({ meta: [{ title: "Real Estate Services | Sarraf Properties" }, {
		name: "description",
		content: "Residential and commercial property consultation, buying assistance, selling assistance and investment guidance."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.login-C9MK068I.mjs");
var Route = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AboutRoute = Route$10.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$12
});
var AdminRoute = Route$9.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$12
});
var BuyPropertyRoute = Route$8.update({
	id: "/buy-property",
	path: "/buy-property",
	getParentRoute: () => Route$12
});
var CommercialPropertiesRoute = Route$7.update({
	id: "/commercial-properties",
	path: "/commercial-properties",
	getParentRoute: () => Route$12
});
var ContactRoute = Route$6.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$12
});
var GalleryRoute = Route$5.update({
	id: "/gallery",
	path: "/gallery",
	getParentRoute: () => Route$12
});
var LocationsRoute = Route$4.update({
	id: "/locations",
	path: "/locations",
	getParentRoute: () => Route$12
});
var ResidentialPropertiesRoute = Route$3.update({
	id: "/residential-properties",
	path: "/residential-properties",
	getParentRoute: () => Route$12
});
var SellPropertyRoute = Route$2.update({
	id: "/sell-property",
	path: "/sell-property",
	getParentRoute: () => Route$12
});
var ServicesRoute = Route$1.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$12
});
var AdminRouteChildren = { AdminLoginRoute: Route.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	BuyPropertyRoute,
	CommercialPropertiesRoute,
	ContactRoute,
	GalleryRoute,
	LocationsRoute,
	ResidentialPropertiesRoute,
	SellPropertyRoute,
	ServicesRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
