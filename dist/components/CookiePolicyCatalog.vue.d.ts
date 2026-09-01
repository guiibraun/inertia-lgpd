import type { CookieBanner, CookieConsentLabels } from '../types';
type __VLS_Props = {
    banner: CookieBanner;
    labels?: Partial<Pick<CookieConsentLabels, 'emptyCategory' | 'firstParty' | 'thirdParty'>>;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    labels: Partial<Pick<CookieConsentLabels, "emptyCategory" | "firstParty" | "thirdParty">>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
