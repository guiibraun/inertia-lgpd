export type CookieDefinition = {
    name: string;
    provider: string;
    duration: string;
    purpose: string;
    is_first_party: boolean;
};
export type CookieCategory = {
    slug: string;
    name: string;
    description: string;
    is_required: boolean;
    definitions: CookieDefinition[];
};
export type CookieBannerColors = {
    background: string;
    foreground: string;
    primary: string;
    primary_foreground: string;
    border: string;
    overlay: string;
};
export declare const DEFAULT_COOKIE_BANNER_COLORS: CookieBannerColors;
export declare function resolveCookieBannerColors(colors: Partial<CookieBannerColors> | null | undefined): CookieBannerColors;
export type CookieBanner = {
    id: number;
    headline: string;
    body: string;
    colors?: Partial<CookieBannerColors> | null;
    categories: CookieCategory[];
};
export type CookieConsentAction = 'accept_all' | 'reject_non_essential' | 'customize';
export type CookieConsentSource = 'banner' | 'preferences';
export type CookieConsent = {
    bannerVersionId: number;
    action: CookieConsentAction;
    choices: Record<string, boolean>;
};
export type PrivacyPolicy = {
    body: string;
};
export type CookieConsentPageProps = {
    cookieBanner: CookieBanner | null;
    cookieConsent: CookieConsent | null;
};
export type CookieConsentLabels = {
    close: string;
    acceptAll: string;
    rejectNonEssential: string;
    manage: string;
    preferencesTitle: string;
    preferencesDescription: string;
    saveChoices: string;
    policy: string;
    emptyCategory: string;
    firstParty: string;
    thirdParty: string;
};
