<template>
  <NuxtLayout name="default">
    <div data-testid="search-results" class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
      <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-max" size="2xl" />
      <!-- Arizona: search results look like the category pages (compact headline, filter pills, same product cards) -->
      <NarrowContainer v-if="productsCatalog" class="px-4 mt-4 mb-20" data-testid="category-layout">
        <div id="category-headline" class="flex flex-wrap items-baseline gap-x-3 mb-3">
          <h1 class="typography-headline-4 @md:typography-headline-3 font-bold">„{{ term }}“</h1>
          <span class="typography-text-sm text-neutral-600">{{ totalProducts.toLocaleString('de-DE') }} Artikel</span>
        </div>

        <ArizonaFilterBar
          v-if="productsCatalog.facets?.length && viewport.isGreaterOrEquals('md')"
          :facets="productsCatalog.facets"
          show-category-facet
          class="mb-4"
        />
        <template v-else-if="productsCatalog.facets?.length">
          <CategorySidebar :is-open="isOpen" @close="close">
            <CategorySorting class="mb-6" />
            <CategoryFilters v-if="facetGetters.hasFilters(productsCatalog.facets)" :facets="productsCatalog.facets" />
          </CategorySidebar>
          <UiButton variant="tertiary" class="whitespace-nowrap !px-0 mb-3" @click="open">
            <template #prefix>
              <SfIconTune />
            </template>
            {{ t('common.labels.listSettings') }}
          </UiButton>
        </template>

        <section v-if="products.length" :class="gridClasses" data-testid="category-grid">
          <NuxtLazyHydrate v-for="(product, index) in products" :key="productGetters.getVariationId(product)" when-visible>
            <UiProductCard
              :product="product"
              :configuration="ARIZONA_SEARCH_CARD"
              :index="index"
              :color-variants="colorVariantsOf(product)"
            />
          </NuxtLazyHydrate>
        </section>
        <LazyCategoryEmptyState v-else />

        <div v-if="totalProducts > 0" class="mt-4 mb-4 typography-text-xs flex gap-1">
          <span>{{ t('common.labels.asterisk') }}</span>
          <span v-if="showNetPrices">{{ t('product.priceExclVAT') }}</span>
          <span v-else>{{ t('product.priceInclVAT') }}</span>
          <i18n-t keypath="shipping.excludedLabel" scope="global">
            <template #shipping>
              <UiLink
                :href="localePath(paths.shipping)"
                target="_blank"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ t('common.labels.delivery') }}
              </UiLink>
            </template>
          </i18n-t>
        </div>
        <UiPagination
          v-if="totalProducts > 0"
          :key="`${totalProducts}-${productsPerPage}`"
          :current-page="getFacetsFromURL().page ?? 1"
          :total-items="totalProducts"
          :page-size="Number(productsPerPage)"
          :max-visible-pages="viewport.isGreaterOrEquals('lg') ? 5 : 2"
        />
      </NarrowContainer>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { facetGetters, productGetters } from '@plentymarkets/shop-api';
import { SfIconTune, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
import type { Locale } from '#i18n';
import { groupArizonaColorVariants } from '~/utils/arizonaColorVariants';
import { ARIZONA_SEARCH_CARD } from '~/utils/arizonaSearch';
import { resolveArizonaSearch } from '~/utils/arizonaSearchCategory';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const { getRobots, setRobotForStaticPage } = useRobots();
const { setItemListMetaData } = useStructuredData();

definePageMeta({
  layout: false,
  type: 'search',
});

const route = useRoute();
const viewport = useViewport();
const localePath = useLocalizedPath();
const { showNetPrices } = useCart();
const { isOpen, open, close } = useDisclosure();
const { getSearch, data: productsCatalog, productsPerPage, loading } = useSearch();
const { getFacetsFromURL } = useCategoryFilter();

const term = computed(() => String(route.query.term ?? ''));
const products = computed(() => productsCatalog.value?.products ?? []);
const totalProducts = computed(() => Number(productsCatalog.value?.pagination?.totals) || 0);
const colorVariantsOf = computed(() => groupArizonaColorVariants(products.value));
const gridClasses = gridClassFor({ mobile: 2, tablet: 3, desktop: 5 }, [
  'gap-x-2',
  'gap-y-4',
  '@md:gap-x-3',
  '@md:gap-y-5',
  'mb-10',
  '@md:mb-5',
]);

// Arizona: the plentyONE search links words with OR. Each new query is turned into AND filters once
// ("jeans blau" → Jeans + Blau) or leads to its category ("jeans damen blau" → Damen › Jeans + Blau).
// Remembering the resolved term keeps filters the shopper removes afterwards from coming back.
const { data: categoryTree } = useCategoryTree();
const { buildCategoryMenuLink } = useLocalization();
const resolvedTerm = useState<string>('arizonaResolvedSearchTerm', () => '');

// returns true when the shopper was sent to a category page
const resolveQuery = async () => {
  if (!term.value || resolvedTerm.value === term.value) return false;
  resolvedTerm.value = term.value;
  await getSearch(getFacetsFromURL());
  const tree = categoryTree.value ?? [];
  const resolved = resolveArizonaSearch(term.value, productsCatalog.value?.facets ?? [], tree);
  const current = getFacetsFromURL().facets?.split(',').filter(Boolean) ?? [];
  const facets = [...new Set([...current, ...resolved.facetIds])].join(',');
  if (resolved.category) {
    await navigateTo(
      { path: localePath(buildCategoryMenuLink(resolved.category, tree)), query: facets ? { facets } : {} },
      { replace: true },
    );
    return true;
  }
  // after a server redirect the page loads fresh; a query that is already resolved needs no further redirect
  if (facets !== current.join(',') || resolved.term !== term.value) {
    resolvedTerm.value = resolved.term;
    await navigateTo(
      { query: { ...route.query, term: resolved.term, facets: facets || undefined, page: undefined } },
      { replace: true },
    );
  }
  return false;
};

const handleQueryUpdate = async () => {
  if (await resolveQuery()) return;
  await getSearch(getFacetsFromURL());
  setItemListMetaData(productsCatalog.value?.products || []);
};

await handleQueryUpdate();

watch(
  () => route.query,
  async () => {
    handleQueryUpdate();
  },
);

await getRobots();
setRobotForStaticPage('SearchResult');
// Arizona: search result pages stay out of the index (the plentyONE value is shared with the old shop)
useHead({ meta: [{ name: 'robots', content: 'noindex, follow' }] });
</script>
