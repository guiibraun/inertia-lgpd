import { Fragment as e, computed as t, createCommentVNode as n, createElementBlock as r, createElementVNode as i, createTextVNode as a, defineComponent as o, inject as s, normalizeStyle as c, onMounted as l, openBlock as u, provide as d, reactive as f, ref as p, renderList as m, renderSlot as h, toDisplayString as g, unref as _, vModelCheckbox as v, watch as y, withDirectives as ee } from "vue";
import { router as b, usePage as x } from "@inertiajs/vue3";
// src/consent.ts
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
// src/cookiePreferences.ts
var w = Symbol("cookie-preferences");
function T() {
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
function E(e = T()) {
	return d(w, e), e;
}
function D() {
	return s(w) ?? T();
}
// src/types.ts
var O = {
	background: "#ffffff",
	foreground: "#111827",
	primary: "#2563eb",
	primary_foreground: "#ffffff",
	border: "#e5e7eb",
	overlay: "#00000080"
}, te = /^#(?:(?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})$/i;
function k(e, t) {
	return typeof e == "string" && te.test(e) ? e : t;
}
function A(e) {
	return {
		background: k(e?.background, O.background),
		foreground: k(e?.foreground, O.foreground),
		primary: k(e?.primary, O.primary),
		primary_foreground: k(e?.primary_foreground, O.primary_foreground),
		border: k(e?.border, O.border),
		overlay: k(e?.overlay, O.overlay)
	};
}
// src/useCookieConsent.ts
function j(e = {}) {
	let n = x(), r = e.preferences ?? D(), i = e.bannerProp ?? "cookieBanner", a = e.consentProp ?? "cookieConsent", o = t(() => n.props?.[i] ?? null), s = t(() => n.props?.[a] ?? null), c = t(() => o.value !== null && s.value?.bannerVersionId !== o.value.id), l = f({}), u = p(!1);
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
		let c = C(s.categories, t, i), l = {
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
		e.optimistic === !1 ? b.post(d(), l, f) : b.optimistic(() => ({ [a]: {
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
// src/components/CookieConsentBanner.vue?vue&type=script&setup=true&lang.ts
var ne = {
	key: 0,
	class: "lgpd-cookie-consent__bar",
	role: "dialog",
	"aria-labelledby": "lgpd-cookie-consent-title",
	"aria-describedby": "lgpd-cookie-consent-description"
}, M = { class: "lgpd-cookie-consent__bar-content" }, N = { class: "lgpd-cookie-consent__copy" }, P = { id: "lgpd-cookie-consent-title" }, F = { id: "lgpd-cookie-consent-description" }, I = ["href"], L = { class: "lgpd-cookie-consent__actions" }, R = ["disabled"], z = ["disabled"], B = ["disabled"], V = {
	key: 1,
	class: "lgpd-cookie-consent__preferences",
	role: "dialog",
	"aria-modal": "true",
	"aria-labelledby": "lgpd-cookie-preferences-title"
}, H = { class: "lgpd-cookie-consent__panel" }, U = { class: "lgpd-cookie-consent__header" }, W = { id: "lgpd-cookie-preferences-title" }, G = ["aria-label"], K = { class: "lgpd-cookie-consent__categories" }, q = { key: 0 }, re = ["onUpdate:modelValue", "disabled"], J = { class: "lgpd-cookie-consent__actions lgpd-cookie-consent__actions--footer" }, Y = ["disabled"], X = ["disabled"], ie = /* @__PURE__ */ o({
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
			close: "Fechar",
			acceptAll: "Aceitar todos",
			rejectNonEssential: "Recusar não essenciais",
			manage: "Gerenciar preferências",
			preferencesTitle: "Preferências de cookies",
			preferencesDescription: "Escolha quais categorias de cookies você permite. Os cookies necessários ficam sempre ativos.",
			saveChoices: "Salvar escolhas",
			alwaysActive: "Sempre ativos",
			policy: "Política de Cookies",
			emptyCategory: "Nenhum cookie está listado nesta categoria no momento.",
			firstParty: "Próprio",
			thirdParty: "Terceiro",
			cookieName: "Nome",
			cookieProvider: "Provedor",
			cookieDuration: "Duração",
			cookieType: "Tipo",
			cookiePurpose: "Finalidade",
			manageCookies: "Gerenciar cookies",
			...s.labels
		}, { banner: d, showBar: f, categoryChoices: p, processing: y, preferencesOpen: b, submit: x, saveCustom: S, openPreferences: C, closePreferences: w } = j({ consentUrl: s.consentUrl }), T = t(() => {
			let e = A(d.value?.colors);
			return {
				"--lgpd-cookie-background": e.background,
				"--lgpd-cookie-foreground": e.foreground,
				"--lgpd-cookie-primary": e.primary,
				"--lgpd-cookie-primary-foreground": e.primary_foreground,
				"--lgpd-cookie-border": e.border,
				"--lgpd-cookie-overlay": e.overlay
			};
		});
		function E(e) {
			x(e, b.value ? "preferences" : "banner");
		}
		return (t, s) => _(d) ? (u(), r("div", {
			key: 0,
			class: "lgpd-cookie-consent",
			style: c(T.value)
		}, [_(f) && !_(b) ? (u(), r("section", ne, [i("div", M, [h(t.$slots, "banner", {
			banner: _(d),
			processing: _(y),
			submit: _(x),
			openPreferences: _(C)
		}, () => [i("div", N, [i("h2", P, g(_(d).headline), 1), i("p", F, [a(g(_(d).body) + " ", 1), i("a", { href: o.cookiePolicyUrl }, g(l.policy), 9, I)])]), i("div", L, [
			i("button", {
				type: "button",
				class: "lgpd-cookie-button lgpd-cookie-button--ghost lgpd-cookie-consent__manage",
				disabled: _(y),
				onClick: s[0] ||= (...e) => _(C) && _(C)(...e)
			}, g(l.manage), 9, R),
			i("button", {
				type: "button",
				class: "lgpd-cookie-button lgpd-cookie-button--outline",
				disabled: _(y),
				onClick: s[1] ||= (e) => E("reject_non_essential")
			}, g(l.rejectNonEssential), 9, z),
			i("button", {
				type: "button",
				class: "lgpd-cookie-button lgpd-cookie-button--primary",
				disabled: _(y),
				onClick: s[2] ||= (e) => E("accept_all")
			}, g(l.acceptAll), 9, B)
		])])])])) : n("", !0), _(b) ? (u(), r("div", V, [i("div", H, [
			i("header", U, [
				i("h2", W, g(l.preferencesTitle), 1),
				i("p", null, g(l.preferencesDescription), 1),
				i("button", {
					class: "lgpd-cookie-consent__close",
					type: "button",
					"aria-label": l.close,
					onClick: s[3] ||= (...e) => _(w) && _(w)(...e)
				}, [...s[6] ||= [i("svg", {
					viewBox: "0 0 24 24",
					width: "18",
					height: "18",
					"aria-hidden": "true"
				}, [i("path", {
					d: "M6 6l12 12M18 6L6 18",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round"
				})], -1)]], 8, G)
			]),
			i("div", K, [(u(!0), r(e, null, m(_(d).categories, (e) => (u(), r("div", {
				key: e.slug,
				class: "lgpd-cookie-consent__category"
			}, [h(t.$slots, "category", {
				category: e,
				enabled: _(p)[e.slug] === !0
			}, () => [i("label", null, [i("span", null, [i("strong", null, [a(g(e.name) + " ", 1), e.is_required ? (u(), r("em", q, g(l.alwaysActive), 1)) : n("", !0)]), i("small", null, g(e.description), 1)]), ee(i("input", {
				"onUpdate:modelValue": (t) => _(p)[e.slug] = t,
				type: "checkbox",
				role: "switch",
				disabled: e.is_required || _(y)
			}, null, 8, re), [[v, _(p)[e.slug]]])])])]))), 128))]),
			i("div", J, [i("button", {
				type: "button",
				class: "lgpd-cookie-button lgpd-cookie-button--outline",
				disabled: _(y),
				onClick: s[4] ||= (e) => E("reject_non_essential")
			}, g(l.rejectNonEssential), 9, Y), h(t.$slots, "preferencesFooter", {
				saveCustom: _(S),
				processing: _(y)
			}, () => [i("button", {
				type: "button",
				class: "lgpd-cookie-button lgpd-cookie-button--primary",
				disabled: _(y),
				onClick: s[5] ||= (...e) => _(S) && _(S)(...e)
			}, g(l.saveChoices), 9, X)])])
		])])) : n("", !0)], 4)) : n("", !0);
	}
}), ae = { class: "lgpd-cookie-catalog__intro" }, oe = {
	key: 0,
	class: "lgpd-cookie-catalog__empty"
}, se = {
	key: 1,
	class: "lgpd-cookie-catalog__table-wrapper"
}, ce = ["data-label"], Z = ["data-label"], le = ["data-label"], ue = ["data-label"], de = ["data-label"], fe = /* @__PURE__ */ o({
	__name: "CookiePolicyCatalog",
	props: {
		banner: {},
		labels: { default: () => ({}) }
	},
	setup(n) {
		let a = n, o = {
			emptyCategory: "Nenhum cookie está listado nesta categoria no momento.",
			firstParty: "Próprio",
			thirdParty: "Terceiro",
			cookieName: "Nome",
			cookieProvider: "Provedor",
			cookieDuration: "Duração",
			cookieType: "Tipo",
			cookiePurpose: "Finalidade",
			manageCookies: "Gerenciar cookies",
			...a.labels
		}, { openPreferences: s } = D(), l = t(() => {
			let e = A(a.banner.colors);
			return {
				"--lgpd-cookie-primary": e.primary,
				"--lgpd-cookie-primary-foreground": e.primary_foreground
			};
		});
		return (t, a) => (u(), r("section", {
			class: "lgpd-cookie-catalog",
			style: c(l.value)
		}, [
			i("p", ae, g(n.banner.body), 1),
			(u(!0), r(e, null, m(n.banner.categories, (t) => (u(), r("article", {
				key: t.slug,
				class: "lgpd-cookie-catalog__category"
			}, [
				i("h2", null, g(t.name), 1),
				i("p", null, g(t.description), 1),
				t.definitions.length === 0 ? (u(), r("p", oe, g(o.emptyCategory), 1)) : (u(), r("div", se, [i("table", null, [i("thead", null, [i("tr", null, [
					i("th", null, g(o.cookieName), 1),
					i("th", null, g(o.cookieProvider), 1),
					i("th", null, g(o.cookieDuration), 1),
					i("th", null, g(o.cookieType), 1),
					i("th", null, g(o.cookiePurpose), 1)
				])]), i("tbody", null, [(u(!0), r(e, null, m(t.definitions, (e) => (u(), r("tr", { key: e.name }, [
					i("td", { "data-label": o.cookieName }, [i("code", null, g(e.name), 1)], 8, ce),
					i("td", { "data-label": o.cookieProvider }, g(e.provider), 9, Z),
					i("td", { "data-label": o.cookieDuration }, g(e.duration), 9, le),
					i("td", { "data-label": o.cookieType }, g(e.is_first_party ? o.firstParty : o.thirdParty), 9, ue),
					i("td", { "data-label": o.cookiePurpose }, g(e.purpose), 9, de)
				]))), 128))])])]))
			]))), 128)),
			i("button", {
				type: "button",
				class: "lgpd-cookie-button lgpd-cookie-button--primary",
				onClick: a[0] ||= (...e) => _(s) && _(s)(...e)
			}, g(o.manageCookies), 1)
		], 4));
	}
}), Q = "script[data-lgpd-cookie-script-id]", pe = "body_start";
function $(e = {}) {
	let n = x(), r = p(!1), i = e.bannerProp ?? "cookieBanner", a = e.consentProp ?? "cookieConsent", o = t(() => n.props?.[i] ?? null), s = t(() => n.props?.[a] ?? null), c = t(() => o.value?.scripts ?? []);
	function u(e) {
		return e.is_required || S(e.category, s.value);
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
		let t = Array.from(document.querySelectorAll(Q)).filter((e) => e.dataset.lgpdCookieScriptPosition === pe), n = Number(e.dataset.lgpdCookieScriptSortOrder ?? 0), r = Number(e.dataset.lgpdCookieScriptId ?? 0), i = t.find((e) => {
			let t = Number(e.dataset.lgpdCookieScriptSortOrder ?? 0), i = Number(e.dataset.lgpdCookieScriptId ?? 0);
			return t > n || t === n && i > r;
		});
		i ? i.before(e) : (t.at(-1)?.after(e), t.length || document.body.prepend(e));
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
// src/components/CookieScriptLoader.vue?vue&type=script&setup=true&lang.ts
var me = {
	hidden: "",
	"aria-hidden": "true",
	"data-lgpd-cookie-script-loader": ""
}, he = /* @__PURE__ */ o({
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
		}), (e, t) => (u(), r("span", me));
	}
});
export { ie as CookieConsentBanner, fe as CookiePolicyCatalog, he as CookieScriptLoader, O as DEFAULT_COOKIE_BANNER_COLORS, S as allowsCookieCategory, T as createCookiePreferencesState, E as provideCookiePreferences, A as resolveCookieBannerColors, C as resolvedCookieChoices, j as useCookieConsent, D as useCookiePreferences, $ as useCookieScripts };
