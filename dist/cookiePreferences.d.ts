import type { Ref } from 'vue';
export type CookiePreferencesState = {
    preferencesOpen: Ref<boolean>;
    openPreferences(): void;
    closePreferences(): void;
};
export declare function createCookiePreferencesState(): CookiePreferencesState;
export declare function provideCookiePreferences(state?: CookiePreferencesState): CookiePreferencesState;
export declare function useCookiePreferences(): CookiePreferencesState;
