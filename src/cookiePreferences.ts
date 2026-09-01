import { inject, provide, ref } from 'vue';
import type { InjectionKey, Ref } from 'vue';

export type CookiePreferencesState = {
    preferencesOpen: Ref<boolean>;
    openPreferences(): void;
    closePreferences(): void;
};

const cookiePreferencesKey: InjectionKey<CookiePreferencesState> =
    Symbol('cookie-preferences');

export function createCookiePreferencesState(): CookiePreferencesState {
    const preferencesOpen = ref(false);

    return {
        preferencesOpen,
        openPreferences(): void {
            preferencesOpen.value = true;
        },
        closePreferences(): void {
            preferencesOpen.value = false;
        },
    };
}

export function provideCookiePreferences(
    state: CookiePreferencesState = createCookiePreferencesState(),
): CookiePreferencesState {
    provide(cookiePreferencesKey, state);

    return state;
}

export function useCookiePreferences(): CookiePreferencesState {
    return inject(cookiePreferencesKey) ?? createCookiePreferencesState();
}
