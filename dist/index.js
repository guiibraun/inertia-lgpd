import { Fragment as e, computed as t, createCommentVNode as n, createElementBlock as r, createElementVNode as i, createTextVNode as a, defineComponent as o, inject as s, normalizeStyle as c, onMounted as l, openBlock as u, provide as d, reactive as f, ref as p, renderList as m, renderSlot as h, toDisplayString as g, unref as _, vModelCheckbox as v, watch as y, withDirectives as b } from "vue";
import { router as x, usePage as S } from "@inertiajs/vue3";
//#region src/consent.ts
function C(e, t) {
	return t?.choices[e] === !0;
}
function w(e, t, n = {}) {
	return Object.fromEntries(e.map((e) => {
		if (e.is_required) return [e.slug, !0];
		let r = {
			accept_all: !0,
			reject_non_essential: !1,
			customize: n[e.slug] === !0
		}[t];
		return [e.slug, r];
	}));
}
//#endregion
//#region src/cookiePreferences.ts
var T = Symbol("cookie-preferences");
function E() {
	let e = p(!1);
	return {
		preferencesOpen: e,
		openPreferences() {
			e.value = !0;
		},
		closePreferences() {
			e.value = !1;
		}
	};
}
function D(e = E()) {
	return d(T, e), e;
}
function O() {
	return s(T) ?? E();
}
//#endregion
//#region src/types.ts
var k = {
	background: "#ffffff",
	foreground: "#111827",
	primary: "#2563eb",
	primary_foreground: "#ffffff",
	border: "#e5e7eb",
	overlay: "#00000080"
}, A = /^#(?:(?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})$/i;
function j(e, t) {
	return typeof e == "string" && A.test(e) ? e : t;
}
function M(e) {
	return {
		background: j(e?.background, k.background),
		foreground: j(e?.foreground, k.foreground),
		primary: j(e?.primary, k.primary),
		primary_foreground: j(e?.primary_foreground, k.primary_foreground),
		border: j(e?.border, k.border),
		overlay: j(e?.overlay, k.overlay)
	};
}
//#endregion
//#region src/useCookieConsent.ts
function N(e = {}) {
	let n = S(), r = e.preferences ?? O(), i = e.bannerProp ?? "cookieBanner", a = e.consentProp ?? "cookieConsent", o = t(() => n.props[i] ?? null), s = t(() => n.props[a] ?? null), c = t(() => o.value !== null && s.value?.bannerVersionId !== o.value.id), l = f({}), u = p(!1);
	y([
		o,
		s,
		r.preferencesOpen
	], () => {
		for (let e of Object.keys(l)) delete l[e];
		for (let e of o.value?.categories ?? []) l[e.slug] = e.is_required ? !0 : s.value?.choices[e.slug] ?? !1;
	}, { immediate: !0 });
	function d() {
		let t = e.consentUrl ?? "/cookies/consent";
		return typeof t == "function" ? t() : t;
	}
	function m(t, n, i = {}) {
		let s = o.value;
		if (s === null || u.value) return;
		u.value = !0;
		let c = w(s.categories, t, i), l = {
			action: t,
			banner_version_id: s.id,
			source: n,
			...t === "customize" ? { choices: c } : {}
		}, f = {
			preserveScroll: !0,
			onStart: () => r.closePreferences(),
			onFinish: () => {
				u.value = !1;
			}
		};
		if (e.optimistic === !1) {
			x.post(d(), l, f);
			return;
		}
		x.optimistic(() => ({ [a]: {
			bannerVersionId: s.id,
			action: t,
			choices: c
		} })).post(d(), l, f);
	}
	function h() {
		m("customize", "preferences", { ...l });
	}
	return {
		banner: o,
		consent: s,
		showBar: c,
		categoryChoices: l,
		processing: u,
		preferencesOpen: r.preferencesOpen,
		openPreferences: r.openPreferences,
		closePreferences: r.closePreferences,
		submit: m,
		saveCustom: h
	};
}
//#endregion
//#region src/components/CookieConsentBanner.vue?vue&type=script&setup=true&lang.ts
var ee = {
	key: 0,
	class: "lgpd-cookie-consent__bar",
	role: "dialog",
	"aria-labelledby": "lgpd-cookie-consent-title",
	"aria-describedby": "lgpd-cookie-consent-description"
}, te = { class: "lgpd-cookie-consent__bar-content" }, P = { class: "lgpd-cookie-consent__copy" }, F = { id: "lgpd-cookie-consent-title" }, I = { id: "lgpd-cookie-consent-description" }, L = ["href"], R = { class: "lgpd-cookie-consent__actions" }, z = ["disabled"], B = ["disabled"], V = ["disabled"], H = {
	key: 1,
	class: "lgpd-cookie-consent__preferences",
	role: "dialog",
	"aria-modal": "true",
	"aria-labelledby": "lgpd-cookie-preferences-title"
}, U = { class: "lgpd-cookie-consent__panel" }, W = ["aria-label"], G = { id: "lgpd-cookie-preferences-title" }, K = { class: "lgpd-cookie-consent__categories" }, q = ["onUpdate:modelValue", "disabled"], J = { class: "lgpd-cookie-consent__actions" }, Y = ["disabled"], X = ["disabled"], Z = /* @__PURE__ */ o({
	__name: "CookieConsentBanner",
	props: {
		consentUrl: {
			type: [String, Function],
			default: "/cookies/consent"
		},
		cookiePolicyUrl: { default: "/cookies" },
		labels: { default: () => ({}) }
	},
	setup(o) {
		let s = o, l = {
			close: "Close",
			acceptAll: "Accept all",
			rejectNonEssential: "Reject non-essential",
			manage: "Manage preferences",
			preferencesTitle: "Cookie preferences",
			preferencesDescription: "Choose which cookie categories you allow. Necessary cookies are always active.",
			saveChoices: "Save choices",
			policy: "Cookie policy",
			emptyCategory: "No cookies are currently listed in this category.",
			firstParty: "First-party",
			thirdParty: "Third-party",
			...s.labels
		}, { banner: d, showBar: f, categoryChoices: p, processing: y, preferencesOpen: x, submit: S, saveCustom: C, openPreferences: w, closePreferences: T } = N({ consentUrl: s.consentUrl }), E = t(() => {
			let e = M(d.value?.colors);
			return {
				"--lgpd-cookie-background": e.background,
				"--lgpd-cookie-foreground": e.foreground,
				"--lgpd-cookie-primary": e.primary,
				"--lgpd-cookie-primary-foreground": e.primary_foreground,
				"--lgpd-cookie-border": e.border,
				"--lgpd-cookie-overlay": e.overlay
			};
		});
		function D(e) {
			S(e, x.value ? "preferences" : "banner");
		}
		return (t, s) => _(d) ? (u(), r("div", {
			key: 0,
			class: "lgpd-cookie-consent",
			style: c(E.value)
		}, [_(f) ? (u(), r("section", ee, [i("div", te, [h(t.$slots, "banner", {
			banner: _(d),
			processing: _(y),
			submit: _(S),
			openPreferences: _(w)
		}, () => [i("div", P, [i("h2", F, g(_(d).headline), 1), i("p", I, [a(g(_(d).body) + " ", 1), i("a", { href: o.cookiePolicyUrl }, g(l.policy), 9, L)])]), i("div", R, [
			i("button", {
				type: "button",
				disabled: _(y),
				onClick: s[0] ||= (e) => D("reject_non_essential")
			}, g(l.rejectNonEssential), 9, z),
			i("button", {
				type: "button",
				disabled: _(y),
				onClick: s[1] ||= (...e) => _(w) && _(w)(...e)
			}, g(l.manage), 9, B),
			i("button", {
				type: "button",
				disabled: _(y),
				onClick: s[2] ||= (e) => D("accept_all")
			}, g(l.acceptAll), 9, V)
		])])])])) : n("", !0), _(x) ? (u(), r("div", H, [i("div", U, [
			i("button", {
				class: "lgpd-cookie-consent__close",
				type: "button",
				"aria-label": l.close,
				onClick: s[3] ||= (...e) => _(T) && _(T)(...e)
			}, " × ", 8, W),
			i("h2", G, g(l.preferencesTitle), 1),
			i("p", null, g(l.preferencesDescription), 1),
			i("div", K, [(u(!0), r(e, null, m(_(d).categories, (e) => (u(), r("div", {
				key: e.slug,
				class: "lgpd-cookie-consent__category"
			}, [h(t.$slots, "category", {
				category: e,
				enabled: _(p)[e.slug] === !0
			}, () => [i("label", null, [b(i("input", {
				"onUpdate:modelValue": (t) => _(p)[e.slug] = t,
				type: "checkbox",
				disabled: e.is_required || _(y)
			}, null, 8, q), [[v, _(p)[e.slug]]]), i("span", null, [i("strong", null, g(e.name), 1), i("small", null, g(e.description), 1)])])])]))), 128))]),
			i("div", J, [i("button", {
				type: "button",
				disabled: _(y),
				onClick: s[4] ||= (e) => D("reject_non_essential")
			}, g(l.rejectNonEssential), 9, Y), h(t.$slots, "preferencesFooter", {
				saveCustom: _(C),
				processing: _(y)
			}, () => [i("button", {
				type: "button",
				disabled: _(y),
				onClick: s[5] ||= (...e) => _(C) && _(C)(...e)
			}, g(l.saveChoices), 9, X)])])
		])])) : n("", !0)], 4)) : n("", !0);
	}
}), ne = { class: "lgpd-cookie-catalog" }, re = { key: 0 }, ie = {
	key: 1,
	class: "lgpd-cookie-catalog__table-wrapper"
}, ae = /* @__PURE__ */ o({
	__name: "CookiePolicyCatalog",
	props: {
		banner: {},
		labels: { default: () => ({}) }
	},
	setup(t) {
		let n = {
			emptyCategory: "No cookies are currently listed in this category.",
			firstParty: "First-party",
			thirdParty: "Third-party",
			...t.labels
		}, { openPreferences: a } = O();
		return (o, s) => (u(), r("section", ne, [
			i("p", null, g(t.banner.body), 1),
			(u(!0), r(e, null, m(t.banner.categories, (t) => (u(), r("article", {
				key: t.slug,
				class: "lgpd-cookie-catalog__category"
			}, [
				i("h2", null, g(t.name), 1),
				i("p", null, g(t.description), 1),
				t.definitions.length === 0 ? (u(), r("p", re, g(n.emptyCategory), 1)) : (u(), r("div", ie, [i("table", null, [s[1] ||= i("thead", null, [i("tr", null, [
					i("th", null, "Name"),
					i("th", null, "Provider"),
					i("th", null, "Duration"),
					i("th", null, "Type"),
					i("th", null, "Purpose")
				])], -1), i("tbody", null, [(u(!0), r(e, null, m(t.definitions, (e) => (u(), r("tr", { key: e.name }, [
					i("td", null, g(e.name), 1),
					i("td", null, g(e.provider), 1),
					i("td", null, g(e.duration), 1),
					i("td", null, g(e.is_first_party ? n.firstParty : n.thirdParty), 1),
					i("td", null, g(e.purpose), 1)
				]))), 128))])])]))
			]))), 128)),
			i("button", {
				type: "button",
				onClick: s[0] ||= (...e) => _(a) && _(a)(...e)
			}, "Manage cookies")
		]));
	}
}), Q = "script[data-lgpd-cookie-script-id]", oe = "body_start";
function $(e = {}) {
	let n = S(), r = p(!1), i = e.bannerProp ?? "cookieBanner", a = e.consentProp ?? "cookieConsent", o = t(() => n.props[i] ?? null), s = t(() => n.props[a] ?? null), c = t(() => o.value?.scripts ?? []);
	function u(e) {
		return e.is_required || C(e.category, s.value);
	}
	function d(e) {
		return `${o.value?.id ?? "unknown"}:${e.id}`;
	}
	function f(e) {
		return Array.from(document.querySelectorAll(Q)).find((t) => t.dataset.lgpdCookieScriptId === String(e));
	}
	function m(e) {
		for (let t of document.querySelectorAll(Q)) {
			let n = Number(t.dataset.lgpdCookieScriptId);
			e.has(n) || t.remove();
		}
	}
	function h(e) {
		if (e.source_type === "external" && (!e.src || !/^https?:\/\//i.test(e.src)) || e.source_type === "inline" && !e.code) return;
		let t = document.createElement("script");
		switch (t.dataset.lgpdCookieScriptId = String(e.id), t.dataset.lgpdCookieScriptVersion = d(e), t.dataset.lgpdCookieScriptPosition = e.position, t.dataset.lgpdCookieScriptSortOrder = String(e.sort_order), e.source_type === "external" ? (t.src = e.src, t.async = !0) : t.textContent = e.code, e.position) {
			case "head":
				document.head.append(t);
				break;
			case "body_start":
				g(t);
				break;
			case "body_end": document.body.append(t);
		}
	}
	function g(e) {
		let t = Array.from(document.querySelectorAll(Q)).filter((e) => e.dataset.lgpdCookieScriptPosition === oe), n = Number(e.dataset.lgpdCookieScriptSortOrder ?? 0), r = Number(e.dataset.lgpdCookieScriptId ?? 0), i = t.find((e) => {
			let t = Number(e.dataset.lgpdCookieScriptSortOrder ?? 0), i = Number(e.dataset.lgpdCookieScriptId ?? 0);
			return t > n || t === n && i > r;
		});
		if (i) {
			i.before(e);
			return;
		}
		t.at(-1)?.after(e), t.length || document.body.prepend(e);
	}
	function _(e) {
		for (let t of e) {
			let e = f(t.id), n = d(t);
			e?.dataset.lgpdCookieScriptVersion !== n && (e?.remove(), h(t));
		}
	}
	function v() {
		if (!r.value || typeof document > "u") return;
		let e = c.value.filter(u);
		m(new Set(e.map((e) => e.id))), _(e);
	}
	return y([c, s], v, { deep: !0 }), l(() => {
		r.value = !0, v();
	}), {
		banner: o,
		consent: s,
		scripts: c,
		sync: v
	};
}
//#endregion
//#region src/components/CookieScriptLoader.vue?vue&type=script&setup=true&lang.ts
var se = {
	hidden: "",
	"aria-hidden": "true",
	"data-lgpd-cookie-script-loader": ""
}, ce = /* @__PURE__ */ o({
	__name: "CookieScriptLoader",
	props: {
		bannerProp: { default: "cookieBanner" },
		consentProp: { default: "cookieConsent" }
	},
	setup(e) {
		let t = e;
		return $({
			bannerProp: t.bannerProp,
			consentProp: t.consentProp
		}), (e, t) => (u(), r("span", se));
	}
});
//#endregion
export { Z as CookieConsentBanner, ae as CookiePolicyCatalog, ce as CookieScriptLoader, k as DEFAULT_COOKIE_BANNER_COLORS, C as allowsCookieCategory, E as createCookiePreferencesState, D as provideCookiePreferences, M as resolveCookieBannerColors, w as resolvedCookieChoices, N as useCookieConsent, O as useCookiePreferences, $ as useCookieScripts };
