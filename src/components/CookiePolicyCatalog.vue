<script setup lang="ts">
import { useCookiePreferences } from '../cookiePreferences';
import type { CookieBanner, CookieConsentLabels } from '../types';

const props = withDefaults(
    defineProps<{
        banner: CookieBanner;
        labels?: Partial<
            Pick<
                CookieConsentLabels,
                'emptyCategory' | 'firstParty' | 'thirdParty'
            >
        >;
    }>(),
    {
        labels: () => ({}),
    },
);

const labels = {
    emptyCategory: 'No cookies are currently listed in this category.',
    firstParty: 'First-party',
    thirdParty: 'Third-party',
    ...props.labels,
};

const { openPreferences } = useCookiePreferences();
</script>

<template>
    <section class="lgpd-cookie-catalog">
        <p>{{ banner.body }}</p>

        <article
            v-for="category in banner.categories"
            :key="category.slug"
            class="lgpd-cookie-catalog__category"
        >
            <h2>{{ category.name }}</h2>
            <p>{{ category.description }}</p>

            <p v-if="category.definitions.length === 0">
                {{ labels.emptyCategory }}
            </p>
            <div v-else class="lgpd-cookie-catalog__table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Provider</th>
                            <th>Duration</th>
                            <th>Type</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="definition in category.definitions"
                            :key="definition.name"
                        >
                            <td>{{ definition.name }}</td>
                            <td>{{ definition.provider }}</td>
                            <td>{{ definition.duration }}</td>
                            <td>
                                {{
                                    definition.is_first_party
                                        ? labels.firstParty
                                        : labels.thirdParty
                                }}
                            </td>
                            <td>{{ definition.purpose }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </article>

        <button type="button" @click="openPreferences">Manage cookies</button>
    </section>
</template>
