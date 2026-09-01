import { Fragment as e, computed as t, createCommentVNode as n, createElementBlock as r, createElementVNode as i, createTextVNode as a, defineComponent as o, inject as s, normalizeStyle as c, openBlock as l, provide as u, reactive as d, ref as f, renderList as p, renderSlot as m, toDisplayString as h, unref as g, vModelCheckbox as _, watch as v, withDirectives as y } from "vue";
import { router as b, usePage as x } from "@inertiajs/vue3";
//#region src/consent.ts
function S(e, t) {
	return t?.choices[e] === !0;
}
function C(e, t, n = {}) {
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
var w = Symbol("cookie-preferences");
function T() {
	let e = f(!1);
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
function E(e = T()) {
	return u(w, e), e;
}
function D() {
	return s(w) ?? T();
}
//#endregion
//#region src/types.ts
var O = {
	background: "#ffffff",
	foreground: "#111827",
	primary: "#2563eb",
	primary_foreground: "#ffffff",
	border: "#e5e7eb",
	overlay: "#00000080"
}, k = /^#(?:(?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})$/i;
function A(e, t) {
	return typeof e == "string" && k.test(e) ? e : t;
}
function j(e) {
	return {
		background: A(e?.background, O.background),
		foreground: A(e?.foreground, O.foreground),
		primary: A(e?.primary, O.primary),
		primary_foreground: A(e?.primary_foreground, O.primary_foreground),
		border: A(e?.border, O.border),
		overlay: A(e?.overlay, O.overlay)
	};
}
//#endregion
//#region src/useCookieConsent.ts
function M(e = {}) {
	let n = x(), r = e.preferences ?? D(), i = e.bannerProp ?? "cookieBanner", a = e.consentProp ?? "cookieConsent", o = t(() => n.props[i] ?? null), s = t(() => n.props[a] ?? null), c = t(() => o.value !== null && s.value?.bannerVersionId !== o.value.id), l = d({}), u = f(!1);
	v([
		o,
		s,
		r.preferencesOpen
	], () => {
		for (let e of Object.keys(l)) delete l[e];
		for (let e of o.value?.categories ?? []) l[e.slug] = e.is_required ? !0 : s.value?.choices[e.slug] ?? !1;
	}, { immediate: !0 });
	function p() {
		let t = e.consentUrl ?? "/cookies/consent";
		return typeof t == "function" ? t() : t;
	}
	function m(t, n, i = {}) {
		let s = o.value;
		if (s === null || u.value) return;
		u.value = !0;
		let c = C(s.categories, t, i), l = {
			action: t,
			banner_version_id: s.id,
			source: n,
			...t === "customize" ? { choices: c } : {}
		}, d = {
			preserveScroll: !0,
			onStart: () => r.closePreferences(),
			onFinish: () => {
				u.value = !1;
			}
		};
		if (e.optimistic === !1) {
			b.post(p(), l, d);
			return;
		}
		b.optimistic(() => ({ [a]: {
			bannerVersionId: s.id,
			action: t,
			choices: c
		} })).post(p(), l, d);
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
var N = {
	key: 0,
	class: "lgpd-cookie-consent__bar",
	role: "dialog",
	"aria-labelledby": "lgpd-cookie-consent-title",
	"aria-describedby": "lgpd-cookie-consent-description"
}, P = { class: "lgpd-cookie-consent__bar-content" }, F = { id: "lgpd-cookie-consent-title" }, I = { id: "lgpd-cookie-consent-description" }, L = ["href"], R = { class: "lgpd-cookie-consent__actions" }, z = ["disabled"], B = ["disabled"], V = ["disabled"], H = {
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
		let s = o, u = {
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
		}, { banner: d, showBar: f, categoryChoices: v, processing: b, preferencesOpen: x, submit: S, saveCustom: C, openPreferences: w, closePreferences: T } = M({ consentUrl: s.consentUrl }), E = t(() => {
			let e = j(d.value?.colors);
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
		return (t, s) => g(d) ? (l(), r("div", {
			key: 0,
			class: "lgpd-cookie-consent",
			style: c(E.value)
		}, [g(f) ? (l(), r("section", N, [i("div", P, [m(t.$slots, "banner", {
			banner: g(d),
			processing: g(b),
			submit: g(S),
			openPreferences: g(w)
		}, () => [i("div", null, [i("h2", F, h(g(d).headline), 1), i("p", I, [a(h(g(d).body) + " ", 1), i("a", { href: o.cookiePolicyUrl }, h(u.policy), 9, L)])]), i("div", R, [
			i("button", {
				type: "button",
				disabled: g(b),
				onClick: s[0] ||= (e) => D("reject_non_essential")
			}, h(u.rejectNonEssential), 9, z),
			i("button", {
				type: "button",
				disabled: g(b),
				onClick: s[1] ||= (...e) => g(w) && g(w)(...e)
			}, h(u.manage), 9, B),
			i("button", {
				type: "button",
				disabled: g(b),
				onClick: s[2] ||= (e) => D("accept_all")
			}, h(u.acceptAll), 9, V)
		])])])])) : n("", !0), g(x) ? (l(), r("div", H, [i("div", U, [
			i("button", {
				class: "lgpd-cookie-consent__close",
				type: "button",
				"aria-label": u.close,
				onClick: s[3] ||= (...e) => g(T) && g(T)(...e)
			}, " × ", 8, W),
			i("h2", G, h(u.preferencesTitle), 1),
			i("p", null, h(u.preferencesDescription), 1),
			i("div", K, [(l(!0), r(e, null, p(g(d).categories, (e) => (l(), r("div", {
				key: e.slug,
				class: "lgpd-cookie-consent__category"
			}, [m(t.$slots, "category", {
				category: e,
				enabled: g(v)[e.slug] === !0
			}, () => [i("label", null, [y(i("input", {
				"onUpdate:modelValue": (t) => g(v)[e.slug] = t,
				type: "checkbox",
				disabled: e.is_required || g(b)
			}, null, 8, q), [[_, g(v)[e.slug]]]), i("span", null, [i("strong", null, h(e.name), 1), i("small", null, h(e.description), 1)])])])]))), 128))]),
			i("div", J, [i("button", {
				type: "button",
				disabled: g(b),
				onClick: s[4] ||= (e) => D("reject_non_essential")
			}, h(u.rejectNonEssential), 9, Y), m(t.$slots, "preferencesFooter", {
				saveCustom: g(C),
				processing: g(b)
			}, () => [i("button", {
				type: "button",
				disabled: g(b),
				onClick: s[5] ||= (...e) => g(C) && g(C)(...e)
			}, h(u.saveChoices), 9, X)])])
		])])) : n("", !0)], 4)) : n("", !0);
	}
}), Q = { class: "lgpd-cookie-catalog" }, $ = { key: 0 }, ee = {
	key: 1,
	class: "lgpd-cookie-catalog__table-wrapper"
}, te = /* @__PURE__ */ o({
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
		}, { openPreferences: a } = D();
		return (o, s) => (l(), r("section", Q, [
			i("p", null, h(t.banner.body), 1),
			(l(!0), r(e, null, p(t.banner.categories, (t) => (l(), r("article", {
				key: t.slug,
				class: "lgpd-cookie-catalog__category"
			}, [
				i("h2", null, h(t.name), 1),
				i("p", null, h(t.description), 1),
				t.definitions.length === 0 ? (l(), r("p", $, h(n.emptyCategory), 1)) : (l(), r("div", ee, [i("table", null, [s[1] ||= i("thead", null, [i("tr", null, [
					i("th", null, "Name"),
					i("th", null, "Provider"),
					i("th", null, "Duration"),
					i("th", null, "Type"),
					i("th", null, "Purpose")
				])], -1), i("tbody", null, [(l(!0), r(e, null, p(t.definitions, (e) => (l(), r("tr", { key: e.name }, [
					i("td", null, h(e.name), 1),
					i("td", null, h(e.provider), 1),
					i("td", null, h(e.duration), 1),
					i("td", null, h(e.is_first_party ? n.firstParty : n.thirdParty), 1),
					i("td", null, h(e.purpose), 1)
				]))), 128))])])]))
			]))), 128)),
			i("button", {
				type: "button",
				onClick: s[0] ||= (...e) => g(a) && g(a)(...e)
			}, "Manage cookies")
		]));
	}
});
//#endregion
export { Z as CookieConsentBanner, te as CookiePolicyCatalog, O as DEFAULT_COOKIE_BANNER_COLORS, S as allowsCookieCategory, T as createCookiePreferencesState, E as provideCookiePreferences, j as resolveCookieBannerColors, C as resolvedCookieChoices, M as useCookieConsent, D as useCookiePreferences };
