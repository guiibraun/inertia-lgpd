import type { CookieCategory, CookieConsent, CookieConsentAction } from './types';
export declare function allowsCookieCategory(category: string, consent: CookieConsent | null | undefined): boolean;
export declare function resolvedCookieChoices(categories: Pick<CookieCategory, 'slug' | 'is_required'>[], action: CookieConsentAction, requested?: Record<string, boolean>): Record<string, boolean>;
