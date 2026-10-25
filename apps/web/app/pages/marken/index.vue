<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer class="px-4 pb-10">
      <h1 class="typography-headline-3 @md:typography-headline-2 font-bold mb-2">Unsere Marken</h1>
      <p class="typography-text-sm text-neutral-600 max-w-3xl mb-6">
        Mode und Accessoires von {{ ARIZONA_BRANDS.length }} Marken – von Jack &amp; Jones, Only und Vero Moda bis zu
        Mavi und Tom Tailor. Versand mit DHL für 4,90 €, 60 Tage kostenlose Rückgabe.
      </p>
      <ul class="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-3" data-testid="brand-list">
        <li v-for="brand in sortedBrands" :key="brand.slug">
          <NuxtLink
            :to="localePath(`/marken/${brand.slug}`)"
            class="flex h-full items-center justify-center rounded-lg bg-[#F3F3F3] px-4 py-6 text-center font-semibold hover:bg-neutral-200"
          >
            {{ brand.name }}
          </NuxtLink>
        </li>
      </ul>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

// Arizona: overview of all brand pages (/marken/<marke>).
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  layout: false,
  pageType: 'static',
});

const localePath = useLocalizedPath();
const runtimeConfig = useRuntimeConfig();

const sortedBrands = [...ARIZONA_BRANDS].sort((a, b) => a.name.replace(/^!/, '').localeCompare(b.name.replace(/^!/, ''), 'de'));

const breadcrumbs = [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Marken', link: localePath('/marken') },
];

useArizonaStaticPageHead(
  'Unsere Marken',
  'Alle Marken bei Arizona Shopping: Jack & Jones, Only, Vero Moda, Vila, Name It, Mavi, Tom Tailor und mehr – mit DHL-Versand für 4,90 € und 60 Tagen kostenloser Rückgabe.',
);
useHead({ link: [{ rel: 'canonical', href: `${runtimeConfig.public.domain}${localePath('/marken')}` }] });
</script>
