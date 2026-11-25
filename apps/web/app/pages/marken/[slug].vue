<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer class="px-4 pb-10">
      <!-- Arizona: brands with a showcase (Luminox) get their own full page layout -->
      <ArizonaBrandShowcase v-if="story?.showcase" :story="story" :brand-name="brand.name">
        <template #products>
          <h2 class="mb-4 text-3xl font-black tracking-tight @md:text-4xl">
            Die Uhren
            <span v-if="products.length" class="ml-1 align-middle typography-text-sm font-normal text-neutral-600">
              {{ total }} {{ total === 1 ? 'Modell' : 'Modelle' }} lieferbar
            </span>
          </h2>
          <section
            v-if="products.length"
            class="grid grid-cols-2 gap-x-2 gap-y-4 @md:grid-cols-3 @md:gap-x-3 @md:gap-y-5 @lg:grid-cols-4"
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
          <p
            v-else
            class="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 typography-text-sm"
            data-testid="brand-coming-soon"
          >
            {{ story.comingSoon }}
          </p>
          <UiPagination
            v-if="total > PAGE_SIZE"
            :key="`${brand.slug}-${total}`"
            class="mt-6"
            :current-page="currentPage"
            :total-items="total"
            :page-size="PAGE_SIZE"
            :max-visible-pages="viewport.isGreaterOrEquals('lg') ? 5 : 2"
          />
        </template>
      </ArizonaBrandShowcase>
      <template v-else>
        <!-- Arizona: brands with a portrait get a dark header with claim and key facts -->
        <header
          v-if="story"
          class="mb-8 overflow-hidden rounded-2xl bg-neutral-950 px-6 py-8 text-white @md:px-10 @md:py-12"
          data-testid="brand-story-header"
        >
          <p class="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#7CFC9A]">Markenporträt</p>
          <h1 class="text-4xl font-black tracking-tight @md:text-6xl">{{ brand.name }}</h1>
          <p class="mt-3 max-w-3xl text-xl font-semibold leading-snug @md:text-2xl">{{ story.claim }}</p>
          <p class="mt-4 max-w-3xl typography-text-sm text-white/75 @md:typography-text-base" data-testid="brand-intro">
            {{ brand.intro }}
          </p>
          <dl class="mt-8 grid grid-cols-2 gap-3 @md:grid-cols-4">
            <div
              v-for="fact in story.facts"
              :key="fact.label"
              class="rounded-xl border border-white/15 bg-white/5 px-4 py-3"
            >
              <dt class="text-lg font-bold text-[#7CFC9A] @md:text-2xl">{{ fact.value }}</dt>
              <dd class="typography-text-xs text-white/70 @md:typography-text-sm">{{ fact.label }}</dd>
            </div>
          </dl>
          <a
            href="#marke-serien"
            class="mt-8 inline-flex rounded-full bg-white px-5 py-2.5 typography-text-sm font-semibold !text-neutral-950 !no-underline hover:bg-neutral-200"
          >
            Zu den Serien
          </a>
        </header>
        <template v-else>
          <div class="flex flex-wrap items-baseline gap-x-3 mb-2">
            <h1 class="typography-headline-3 @md:typography-headline-2 font-bold">{{ brand.name }}</h1>
            <span v-if="total" class="typography-text-sm text-neutral-600">{{ total }} Artikel</span>
          </div>
          <p class="typography-text-sm text-neutral-600 max-w-3xl mb-6" data-testid="brand-intro">{{ brand.intro }}</p>
        </template>
        <h2 v-if="story && products.length" class="typography-headline-4 font-bold mb-4">
          {{ brand.name }} bei uns
          <span class="typography-text-sm font-normal text-neutral-600">{{ total }} Artikel</span>
        </h2>

        <section
          v-if="products.length"
          class="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-x-2 gap-y-4 @md:gap-x-3 @md:gap-y-5 mb-8"
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
        <p
          v-else-if="story"
          class="mb-8 rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 typography-text-sm"
          data-testid="brand-coming-soon"
        >
          {{ story.comingSoon }}
        </p>
        <p v-else class="mb-8">Zurzeit sind keine Artikel dieser Marke verfügbar.</p>

        <UiPagination
          v-if="total > PAGE_SIZE"
          :key="`${brand.slug}-${total}`"
          :current-page="currentPage"
          :total-items="total"
          :page-size="PAGE_SIZE"
          :max-visible-pages="viewport.isGreaterOrEquals('lg') ? 5 : 2"
        />

        <template v-if="story">
          <section v-for="section in story.sections" :key="section.title" class="mt-10 max-w-3xl">
            <h2 class="typography-headline-4 font-bold mb-3">{{ section.title }}</h2>
            <p
              v-for="(paragraph, index) in section.paragraphs"
              :key="index"
              class="mb-3 text-neutral-700 leading-relaxed"
            >
              {{ paragraph }}
            </p>
          </section>

          <section id="marke-serien" class="mt-12 scroll-mt-24" data-testid="brand-series">
            <h2 class="typography-headline-4 font-bold mb-2">{{ story.seriesTitle }}</h2>
            <p class="mb-6 max-w-3xl text-neutral-700">{{ story.seriesIntro }}</p>
            <div v-for="group in story.seriesGroups" :key="group.title" class="mb-8">
              <h3 class="mb-3 flex flex-wrap items-baseline gap-x-3">
                <span class="rounded-full bg-neutral-950 px-3 py-1 typography-text-sm font-bold text-white">{{
                  group.title
                }}</span>
                <span class="typography-text-sm text-neutral-600">{{ group.text }}</span>
              </h3>
              <ul class="grid grid-cols-1 gap-3 @md:grid-cols-2 @lg:grid-cols-3">
                <li v-for="series in group.series" :key="series.name">
                  <div class="flex h-full flex-col rounded-xl border border-neutral-200 px-4 py-3">
                    <span class="font-semibold">{{ series.name }}</span>
                    <span class="typography-text-xs text-neutral-500">Serie {{ series.models }}</span>
                    <span class="mt-1 typography-text-sm text-neutral-700">{{ series.text }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <p class="typography-text-xs text-neutral-500">{{ story.footnote }}</p>
          </section>
        </template>
      </template>

      <p class="mt-8 typography-text-sm">
        <NuxtLink :to="localePath('/marken')" class="underline underline-offset-2">Alle Marken ansehen</NuxtLink>
      </p>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
import { ARIZONA_BRAND_STORIES } from '~/utils/arizonaBrandStories';

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

const slug = String(route.params.slug ?? '');
// Arizona: brands without a curated entry get a generated page – their items are found by searching the brand name
// and keeping only items whose manufacturer really is this brand.
const brand = findArizonaBrand(slug) ?? { slug, name: '', searchTerm: slug.replace(/-/g, ' '), intro: '' };
const isGenerated = !findArizonaBrand(slug);
const story = ARIZONA_BRAND_STORIES[brand.slug];

const currentPage = computed(() => Number(route.query.page) || 1);

const { data } = await useAsyncData(
  () => `arizona-brand-${brand.slug}-${currentPage.value}`,
  () =>
    brand.searchTerm
      ? useSdk().plentysystems.getSearch({
          term: brand.searchTerm,
          itemsPerPage: PAGE_SIZE,
          page: currentPage.value,
          sort: 'item.score',
        })
      : useSdk().plentysystems.getFacet({
          type: 'all',
          facets: String(brand.facetValueId),
          itemsPerPage: PAGE_SIZE,
          page: currentPage.value,
          sort: 'item.score',
        }),
  { transform: trimListingProducts, watch: [currentPage] },
);

const allProducts = computed(() => data.value?.data?.products ?? []);
const products = computed(() =>
  isGenerated
    ? allProducts.value.filter(
        (product) => slugifyArizonaBrand(productGetters.getManufacturer(product)?.externalName ?? '') === slug,
      )
    : allProducts.value,
);
// Generated pages count only the items on this page that belong to the brand, so the paging stays honest
const total = computed(() =>
  isGenerated && products.value.length < allProducts.value.length
    ? products.value.length
    : Number(data.value?.data?.pagination?.totals) || 0,
);

if (isGenerated) {
  if (!products.value.length) throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  brand.name = formatBrandName(productGetters.getManufacturer(products.value[0]!)?.externalName ?? '');
  brand.intro = `Mode von ${brand.name} bei Arizona Shopping – aktuelle Artikel der Marke auf einen Blick.`;
}

const breadcrumbs = computed(() => [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Marken', link: localePath('/marken') },
  { name: brand.name, link: localePath(`/marken/${brand.slug}`) },
]);

const title = `${brand.name} online kaufen`;
const description =
  `${brand.name} bei Arizona Shopping: ${brand.intro} Kostenloser Versand ab 99 €, 60 Tage Rückgaberecht.`.slice(
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
