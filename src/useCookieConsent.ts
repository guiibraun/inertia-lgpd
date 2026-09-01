import { router, usePage } from '@inertiajs/vue3';
import { computed, reactive, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { resolvedCookieChoices } from './consent';
import { useCookiePreferences } from './cookiePreferences';
import type { CookiePreferencesState } from './cookiePreferences';
import type {
    CookieBanner,
    CookieConsent,
    CookieConsentAction,
    CookieConsentSource,
} from './types';

export type CookieConsentUrl = string | (() => string);

export type UseCookieConsentOptions = {
    consentUrl?: CookieConsentUrl;
    bannerProp?: string;
    consentProp?: string;
    optimistic?: boolean;
    preferences?: CookiePreferencesState;
};

export type CookieConsentSubmit = (
    action: CookieConsentAction,
    source: CookieConsentSource,
    requested?: Record<string, boolean>,
) => void;

export function useCookieConsent(options: UseCookieConsentOptions = {}): {
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
} {
    const page = usePage();
    const preferences = options.preferences ?? useCookiePreferences();
    const bannerProp = options.bannerProp ?? 'cookieBanner';
    const consentProp = options.consentProp ?? 'cookieConsent';

    const banner = computed<CookieBanner | null>(() => {
        return (
            (page.props[bannerProp] as CookieBanner | null | undefined) ?? null
        );
    });

    const consent = computed<CookieConsent | null>(() => {
        return (
            (page.props[consentProp] as CookieConsent | null | undefined) ??
            null
        );
    });

    const showBar = computed<boolean>(() => {
        if (banner.value === null) {
            return false;
        }

        return consent.value?.bannerVersionId !== banner.value.id;
    });

    const categoryChoices = reactive<Record<string, boolean>>({});
    const processing = ref(false);

    watch(
        [banner, consent, preferences.preferencesOpen],
        () => {
            for (const slug of Object.keys(categoryChoices)) {
                delete categoryChoices[slug];
            }

            for (const category of banner.value?.categories ?? []) {
                categoryChoices[category.slug] = category.is_required
                    ? true
                    : (consent.value?.choices[category.slug] ?? false);
            }
        },
        { immediate: true },
    );

    function resolveConsentUrl(): string {
        const consentUrl = options.consentUrl ?? '/cookies/consent';

        return typeof consentUrl === 'function' ? consentUrl() : consentUrl;
    }

    function submit(
        action: CookieConsentAction,
        source: CookieConsentSource,
        requested: Record<string, boolean> = {},
    ): void {
        const published = banner.value;

        if (published === null || processing.value) {
            return;
        }

        processing.value = true;

        const choices = resolvedCookieChoices(
            published.categories,
            action,
            requested,
        );
        const payload = {
            action,
            banner_version_id: published.id,
            source,
            ...(action === 'customize' ? { choices } : {}),
        };
        const visitOptions = {
            preserveScroll: true,
            onStart: () => preferences.closePreferences(),
            onFinish: () => {
                processing.value = false;
            },
        };

        if (options.optimistic === false) {
            router.post(resolveConsentUrl(), payload, visitOptions);

            return;
        }

        router
            .optimistic(() => ({
                [consentProp]: {
                    bannerVersionId: published.id,
                    action,
                    choices,
                },
            }))
            .post(resolveConsentUrl(), payload, visitOptions);
    }

    function saveCustom(): void {
        submit('customize', 'preferences', { ...categoryChoices });
    }

    return {
        banner,
        consent,
        showBar,
        categoryChoices,
        processing,
        preferencesOpen: preferences.preferencesOpen,
        openPreferences: preferences.openPreferences,
        closePreferences: preferences.closePreferences,
        submit,
        saveCustom,
    };
}
