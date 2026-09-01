import { Fragment as e, computed as t, createCommentVNode as n, createElementBlock as r, createElementVNode as i, createTextVNode as a, defineComponent as o, inject as s, openBlock as c, provide as l, reactive as u, ref as d, renderList as f, renderSlot as p, toDisplayString as m, unref as h, vModelCheckbox as g, watch as _, withDirectives as v } from "vue";
import { router as y, usePage as b } from "@inertiajs/vue3";
//#region src/consent.ts
function x(e, t) {
	return t?.choices[e] === !0;
}
function S(e, t, n = {}) {
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
var C = Symbol("cookie-preferences");
function w() {
	let e = d(!1);
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
function T(e = w()) {
	return l(C, e), e;
}
function E() {
	return s(C) ?? w();
}
//#endregion
//#region src/useCookieConsent.ts
function D(e = {}) {
	let n = b(), r = e.preferences ?? E(), i = e.bannerProp ?? "cookieBanner", a = e.consentProp ?? "cookieConsent", o = t(() => n.props[i] ?? null), s = t(() => n.props[a] ?? null), c = t(() => o.value !== null && s.value?.bannerVersionId !== o.value.id), l = u({}), f = d(!1);
	_([
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
		if (s === null || f.value) return;
		f.value = !0;
		let c = S(s.categories, t, i), l = {
			action: t,
			banner_version_id: s.id,
			source: n,
			...t === "customize" ? { choices: c } : {}
		}, u = {
			preserveScroll: !0,
			onStart: () => r.closePreferences(),
			onFinish: () => {
				f.value = !1;
			}
		};
		if (e.optimistic === !1) {
			y.post(p(), l, u);
			return;
		}
		y.optimistic(() => ({ [a]: {
			bannerVersionId: s.id,
			action: t,
			choices: c
		} })).post(p(), l, u);
	}
	function h() {
		m("customize", "preferences", { ...l });
	}
	return {
		banner: o,
		consent: s,
		showBar: c,
		categoryChoices: l,
		processing: f,
		preferencesOpen: r.preferencesOpen,
		openPreferences: r.openPreferences,
		closePreferences: r.closePreferences,
		submit: m,
		saveCustom: h
	};
}
//#endregion
//#region src/components/CookieConsentBanner.vue?vue&type=script&setup=true&lang.ts
var O = {
	key: 0,
	class: "lgpd-cookie-consent"
}, k = {
	key: 0,
	class: "lgpd-cookie-consent__bar",
	role: "dialog",
	"aria-labelledby": "lgpd-cookie-consent-title",
	"aria-describedby": "lgpd-cookie-consent-description"
}, A = { class: "lgpd-cookie-consent__bar-content" }, j = { id: "lgpd-cookie-consent-title" }, M = { id: "lgpd-cookie-consent-description" }, N = ["href"], P = { class: "lgpd-cookie-consent__actions" }, F = ["disabled"], I = ["disabled"], L = ["disabled"], R = {
	key: 1,
	class: "lgpd-cookie-consent__preferences",
	role: "dialog",
	"aria-modal": "true",
	"aria-labelledby": "lgpd-cookie-preferences-title"
}, z = { class: "lgpd-cookie-consent__panel" }, B = ["aria-label"], V = { id: "lgpd-cookie-preferences-title" }, H = { class: "lgpd-cookie-consent__categories" }, U = ["onUpdate:modelValue", "disabled"], W = { class: "lgpd-cookie-consent__actions" }, G = ["disabled"], K = ["disabled"], q = /* @__PURE__ */ o({
	__name: "CookieConsentBanner",
	props: {
		consentUrl: {
			type: [String, Function],
			default: "/cookies/consent"
		},
		cookiePolicyUrl: { default: "/cookies" },
		labels: { default: () => ({}) }
	},
	setup(t) {
		let o = t, s = {
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
			...o.labels
		}, { banner: l, showBar: u, categoryChoices: d, processing: _, preferencesOpen: y, submit: b, saveCustom: x, openPreferences: S, closePreferences: C } = D({ consentUrl: o.consentUrl });
		function w(e) {
			b(e, y.value ? "preferences" : "banner");
		}
		return (o, T) => h(l) ? (c(), r("div", O, [h(u) ? (c(), r("section", k, [i("div", A, [p(o.$slots, "banner", {
			banner: h(l),
			processing: h(_),
			submit: h(b),
			openPreferences: h(S)
		}, () => [i("div", null, [i("h2", j, m(h(l).headline), 1), i("p", M, [a(m(h(l).body) + " ", 1), i("a", { href: t.cookiePolicyUrl }, m(s.policy), 9, N)])]), i("div", P, [
			i("button", {
				type: "button",
				disabled: h(_),
				onClick: T[0] ||= (e) => w("reject_non_essential")
			}, m(s.rejectNonEssential), 9, F),
			i("button", {
				type: "button",
				disabled: h(_),
				onClick: T[1] ||= (...e) => h(S) && h(S)(...e)
			}, m(s.manage), 9, I),
			i("button", {
				type: "button",
				disabled: h(_),
				onClick: T[2] ||= (e) => w("accept_all")
			}, m(s.acceptAll), 9, L)
		])])])])) : n("", !0), h(y) ? (c(), r("div", R, [i("div", z, [
			i("button", {
				class: "lgpd-cookie-consent__close",
				type: "button",
				"aria-label": s.close,
				onClick: T[3] ||= (...e) => h(C) && h(C)(...e)
			}, " × ", 8, B),
			i("h2", V, m(s.preferencesTitle), 1),
			i("p", null, m(s.preferencesDescription), 1),
			i("div", H, [(c(!0), r(e, null, f(h(l).categories, (e) => (c(), r("div", {
				key: e.slug,
				class: "lgpd-cookie-consent__category"
			}, [p(o.$slots, "category", {
				category: e,
				enabled: h(d)[e.slug] === !0
			}, () => [i("label", null, [v(i("input", {
				"onUpdate:modelValue": (t) => h(d)[e.slug] = t,
				type: "checkbox",
				disabled: e.is_required || h(_)
			}, null, 8, U), [[g, h(d)[e.slug]]]), i("span", null, [i("strong", null, m(e.name), 1), i("small", null, m(e.description), 1)])])])]))), 128))]),
			i("div", W, [i("button", {
				type: "button",
				disabled: h(_),
				onClick: T[4] ||= (e) => w("reject_non_essential")
			}, m(s.rejectNonEssential), 9, G), p(o.$slots, "preferencesFooter", {
				saveCustom: h(x),
				processing: h(_)
			}, () => [i("button", {
				type: "button",
				disabled: h(_),
				onClick: T[5] ||= (...e) => h(x) && h(x)(...e)
			}, m(s.saveChoices), 9, K)])])
		])])) : n("", !0)])) : n("", !0);
	}
}), J = { class: "lgpd-cookie-catalog" }, Y = { key: 0 }, X = {
	key: 1,
	class: "lgpd-cookie-catalog__table-wrapper"
}, Z = /* @__PURE__ */ o({
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
		}, { openPreferences: a } = E();
		return (o, s) => (c(), r("section", J, [
			i("p", null, m(t.banner.body), 1),
			(c(!0), r(e, null, f(t.banner.categories, (t) => (c(), r("article", {
				key: t.slug,
				class: "lgpd-cookie-catalog__category"
			}, [
				i("h2", null, m(t.name), 1),
				i("p", null, m(t.description), 1),
				t.definitions.length === 0 ? (c(), r("p", Y, m(n.emptyCategory), 1)) : (c(), r("div", X, [i("table", null, [s[1] ||= i("thead", null, [i("tr", null, [
					i("th", null, "Name"),
					i("th", null, "Provider"),
					i("th", null, "Duration"),
					i("th", null, "Type"),
					i("th", null, "Purpose")
				])], -1), i("tbody", null, [(c(!0), r(e, null, f(t.definitions, (e) => (c(), r("tr", { key: e.name }, [
					i("td", null, m(e.name), 1),
					i("td", null, m(e.provider), 1),
					i("td", null, m(e.duration), 1),
					i("td", null, m(e.is_first_party ? n.firstParty : n.thirdParty), 1),
					i("td", null, m(e.purpose), 1)
				]))), 128))])])]))
			]))), 128)),
			i("button", {
				type: "button",
				onClick: s[0] ||= (...e) => h(a) && h(a)(...e)
			}, "Manage cookies")
		]));
	}
});
//#endregion
export { q as CookieConsentBanner, Z as CookiePolicyCatalog, x as allowsCookieCategory, w as createCookiePreferencesState, T as provideCookiePreferences, S as resolvedCookieChoices, D as useCookieConsent, E as useCookiePreferences };
