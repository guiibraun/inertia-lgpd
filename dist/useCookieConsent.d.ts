import type { ComputedRef, Ref } from 'vue';
import type { CookiePreferencesState } from './cookiePreferences';
import type { CookieBanner, CookieConsent, CookieConsentAction, CookieConsentSource } from './types';
export type CookieConsentUrl = string | (() => string);
export type UseCookieConsentOptions = {
    consentUrl?: CookieConsentUrl;
    bannerProp?: string;
    consentProp?: string;
    optimistic?: boolean;
    preferences?: CookiePreferencesState;
};
export type CookieConsentSubmit = (action: CookieConsentAction, source: CookieConsentSource, requested?: Record<string, boolean>) => void;
export declare function useCookieConsent(options?: UseCookieConsentOptions): {
    banner: ComputedRef<CookieBanner | null>;
    consent: ComputedRef<CookieConsent | null>;
    showBar: ComputedRef<boolean>;
    categoryChoices: Record<string, boolean>;
    processing: Ref<boolean>;
    preferencesOpen: CookiePreferencesState['preferencesOpen'];
    openPreferences: CookiePreferencesState['openPreferences'];
    closePreferences: CookiePreferencesState['closePreferences'];
    submit: CookieConsentSubmit;
    saveCustom(): void;
};
