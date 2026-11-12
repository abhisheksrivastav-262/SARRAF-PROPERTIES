import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as getSupabase, r as isMediaAdmin } from "./supabase-BVL_Sog2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-C9MK068I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogin() {
	const navigate = useNavigate();
	const supabase = getSupabase();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		supabase?.auth.getUser().then(({ data }) => {
			if (alive && isMediaAdmin(data.user)) navigate({ to: "/admin" });
		});
		return () => {
			alive = false;
		};
	}, [navigate, supabase]);
	async function submit(event) {
		event.preventDefault();
		setError("");
		if (!supabase) {
			setError("Supabase is not configured. Follow SUPABASE_SETUP.md first.");
			return;
		}
		setBusy(true);
		const { data, error: loginError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (loginError || !isMediaAdmin(data.user)) {
			if (data.user) await supabase.auth.signOut();
			setError(loginError?.message || "This account is not authorized as a media admin.");
			setBusy(false);
			return;
		}
		setBusy(false);
		await navigate({ to: "/admin" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "media-admin-login",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "media-admin-login-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "media-admin-brand",
					children: ["SARRAF ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PROPERTIES" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "media-admin-eyebrow",
					children: "PRIVATE MEDIA MANAGEMENT"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Admin sign in" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "media-admin-muted",
					children: "Use your authorized Supabase administrator account."
				}),
				!supabase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "media-admin-notice",
					children: [
						"Backend setup is required. Configure the environment values in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: ".env" }),
						" and complete the steps in ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "SUPABASE_SETUP.md" }),
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "media-admin-form",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Email address", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							autoComplete: "username",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							autoComplete: "current-password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true
						})] }),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "media-admin-error",
							role: "alert",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "media-admin-primary",
							disabled: busy || !supabase,
							children: busy ? "Signing in…" : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					className: "media-admin-back",
					to: "/",
					children: "← Back to website"
				})
			]
		})
	});
}
//#endregion
export { AdminLogin as component };
