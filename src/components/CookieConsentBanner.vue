<script setup lang="ts">
import { computed } from 'vue';
import type { CookieBanner, CookieConsentLabels } from '../types';
import { resolveCookieBannerColors } from '../types';
import { useCookieConsent } from '../useCookieConsent';
import type {
    CookieConsentSubmit,
    CookieConsentUrl,
} from '../useCookieConsent';

const props = withDefaults(
    defineProps<{
        consentUrl?: CookieConsentUrl;
        cookiePolicyUrl?: string;
        labels?: Partial<CookieConsentLabels>;
    }>(),
    {
        consentUrl: '/cookies/consent',
        cookiePolicyUrl: '/cookies',
        labels: () => ({}),
    },
);

const labels: CookieConsentLabels = {
    close: 'Close',
    acceptAll: 'Accept all',
    rejectNonEssential: 'Reject non-essential',
    manage: 'Manage preferences',
    preferencesTitle: 'Cookie preferences',
    preferencesDescription:
        'Choose which cookie categories you allow. Necessary cookies are always active.',
    saveChoices: 'Save choices',
    policy: 'Cookie policy',
    emptyCategory: 'No cookies are currently listed in this category.',
    firstParty: 'First-party',
    thirdParty: 'Third-party',
    ...props.labels,
};

const {
    banner,
    showBar,
    categoryChoices,
    processing,
    preferencesOpen,
    submit,
    saveCustom,
    openPreferences,
    closePreferences,
} = useCookieConsent({ consentUrl: props.consentUrl });

const styleVariables = computed<Record<string, string>>(() => {
    const colors = resolveCookieBannerColors(banner.value?.colors);

    return {
        '--lgpd-cookie-background': colors.background,
        '--lgpd-cookie-foreground': colors.foreground,
        '--lgpd-cookie-primary': colors.primary,
        '--lgpd-cookie-primary-foreground': colors.primary_foreground,
        '--lgpd-cookie-border': colors.border,
        '--lgpd-cookie-overlay': colors.overlay,
    };
});

function submitAction(action: 'accept_all' | 'reject_non_essential'): void {
    submit(action, preferencesOpen.value ? 'preferences' : 'banner');
}

defineSlots<{
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
}>();
</script>

<template>
    <div v-if="banner" class="lgpd-cookie-consent" :style="styleVariables">
        <section
            v-if="showBar"
            class="lgpd-cookie-consent__bar"
            role="dialog"
            aria-labelledby="lgpd-cookie-consent-title"
            aria-describedby="lgpd-cookie-consent-description"
        >
            <div class="lgpd-cookie-consent__bar-content">
                <slot
                    name="banner"
                    :banner="banner"
                    :processing="processing"
                    :submit="submit"
                    :open-preferences="openPreferences"
                >
                    <div class="lgpd-cookie-consent__copy">
                        <h2 id="lgpd-cookie-consent-title">
                            {{ banner.headline }}
                        </h2>
                        <p id="lgpd-cookie-consent-description">
                            {{ banner.body }}
                            <a :href="cookiePolicyUrl">{{ labels.policy }}</a>
                        </p>
                    </div>

                    <div class="lgpd-cookie-consent__actions">
                        <button
                            type="button"
                            :disabled="processing"
                            @click="submitAction('reject_non_essential')"
                        >
                            {{ labels.rejectNonEssential }}
                        </button>
                        <button
                            type="button"
                            :disabled="processing"
                            @click="openPreferences"
                        >
                            {{ labels.manage }}
                        </button>
                        <button
                            type="button"
                            :disabled="processing"
                            @click="submitAction('accept_all')"
                        >
                            {{ labels.acceptAll }}
                        </button>
                    </div>
                </slot>
            </div>
        </section>

        <div
            v-if="preferencesOpen"
            class="lgpd-cookie-consent__preferences"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lgpd-cookie-preferences-title"
        >
            <div class="lgpd-cookie-consent__panel">
                <button
                    class="lgpd-cookie-consent__close"
                    type="button"
                    :aria-label="labels.close"
                    @click="closePreferences"
                >
                    ×
                </button>
                <h2 id="lgpd-cookie-preferences-title">
                    {{ labels.preferencesTitle }}
                </h2>
                <p>{{ labels.preferencesDescription }}</p>

                <div class="lgpd-cookie-consent__categories">
                    <div
                        v-for="category in banner.categories"
                        :key="category.slug"
                        class="lgpd-cookie-consent__category"
                    >
                        <slot
                            name="category"
                            :category="category"
                            :enabled="categoryChoices[category.slug] === true"
                        >
                            <label>
                                <input
                                    v-model="categoryChoices[category.slug]"
                                    type="checkbox"
                                    :disabled="
                                        category.is_required || processing
                                    "
                                />
                                <span>
                                    <strong>{{ category.name }}</strong>
                                    <small>{{ category.description }}</small>
                                </span>
                            </label>
                        </slot>
                    </div>
                </div>

                <div class="lgpd-cookie-consent__actions">
                    <button
                        type="button"
                        :disabled="processing"
                        @click="submitAction('reject_non_essential')"
                    >
                        {{ labels.rejectNonEssential }}
                    </button>
                    <slot
                        name="preferencesFooter"
                        :save-custom="saveCustom"
                        :processing="processing"
                    >
                        <button
                            type="button"
                            :disabled="processing"
                            @click="saveCustom"
                        >
                            {{ labels.saveChoices }}
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
