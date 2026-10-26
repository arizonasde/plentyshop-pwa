<template>
  <!-- Arizona: on large screens the filter column stays in view while the product list scrolls -->
  <div
    v-if="showSortAndFilter"
    data-testid="category-sort-filter"
    class="@md:max-h-[calc(100vh-2rem)] @md:overflow-y-auto scrollbar-hidden"
  >
    <CategorySidebar class="sidebar w-full" :is-open="isOpen" @close="close">
      <template v-for="key in props.content?.filtersOrder" :key="key">
        <template v-if="key === 'category' && props.content?.fields.category">
          <!-- Arizona: the SALE page shows an autumn deals banner instead of the category tree -->
          <ArizonaSaleSideBanner v-if="isSaleCategory" />
          <CategoryTree
            v-else-if="productsCatalog.category"
            :category="productsCatalog.category"
            :breadcrumbs="productsCatalog.breadcrumbs"
          />
        </template>

        <template v-if="key === 'sortBy' && props.content?.fields.sortBy && showFiltersInSidebar">
          <CategorySorting class="mb-6" />
        </template>

        <template v-if="key === 'perPage' && props.content?.fields.perPage && showFiltersInSidebar">
          <CategoryItemsPerPage class="mb-6" :total-products="productsCatalog.pagination?.totals ?? 0" />
        </template>

        <template v-if="key === 'itemRating' && props.content?.fields.itemRating && showFiltersInSidebar">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'manufacturer' && props.content?.fields.manufacturer && showFiltersInSidebar">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'price' && props.content?.fields.price && showFiltersInSidebar">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'availability' && props.content?.fields.availability && showFiltersInSidebar">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
          />
        </template>

        <template v-if="key === 'customizedFilters' && props.content?.fields.customizedFilters && showFiltersInSidebar">
          <CategoryFiltersSort
            v-if="productsCatalog.facets && facetGetters.hasFilters(productsCatalog.facets)"
            class="mb-1"
            :facets="productsCatalog.facets"
            :configuration="content"
            :render-key="key"
            :show-all="showAllFiltersImmediately"
            :limit="numberOfFiltersToShowInitially"
          />
        </template>
      </template>
    </CategorySidebar>

    <UiButton variant="tertiary" class="@md:hidden whitespace-nowrap !px-0" @click="open">
      <template #prefix>
        <SfIconTune />
      </template>
      {{ t('common.labels.listSettings') }}
    </UiButton>
  </div>

  <template v-else>
    <h2 v-if="clientPreview" class="text-center">{{ getEditorTranslation('no-sorting-or-filter-text') }}</h2>
  </template>
</template>

<script setup lang="ts">
import { ARIZONA_SALE_CATEGORY_ID } from '~/utils/arizonaCategoryTexts';
import { facetGetters } from '@plentymarkets/shop-api';
import type { SortFilterProps, SortFilterFieldsVisibility } from './types';
import { SfIconTune, useDisclosure } from '@storefront-ui/vue';

const { data: productsCatalog } = useProducts();
const isSaleCategory = computed(() => Number(productsCatalog.value.category?.id) === ARIZONA_SALE_CATEGORY_ID);

const props = defineProps<SortFilterProps>();

const showSortAndFilter = ref(false);
const { isOpen, open, close } = useDisclosure();
const { t } = useI18n({ useScope: 'global' });

const viewport = useViewport();
// Arizona: from md upwards sorting and filters live in the pill bar above the grid; the sidebar keeps the categories.
const showFiltersInSidebar = computed(() => viewport.isLessThan('md'));
const { isInEditorClient } = useEditorState();
const clientPreview = computed(() => isInEditorClient.value && viewport.isGreaterOrEquals('lg'));

const showAllFiltersImmediately = computed(() => props.content?.showAllFiltersImmediately ?? true);
const numberOfFiltersToShowInitially = computed(() => props.content?.numberOfFiltersToShowInitially ?? 0);

watch(
  () => props.content?.fields,
  (newValue) => {
    showSortAndFilter.value = !!newValue && Object.values(newValue as SortFilterFieldsVisibility).some(Boolean);
  },
  { deep: true, immediate: true },
);
</script>

<i18n lang="json">
{
  "en": {
    "no-sorting-or-filter-text": "You do not have any sorting or filter options enabled"
  },
  "de": {
    "no-sorting-or-filter-text": "You do not have any sorting or filter options enabled"
  }
}
</i18n>

<style>
/* Arizona: the grid row that holds the filter sticks below the top edge (the row wrapper is only as tall as the
   filter, the grid column around it spans the whole product list) */
@media (min-width: 768px) {
  [class~='group/row']:has(> * [data-testid='category-sort-filter']) {
    position: sticky;
    top: 1rem;
  }
}
</style>
