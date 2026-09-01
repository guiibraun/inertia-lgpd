<script setup lang="ts">
import { useCookieScripts } from '../useCookieScripts';

const props = withDefaults(
    defineProps<{
        bannerProp?: string;
        consentProp?: string;
    }>(),
    {
        bannerProp: 'cookieBanner',
        consentProp: 'cookieConsent',
    },
);

useCookieScripts({
    bannerProp: props.bannerProp,
    consentProp: props.consentProp,
});
</script>

<template>
    <span hidden aria-hidden="true" data-lgpd-cookie-script-loader></span>
</template>
