import type {
    CookieCategory,
    CookieConsent,
    CookieConsentAction,
} from './types';

export function allowsCookieCategory(
    category: string,
    consent: CookieConsent | null | undefined,
): boolean {
    return consent?.choices[category] === true;
}

export function resolvedCookieChoices(
    categories: Pick<CookieCategory, 'slug' | 'is_required'>[],
    action: CookieConsentAction,
    requested: Record<string, boolean> = {},
): Record<string, boolean> {
    return Object.fromEntries(
        categories.map((category) => {
            if (category.is_required) {
                return [category.slug, true];
            }

            const choice = {
                accept_all: true,
                reject_non_essential: false,
                customize: requested[category.slug] === true,
            }[action];

            return [category.slug, choice];
        }),
    );
}
