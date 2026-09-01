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

export type CookieScriptPosition = 'head' | 'body_start' | 'body_end';

export type CookieScriptSourceType = 'external' | 'inline';

export type CookieScript = {
    id: number;
    name: string;
    provider: string;
    purpose: string;
    category: string;
    is_required: boolean;
    position: CookieScriptPosition;
    source_type: CookieScriptSourceType;
    src?: string | null;
    code?: string | null;
    sort_order: number;
};

export type CookieBannerColors = {
    background: string;
    foreground: string;
    primary: string;
    primary_foreground: string;
    border: string;
    overlay: string;
};

export const DEFAULT_COOKIE_BANNER_COLORS: CookieBannerColors = {
    background: '#ffffff',
    foreground: '#111827',
    primary: '#2563eb',
    primary_foreground: '#ffffff',
    border: '#e5e7eb',
    overlay: '#00000080',
};

const HEX_COLOR_PATTERN = /^#(?:(?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})$/i;

function resolveColor(value: unknown, fallback: string): string {
    return typeof value === 'string' && HEX_COLOR_PATTERN.test(value)
        ? value
        : fallback;
}

export function resolveCookieBannerColors(
    colors: Partial<CookieBannerColors> | null | undefined,
): CookieBannerColors {
    return {
        background: resolveColor(
            colors?.background,
            DEFAULT_COOKIE_BANNER_COLORS.background,
        ),
        foreground: resolveColor(
            colors?.foreground,
            DEFAULT_COOKIE_BANNER_COLORS.foreground,
        ),
        primary: resolveColor(
            colors?.primary,
            DEFAULT_COOKIE_BANNER_COLORS.primary,
        ),
        primary_foreground: resolveColor(
            colors?.primary_foreground,
            DEFAULT_COOKIE_BANNER_COLORS.primary_foreground,
        ),
        border: resolveColor(
            colors?.border,
            DEFAULT_COOKIE_BANNER_COLORS.border,
        ),
        overlay: resolveColor(
            colors?.overlay,
            DEFAULT_COOKIE_BANNER_COLORS.overlay,
        ),
    };
}

export type CookieBanner = {
    id: number;
    headline: string;
    body: string;
    colors?: Partial<CookieBannerColors> | null;
    categories: CookieCategory[];
    scripts?: CookieScript[] | null;
};

export type CookieConsentAction =
    'accept_all' | 'reject_non_essential' | 'customize';

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
