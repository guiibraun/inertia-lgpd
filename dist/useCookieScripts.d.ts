import type { ComputedRef } from 'vue';
import type { CookieBanner, CookieConsent, CookieScript } from './types';
export type UseCookieScriptsOptions = {
    bannerProp?: string;
    consentProp?: string;
};
export type CookieScriptLoaderState = {
    banner: ComputedRef<CookieBanner | null>;
    consent: ComputedRef<CookieConsent | null>;
    scripts: ComputedRef<CookieScript[]>;
    sync(): void;
};
export declare function useCookieScripts(options?: UseCookieScriptsOptions): CookieScriptLoaderState;
