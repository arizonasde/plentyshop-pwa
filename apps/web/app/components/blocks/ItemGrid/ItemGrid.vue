<template>
  <div class="flex-1">
    <div v-if="categoryName" class="flex flex-wrap items-baseline gap-x-3 mb-3" data-testid="category-headline-compact">
      <h1 class="typography-headline-4 @md:typography-headline-3 font-bold">{{ categoryName }}</h1>
      <span class="typography-text-sm text-neutral-600">{{ totalProducts }} Artikel</span>
    </div>
    <p v-if="categoryText" class="typography-text-sm text-neutral-600 max-w-3xl mb-4" data-testid="category-intro-text">
      {{ categoryText }}
    </p>
    <!-- Arizona: autumn deal banners on the SALE page -->
    <ArizonaSaleBanners v-if="isSaleCategory" class="mb-5" />
    <ArizonaFilterBar
      v-if="productsCatalog.facets?.length && viewport.isGreaterOrEquals('md')"
      :facets="productsCatalog.facets"
      :show-category-facet="!categoryHasChildren"
      class="mb-4"
    />
    <template v-if="content?.showItemCount && !categoryName">
      <div
        class="flex items-center mb-6"
        :class="{
          'justify-end': content?.itemCountPosition === 'right',
          'justify-center': content?.itemCountPosition === 'center',
          'justify-start': content?.itemCountPosition === 'left',
        }"
        data-testid="item-count"
      >
        <span class="font-bold @md:text-lg">
          {{
            t('search.numberOfProducts', {
              count: products?.length ?? 0,
              total: totalProducts,
            })
          }}
        </span>
      </div>
    </template>

    <template v-if="content?.paginationPosition === 'top' || content?.paginationPosition === 'both'">
      <UiPagination
        v-if="totalProducts > 0"
        :key="`${totalProducts}-${itemsPerPage}`"
        :current-page="getFacetsFromURL().page ?? 1"
        :total-items="totalProducts"
        :page-size="itemsPerPage"
        :max-visible-pages="maxVisiblePages"
        data-testid="pagination-top"
      />
    </template>
    <section v-if="products?.length" :class="gridClasses" data-testid="category-grid">
      <NuxtLazyHydrate v-for="(product, index) in products" :key="productGetters.getVariationId(product)" when-visible>
        <UiProductCard
          :product="product"
          :configuration="content"
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
            data-testid="shipping-link"
          >
            {{ t('common.labels.delivery') }}
          </UiLink>
        </template>
      </i18n-t>
    </div>
    <template v-if="content?.paginationPosition === 'bottom' || content?.paginationPosition === 'both'">
      <UiPagination
        v-if="totalProducts > 0"
        :key="`${totalProducts}-${itemsPerPage}`"
        :current-page="currentPage"
        :total-items="totalProducts"
        :page-size="itemsPerPage"
        :max-visible-pages="maxVisiblePages"
        data-testid="pagination-bottom"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { categoryGetters, productGetters, type Product } from '@plentymarkets/shop-api';
import type { ItemGridProps } from '~/components/blocks/ItemGrid/types';
import { ARIZONA_SALE_CATEGORY_ID } from '~/utils/arizonaCategoryTexts';

const { getFacetsFromURL } = useCategoryFilter();

const viewport = useViewport();
const localePath = useLocalizedPath();
const { showNetPrices } = useCart();
const { data: productsCatalog, productsPerPage } = useProducts();

const props = defineProps<ItemGridProps>();
const products = computed(() => productsCatalog.value.products || []);
// Arizona: the category name sits compactly above the filters instead of in a large CategoryData block.
const categoryName = computed(() =>
  productsCatalog.value.category ? categoryGetters.getCategoryName(productsCatalog.value.category) : '',
);

// Arizona: categories without subcategories (e.g. SALE) get the category filter instead of a category tree
const { data: categoryTree } = useCategoryTree();
const categoryHasChildren = computed(() => {
  const id = Number(productsCatalog.value.category?.id);
  const find = (nodes: { id: number; children?: unknown[] }[]): { children?: unknown[] } | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node;
      const hit = find((node.children ?? []) as { id: number; children?: unknown[] }[]);
      if (hit) return hit;
    }
  };
  return Boolean(find((categoryTree.value ?? []) as { id: number; children?: unknown[] }[])?.children?.length);
});
const isSaleCategory = computed(() => Number(productsCatalog.value.category?.id) === ARIZONA_SALE_CATEGORY_ID);

const categoryText = computed(() => {
  const id = productsCatalog.value.category?.id;
  return id ? (ARIZONA_CATEGORY_TEXTS[Number(id)] ?? '') : '';
});

// Arizona: every colour of an item is its own card; collect the siblings so each card can preview the other colours.
const productsByItem = computed(() => {
  const groups = new Map<string, Product[]>();
  for (const product of products.value) {
    const itemId = String(productGetters.getItemId(product));
    groups.set(itemId, [...(groups.get(itemId) ?? []), product]);
  }
  return groups;
});
const colorVariantsOf = (product: Product): Product[] =>
  (productsByItem.value.get(String(productGetters.getItemId(product))) ?? []).filter(
    (sibling) => productGetters.getVariationId(sibling) !== productGetters.getVariationId(product),
  );
const totalProducts = computed(() => Number(productsCatalog.value.pagination?.totals) || 0);
const itemsPerPage = computed(() => Number(productsPerPage.value) || 0);
const maxVisiblePages = computed(() => (viewport.isGreaterOrEquals('lg') ? 5 : 2));
const currentPage = computed(() => getFacetsFromURL().page ?? 1);
const categoryId = computed(() => getFacetsFromURL().categoryUrlPath ?? null);

const gridClasses = computed(() =>
  gridClassFor(
    {
      mobile: props.content?.itemsPerRowMobile,
      tablet: props.content?.itemsPerRowTablet,
      desktop: props.content?.itemsPerRowDesktop,
    },
    ['gap-x-2', 'gap-y-4', '@md:gap-x-3', '@md:gap-y-5', 'mb-10', '@md:mb-5'],
  ),
);

watch([currentPage, categoryId], ([newPage, newCategory], [oldPage, oldCategory]) => {
  if (newPage !== oldPage && newCategory === oldCategory) {
    scrollToHTMLObject('#category-headline', false);
  }
});
</script>
