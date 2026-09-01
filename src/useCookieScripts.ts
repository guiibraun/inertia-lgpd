import { usePage } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import { allowsCookieCategory } from './consent';
import type { CookieBanner, CookieConsent, CookieScript } from './types';

const SCRIPT_SELECTOR = 'script[data-lgpd-cookie-script-id]';
const BODY_START_POSITION = 'body_start';

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

export function useCookieScripts(
    options: UseCookieScriptsOptions = {},
): CookieScriptLoaderState {
    const page = usePage();
    const mounted = ref(false);
    const bannerProp = options.bannerProp ?? 'cookieBanner';
    const consentProp = options.consentProp ?? 'cookieConsent';

    const banner = computed<CookieBanner | null>(() => {
        return (
            (page.props[bannerProp] as CookieBanner | null | undefined) ??
            null
        );
    });

    const consent = computed<CookieConsent | null>(() => {
        return (
            (page.props[consentProp] as CookieConsent | null | undefined) ??
            null
        );
    });

    const scripts = computed<CookieScript[]>(() => banner.value?.scripts ?? []);

    function isAllowed(script: CookieScript): boolean {
        return (
            script.is_required || allowsCookieCategory(script.category, consent.value)
        );
    }

    function scriptVersion(script: CookieScript): string {
        return `${banner.value?.id ?? 'unknown'}:${script.id}`;
    }

    function findScriptElement(id: number): HTMLScriptElement | undefined {
        return Array.from(
            document.querySelectorAll<HTMLScriptElement>(SCRIPT_SELECTOR),
        ).find((element) => element.dataset.lgpdCookieScriptId === String(id));
    }

    function removeDisallowedScripts(allowedIds: Set<number>): void {
        for (const element of document.querySelectorAll<HTMLScriptElement>(
            SCRIPT_SELECTOR,
        )) {
            const id = Number(element.dataset.lgpdCookieScriptId);

            if (!allowedIds.has(id)) {
                element.remove();
            }
        }
    }

    function appendScript(script: CookieScript): void {
        if (
            script.source_type === 'external' &&
            (!script.src || !/^https?:\/\//i.test(script.src))
        ) {
            return;
        }

        if (script.source_type === 'inline' && !script.code) {
            return;
        }

        const element = document.createElement('script');
        element.dataset.lgpdCookieScriptId = String(script.id);
        element.dataset.lgpdCookieScriptVersion = scriptVersion(script);
        element.dataset.lgpdCookieScriptPosition = script.position;
        element.dataset.lgpdCookieScriptSortOrder = String(script.sort_order);

        if (script.source_type === 'external') {
            element.src = script.src as string;
            element.async = true;
        } else {
            element.textContent = script.code as string;
        }

        switch (script.position) {
            case 'head':
                document.head.append(element);
                break;
            case 'body_start':
                insertAtBodyStart(element);
                break;
            case 'body_end':
                document.body.append(element);
                break;
        }
    }

    function insertAtBodyStart(element: HTMLScriptElement): void {
        const bodyStartScripts = Array.from(
            document.querySelectorAll<HTMLScriptElement>(SCRIPT_SELECTOR),
        ).filter(
            (script) =>
                script.dataset.lgpdCookieScriptPosition === BODY_START_POSITION,
        );
        const elementSortOrder = Number(
            element.dataset.lgpdCookieScriptSortOrder ?? 0,
        );
        const elementId = Number(
            element.dataset.lgpdCookieScriptId ?? 0,
        );
        const nextScript = bodyStartScripts.find((script) => {
            const sortOrder = Number(
                script.dataset.lgpdCookieScriptSortOrder ?? 0,
            );
            const scriptId = Number(
                script.dataset.lgpdCookieScriptId ?? 0,
            );

            return (
                sortOrder > elementSortOrder ||
                (sortOrder === elementSortOrder && scriptId > elementId)
            );
        });

        if (nextScript) {
            nextScript.before(element);

            return;
        }

        bodyStartScripts.at(-1)?.after(element);

        if (!bodyStartScripts.length) {
            document.body.prepend(element);
        }
    }

    function loadAllowedScripts(allowedScripts: CookieScript[]): void {
        for (const script of allowedScripts) {
            const existing = findScriptElement(script.id);
            const version = scriptVersion(script);

            if (
                existing?.dataset.lgpdCookieScriptVersion === version
            ) {
                continue;
            }

            existing?.remove();
            appendScript(script);
        }
    }

    function sync(): void {
        if (!mounted.value || typeof document === 'undefined') {
            return;
        }

        const allowedScripts = scripts.value.filter(isAllowed);
        const allowedIds = new Set(allowedScripts.map((script) => script.id));

        removeDisallowedScripts(allowedIds);
        loadAllowedScripts(allowedScripts);
    }

    watch([scripts, consent], sync, { deep: true });

    onMounted(() => {
        mounted.value = true;
        sync();
    });

    return {
        banner,
        consent,
        scripts,
        sync,
    };
}
