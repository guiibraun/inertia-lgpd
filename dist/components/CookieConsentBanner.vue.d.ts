import type { CookieBanner, CookieConsentLabels } from '../types';
import type { CookieConsentSubmit, CookieConsentUrl } from '../useCookieConsent';
type __VLS_Props = {
    consentUrl?: CookieConsentUrl;
    cookiePolicyUrl?: string;
    labels?: Partial<CookieConsentLabels>;
};
type __VLS_Slots = {
    banner?(props: {
        banner: CookieBanner;
        processing: boolean;
        submit: CookieConsentSubmit;
        openPreferences(): void;
    }): unknown;
    category?(props: {
        category: CookieBanner['categories'][number];
        enabled: boolean;
    }): unknown;
    preferencesFooter?(props: {
        saveCustom(): void;
        processing: boolean;
    }): unknown;
};
declare const __VLS_component: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    consentUrl: CookieConsentUrl;
    cookiePolicyUrl: string;
    labels: Partial<CookieConsentLabels>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
