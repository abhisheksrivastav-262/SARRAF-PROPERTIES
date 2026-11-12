import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as getSupabase } from "./supabase-BVL_Sog2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ManagedMedia-CGDyXwYL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var mumbai_residences_hero_default = "/assets/mumbai-residences-hero-D0zVteaj.jpg";
var residential_tower_default = "/assets/residential-tower-BRNijfrk.jpg";
var premium_apartment_default = "/assets/premium-apartment-D_xQsZhB.jpg";
var commercial_space_default = "/assets/commercial-space-BIhJRfaW.jpg";
var service_residential_default = "/assets/service-residential-DetwCJ1s.webp";
var service_commercial_default = "/assets/service-commercial-CiO04ZtA.webp";
var service_buying_default = "/assets/service-buying-CCFb8ag8.webp";
var service_selling_default = "/assets/service-selling-BM2t-h3o.webp";
var service_investment_default = "/assets/service-investment-CpdkzOiD.webp";
var service_consultation_default = "/assets/service-consultation-Cmae02YZ.webp";
/** A page/section slot keeps the bundled image as a fallback until an admin publishes media. */
function ManagedMediaImage({ page, section, fallback, ...props }) {
	const [media, setMedia] = (0, import_react.useState)({
		url: fallback,
		type: "image"
	});
	(0, import_react.useEffect)(() => {
		const db = getSupabase();
		if (!db) return;
		let alive = true;
		Promise.all([db.from("media_slots").select("use_managed_media").eq("page_slug", page).eq("section_key", section).maybeSingle(), db.from("media_assets").select("*").eq("page_slug", page).eq("section_key", section).order("sort_order").limit(1)]).then(([slot, media]) => {
			if (!alive) return;
			if (slot.data?.use_managed_media) setMedia(media.data?.[0] ? {
				url: media.data[0].public_url,
				type: media.data[0].media_type
			} : {
				url: "",
				type: "image"
			});
			else if (media.data?.[0]?.public_url) setMedia({
				url: media.data[0].public_url,
				type: media.data[0].media_type
			});
		}).catch(() => void 0);
		return () => {
			alive = false;
		};
	}, [
		page,
		section,
		fallback
	]);
	if (!media.url) return null;
	if (media.type === "video") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		className: props.className,
		src: media.url,
		autoPlay: true,
		muted: true,
		loop: true,
		playsInline: true,
		controls: !props.className?.includes("managed-hero-media"),
		"aria-label": typeof props.alt === "string" ? props.alt : void 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		...props,
		src: media.url
	});
}
//#endregion
export { residential_tower_default as a, service_consultation_default as c, service_selling_default as d, premium_apartment_default as i, service_investment_default as l, commercial_space_default as n, service_buying_default as o, mumbai_residences_hero_default as r, service_commercial_default as s, ManagedMediaImage as t, service_residential_default as u };
