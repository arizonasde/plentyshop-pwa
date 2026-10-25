<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer class="px-4 pb-10">
      <div class="flex flex-wrap items-baseline gap-x-3 mb-2">
        <h1 class="typography-headline-3 @md:typography-headline-2 font-bold">{{ brand.name }}</h1>
        <span v-if="total" class="typography-text-sm text-neutral-600">{{ total }} Artikel</span>
      </div>
      <p class="typography-text-sm text-neutral-600 max-w-3xl mb-6" data-testid="brand-intro">{{ brand.intro }}</p>

      <section
        v-if="products.length"
        class="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-4 @md:gap-6 mb-8"
        data-testid="brand-grid"
      >
        <UiProductCard
          v-for="(product, index) in products"
          :key="productGetters.getVariationId(product)"
          :product="product"
          :index="index"
          :configuration="ARIZONA_CARD_CONFIGURATION"
        />
      </section>
      <p v-else class="mb-8">Zurzeit sind keine Artikel dieser Marke verfügbar.</p>

      <UiPagination
        v-if="total > PAGE_SIZE"
        :key="`${brand.slug}-${total}`"
        :current-page="currentPage"
        :total-items="total"
        :page-size="PAGE_SIZE"
        :max-visible-pages="viewport.isGreaterOrEquals('lg') ? 5 : 2"
      />

      <p class="mt-8 typography-text-sm">
        <NuxtLink :to="localePath('/marken')" class="underline underline-offset-2">Alle Marken ansehen</NuxtLink>
      </p>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';

/**
 * Arizona: landing page of one brand (e.g. /marken/only) with all its items across the shop's categories,
 * a short introduction and its own title and description for search engines.
 */
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  layout: false,
  pageType: 'static',
});

const PAGE_SIZE = 48;

const route = useRoute();
const viewport = useViewport();
const localePath = useLocalizedPath();
const runtimeConfig = useRuntimeConfig();
const { setItemListMetaData } = useStructuredData();

const found = findArizonaBrand(String(route.params.slug ?? ''));
if (!found) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}
const brand = found;

const currentPage = computed(() => Number(route.query.page) || 1);

const { data } = await useAsyncData(
  () => `arizona-brand-${brand.slug}-${currentPage.value}`,
  () =>
    useSdk().plentysystems.getFacet({
      type: 'all',
      facets: String(brand.facetValueId),
      itemsPerPage: PAGE_SIZE,
      page: currentPage.value,
      sort: 'item.score',
    }),
  { transform: trimListingProducts, watch: [currentPage] },
);

const products = computed(() => data.value?.data?.products ?? []);
const total = computed(() => Number(data.value?.data?.pagination?.totals) || 0);

const breadcrumbs = computed(() => [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Marken', link: localePath('/marken') },
  { name: brand.name, link: localePath(`/marken/${brand.slug}`) },
]);

const title = `${brand.name} online kaufen`;
const description = `${brand.name} bei Arizona Shopping: ${brand.intro} Versand mit DHL für 4,90 €, 60 Tage kostenlose Rückgabe.`.slice(
  0,
  300,
);
const canonical = computed(
  () =>
    `${runtimeConfig.public.domain}${localePath(`/marken/${brand.slug}`)}${currentPage.value > 1 ? `?page=${currentPage.value}` : ''}`,
);

useHead({
  title,
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    {
      key: 'brand-breadcrumbs',
      type: 'application/ld+json',
      innerHTML: safeSerializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.value.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${runtimeConfig.public.domain}${crumb.link}`,
        })),
      }),
    },
  ],
});
useSeoMeta({ description, ogTitle: title, ogDescription: description });

watchEffect(() => setItemListMetaData(products.value));
</script>
