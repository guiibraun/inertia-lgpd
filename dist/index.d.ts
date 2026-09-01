import './style.css';
export { allowsCookieCategory, resolvedCookieChoices } from './consent';
export { createCookiePreferencesState, provideCookiePreferences, useCookiePreferences, } from './cookiePreferences';
export { default as CookieConsentBanner } from './components/CookieConsentBanner.vue';
export { default as CookiePolicyCatalog } from './components/CookiePolicyCatalog.vue';
export { useCookieConsent } from './useCookieConsent';
export type { CookieBanner, CookieCategory, CookieConsent, CookieConsentAction, CookieConsentLabels, CookieConsentPageProps, CookieConsentSource, CookieDefinition, PrivacyPolicy, } from './types';
export type { CookieConsentSubmit, CookieConsentUrl, UseCookieConsentOptions, } from './useCookieConsent';
export type { CookiePreferencesState } from './cookiePreferences';
