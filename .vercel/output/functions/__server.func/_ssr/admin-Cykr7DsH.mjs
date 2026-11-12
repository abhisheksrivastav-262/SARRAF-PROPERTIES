import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as ArrowDown, S as Check, _ as Film, i as Trash2, m as ImagePlus, n as Upload, p as LogOut, s as RefreshCw, w as ArrowUp } from "../_libs/lucide-react.mjs";
import { i as mediaBucket, n as getSupabase, r as isMediaAdmin, t as MEDIA_PAGES } from "./supabase-BVL_Sog2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Cykr7DsH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var accept = "image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm";
function AdminDashboard() {
	const navigate = useNavigate();
	const supabase = getSupabase();
	const [authorized, setAuthorized] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [page, setPage] = (0, import_react.useState)("home");
	const [section, setSection] = (0, import_react.useState)("hero");
	const [assets, setAssets] = (0, import_react.useState)([]);
	const [allAssets, setAllAssets] = (0, import_react.useState)([]);
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const currentPage = MEDIA_PAGES.find((item) => item.slug === page);
	const loadAssets = (0, import_react.useCallback)(async () => {
		if (!supabase) return;
		const { data, error } = await supabase.from("media_assets").select("*").order("sort_order").order("created_at", { ascending: false });
		if (error) {
			setMessage(`Media database unavailable: ${error.message}. Complete the schema and policies in SUPABASE_SETUP.md.`);
			return;
		}
		const rows = data || [];
		setAllAssets(rows);
		setAssets(rows.filter((item) => item.page_slug === page && item.section_key === section));
	}, [
		supabase,
		page,
		section
	]);
	(0, import_react.useEffect)(() => {
		let active = true;
		if (!supabase) {
			setChecking(false);
			return;
		}
		supabase.auth.getUser().then(({ data }) => {
			if (!active) return;
			if (!isMediaAdmin(data.user)) {
				setChecking(false);
				navigate({ to: "/admin/login" });
				return;
			}
			setAuthorized(true);
			setChecking(false);
		});
		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			if (!isMediaAdmin(session?.user)) {
				setAuthorized(false);
				navigate({ to: "/admin/login" });
			}
		});
		return () => {
			active = false;
			listener.subscription.unsubscribe();
		};
	}, [navigate, supabase]);
	(0, import_react.useEffect)(() => {
		if (authorized) loadAssets();
	}, [authorized, loadAssets]);
	(0, import_react.useEffect)(() => {
		setAssets(allAssets.filter((item) => item.page_slug === page && item.section_key === section));
	}, [
		allAssets,
		page,
		section
	]);
	async function uploadFile(file, replaceId) {
		if (!supabase) return;
		const video = file.type.startsWith("video/");
		const max = (video ? 250 : 20) * 1024 * 1024;
		if (!(video ? ["video/mp4", "video/webm"].includes(file.type) : [
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/avif"
		].includes(file.type))) {
			setMessage("Choose a JPG, PNG, WEBP, AVIF, MP4, or WEBM file.");
			return;
		}
		if (file.size > max) {
			setMessage(`${video ? "Video" : "Image"} exceeds the ${video ? 250 : 20} MB limit.`);
			return;
		}
		const { data: sessionData } = await supabase.auth.getSession();
		const session = sessionData.session;
		if (!session) {
			setMessage("Your session expired. Please sign in again.");
			return;
		}
		setBusy(true);
		setProgress(0);
		setMessage("");
		const ext = file.name.split(".").pop()?.toLowerCase() || (video ? "mp4" : "jpg");
		const path = `${page}/${section}/${crypto.randomUUID()}.${ext}`;
		const encodedPath = path.split("/").map(encodeURIComponent).join("/");
		const endpoint = `https://hjyjjirfjipggskrxlbm.supabase.co/storage/v1/object/${encodeURIComponent(mediaBucket)}/${encodedPath}`;
		try {
			await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", endpoint);
				xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
				xhr.setRequestHeader("apikey", "sb_publishable_kdyTg0iZa21SfG8oxhcJEw_HdBhXsAX");
				xhr.setRequestHeader("Content-Type", file.type);
				xhr.setRequestHeader("x-upsert", "false");
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) setProgress(Math.round(event.loaded / event.total * 100));
				};
				xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(/* @__PURE__ */ new Error(`Storage upload failed (${xhr.status}): ${xhr.responseText}`));
				xhr.onerror = () => reject(/* @__PURE__ */ new Error("Network error while uploading."));
				xhr.send(file);
			});
			const { data: publicData } = supabase.storage.from(mediaBucket).getPublicUrl(path);
			const previous = replaceId ? assets.find((item) => item.id === replaceId) : void 0;
			const fields = {
				page_slug: page,
				section_key: section,
				media_type: video ? "video" : "image",
				file_path: path,
				public_url: publicData.publicUrl,
				title: previous?.title || file.name.replace(/\.[^.]+$/, ""),
				alt_text: previous?.alt_text || "",
				caption: previous?.caption || "",
				sort_order: previous?.sort_order ?? assets.length
			};
			const result = previous ? await supabase.from("media_assets").update(fields).eq("id", previous.id) : await supabase.from("media_assets").insert(fields);
			if (result.error) throw new Error(`File uploaded but metadata was not saved: ${result.error.message}`);
			const slot = await supabase.from("media_slots").upsert({
				page_slug: page,
				section_key: section,
				use_managed_media: true,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "page_slug,section_key" });
			if (slot.error) throw new Error(`Media uploaded, but the page placement could not be enabled: ${slot.error.message}`);
			if (previous?.file_path) await supabase.storage.from(mediaBucket).remove([previous.file_path]);
			setMessage(previous ? "Media replaced successfully." : "Media uploaded successfully.");
			await loadAssets();
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Upload failed.");
		} finally {
			setBusy(false);
			setProgress(0);
		}
	}
	async function saveAsset(asset, patch) {
		if (!supabase) return;
		const { error } = await supabase.from("media_assets").update(patch).eq("id", asset.id);
		if (error) {
			setMessage(error.message);
			return;
		}
		setAllAssets((rows) => rows.map((row) => row.id === asset.id ? {
			...row,
			...patch
		} : row));
		setMessage("Media details saved.");
	}
	async function removeAsset(asset) {
		if (!supabase || !window.confirm(`Remove “${asset.title || asset.file_path}” from the website?`)) return;
		setBusy(true);
		const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
		if (!error) {
			const removed = await supabase.storage.from(mediaBucket).remove([asset.file_path]);
			if (removed.error) setMessage(`Metadata removed; storage cleanup needs attention: ${removed.error.message}`);
			else setMessage("Media removed.");
			await loadAssets();
		} else setMessage(error.message);
		setBusy(false);
	}
	async function shift(asset, offset) {
		const ordered = [...assets].sort((a, b) => a.sort_order - b.sort_order);
		const other = ordered[ordered.findIndex((row) => row.id === asset.id) + offset];
		if (!other || !supabase) return;
		const { error } = await supabase.from("media_assets").update({ sort_order: other.sort_order }).eq("id", asset.id);
		if (!error) await supabase.from("media_assets").update({ sort_order: asset.sort_order }).eq("id", other.id);
		await loadAssets();
	}
	const totals = (0, import_react.useMemo)(() => ({
		images: allAssets.filter((item) => item.media_type === "image").length,
		videos: allAssets.filter((item) => item.media_type === "video").length
	}), [allAssets]);
	async function logout() {
		await supabase?.auth.signOut();
		await navigate({ to: "/admin/login" });
	}
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "media-admin-loading",
		children: "Checking administrator access…"
	});
	if (!authorized) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "media-admin-loading",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Supabase configuration is required for the protected dashboard." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/admin/login",
			children: "Go to sign in"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "media-admin",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "media-admin-sidebar",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin",
					className: "media-admin-brand",
					children: ["SARRAF ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PROPERTIES" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "media-admin-eyebrow",
					children: "MEDIA STUDIO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "media-admin-nav",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "active",
						children: "▧ \xA0 Media library"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "↗ \xA0 View website"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "media-admin-logout",
					onClick: logout,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 }), " Sign out"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "media-admin-main",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "media-admin-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "media-admin-eyebrow",
							children: "WEBSITE CONTENT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Media library" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "media-admin-muted",
							children: "Manage images and videos by page and section."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "media-admin-secondary",
						onClick: () => void loadAssets(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { size: 16 }), " Refresh"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "media-admin-stats",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Images" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: totals.images })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Videos" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: totals.videos })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "media-admin-stat-icon",
								children: "10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Website pages" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "10" })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recently uploaded" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: allAssets.slice(0, 5).length })
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "media-admin-recent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Recently uploaded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "media-admin-muted",
						children: "Latest media added to your website."
					})] }), allAssets.slice(0, 5).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: allAssets.slice(0, 5).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "media-admin-recent-type",
							children: item.media_type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { size: 15 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.title || item.file_path.split("/").at(-1) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							MEDIA_PAGES.find((entry) => entry.slug === item.page_slug)?.name || item.page_slug,
							" · ",
							item.section_key
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { children: new Date(item.created_at).toLocaleDateString() })
					] }, item.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "media-admin-empty",
						children: "No media uploaded yet."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "media-admin-library",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "media-admin-library-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Page media" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "media-admin-muted",
								children: "Choose a page and placement to manage its media."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "media-admin-selects",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Page", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: page,
									onChange: (e) => {
										const next = MEDIA_PAGES.find((item) => item.slug === e.target.value);
										setPage(next.slug);
										setSection(next.sections[0]);
									},
									children: MEDIA_PAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item.slug,
										children: item.name
									}, item.slug))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Section", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: section,
									onChange: (e) => setSection(e.target.value),
									children: currentPage.sections.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: item,
										children: item.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
									}, item))
								})] })]
							})]
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "media-admin-notice",
							role: "status",
							children: message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `media-admin-dropzone ${dragging ? "dragging" : ""}`,
							onDragOver: (event) => {
								event.preventDefault();
								setDragging(true);
							},
							onDragLeave: () => setDragging(false),
							onDrop: (event) => {
								event.preventDefault();
								setDragging(false);
								for (const file of Array.from(event.dataTransfer.files)) uploadFile(file);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Drop image or video files here" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"JPG, PNG, WEBP, AVIF up to ",
									20,
									" MB · MP4, WEBM up to ",
									250,
									" MB"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "media-admin-primary",
									disabled: busy,
									onClick: () => fileRef.current?.click(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { size: 16 }), " Browse files"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									hidden: true,
									type: "file",
									accept,
									multiple: true,
									onChange: (event) => {
										for (const file of Array.from(event.target.files || [])) uploadFile(file);
										event.currentTarget.value = "";
									}
								}),
								busy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "media-admin-progress",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: `${progress}%` } })
								})
							]
						}),
						assets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "media-admin-empty",
							children: "No uploaded media in this placement yet. Current site images remain in place until you upload and publish managed media here."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "media-admin-grid",
							children: assets.map((asset, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "media-admin-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "media-admin-preview",
										children: asset.media_type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
											src: asset.public_url,
											controls: true,
											preload: "metadata"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: asset.public_url,
											alt: asset.alt_text || asset.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "media-admin-fields",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: asset.title || "",
												onChange: (e) => setAllAssets((rows) => rows.map((row) => row.id === asset.id ? {
													...row,
													title: e.target.value
												} : row)),
												onBlur: (e) => void saveAsset(asset, { title: e.target.value })
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Alt text", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: asset.alt_text || "",
												onChange: (e) => setAllAssets((rows) => rows.map((row) => row.id === asset.id ? {
													...row,
													alt_text: e.target.value
												} : row)),
												onBlur: (e) => void saveAsset(asset, { alt_text: e.target.value })
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Caption", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												value: asset.caption || "",
												onChange: (e) => setAllAssets((rows) => rows.map((row) => row.id === asset.id ? {
													...row,
													caption: e.target.value
												} : row)),
												onBlur: (e) => void saveAsset(asset, { caption: e.target.value })
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "media-admin-card-actions",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												title: "Move up",
												disabled: index === 0,
												onClick: () => void shift(asset, -1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { size: 16 })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												title: "Move down",
												disabled: index === assets.length - 1,
												onClick: () => void shift(asset, 1),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { size: 16 })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "media-admin-replace",
												children: ["Replace", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept,
													hidden: true,
													onChange: (e) => {
														const file = e.target.files?.[0];
														if (file) uploadFile(file, asset.id);
														e.currentTarget.value = "";
													}
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "danger",
												title: "Remove media",
												onClick: () => void removeAsset(asset),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 16 })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "media-admin-saved",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 13 })
											})
										]
									})
								]
							}, asset.id))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "media-admin-footnote",
					children: "Storage and publishing are protected by Supabase Row Level Security. Public pages use the existing site media until managed media integration is configured."
				})
			]
		})]
	});
}
//#endregion
export { AdminDashboard as component };
