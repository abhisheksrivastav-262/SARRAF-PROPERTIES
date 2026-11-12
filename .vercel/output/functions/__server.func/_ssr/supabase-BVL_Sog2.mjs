import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-BVL_Sog2.js
var client;
function getSupabase() {
	if (client !== void 0) return client;
	const url = "https://hjyjjirfjipggskrxlbm.supabase.co".trim();
	const key = "sb_publishable_kdyTg0iZa21SfG8oxhcJEw_HdBhXsAX".trim();
	client = createClient(url, key, { auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true
	} });
	return client;
}
function isMediaAdmin(user) {
	const app = user?.app_metadata;
	return app?.role === "admin" || app?.roles?.includes("admin") === true;
}
var mediaBucket = "site-media";
var MEDIA_PAGES = [
	{
		slug: "home",
		name: "Home",
		sections: [
			"hero",
			"about",
			"gallery-1",
			"gallery-2",
			"gallery-3",
			"service-1",
			"service-2",
			"service-3",
			"service-4",
			"service-5",
			"service-6",
			"featured-1",
			"featured-2",
			"featured-3",
			"featured-4"
		]
	},
	{
		slug: "about",
		name: "About Us",
		sections: [
			"hero",
			"intro",
			"gallery-1",
			"gallery-2",
			"gallery-3"
		]
	},
	{
		slug: "residential-properties",
		name: "Residential Properties",
		sections: [
			"hero",
			"intro",
			"gallery-1",
			"gallery-2",
			"gallery-3"
		]
	},
	{
		slug: "commercial-properties",
		name: "Commercial Properties",
		sections: [
			"hero",
			"intro",
			"gallery-1",
			"gallery-2",
			"gallery-3"
		]
	},
	{
		slug: "buy-property",
		name: "Buy Property",
		sections: [
			"hero",
			"intro",
			"gallery-1",
			"gallery-2",
			"gallery-3"
		]
	},
	{
		slug: "sell-property",
		name: "Sell Property",
		sections: [
			"hero",
			"intro",
			"gallery-1",
			"gallery-2",
			"gallery-3"
		]
	},
	{
		slug: "services",
		name: "Services",
		sections: [
			"hero",
			"service-1",
			"service-2",
			"service-3",
			"service-4",
			"service-5",
			"service-6"
		]
	},
	{
		slug: "locations",
		name: "Locations",
		sections: [
			"hero",
			"goregaon",
			"malad",
			"gallery-1",
			"gallery-2",
			"gallery-3"
		]
	},
	{
		slug: "gallery",
		name: "Gallery",
		sections: [
			"hero",
			"gallery-1",
			"gallery-2",
			"gallery-3",
			"gallery-4"
		]
	},
	{
		slug: "contact",
		name: "Contact Us",
		sections: ["hero", "intro"]
	}
];
//#endregion
export { mediaBucket as i, getSupabase as n, isMediaAdmin as r, MEDIA_PAGES as t };
