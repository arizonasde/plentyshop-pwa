<template>
  <div ref="barRef" class="flex flex-wrap items-center gap-2" data-testid="arizona-filter-bar">
    <!-- Sorting -->
    <div class="relative">
      <button
        type="button"
        class="h-11 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 typography-text-sm hover:border-neutral-900"
        :aria-expanded="openKey === 'sort'"
        aria-haspopup="true"
        @click="toggle('sort')"
      >
        {{ t('common.labels.sortBy') }}
        <SfIconExpandMore size="sm" aria-hidden="true" :class="{ 'rotate-180': openKey === 'sort' }" />
      </button>
      <div v-if="openKey === 'sort'" :class="panelClass">
        <button
          v-for="option in sortOptions"
          :key="option"
          type="button"
          class="w-full min-h-11 text-left px-3 rounded-md typography-text-sm hover:bg-[#F3F3F3]"
          :class="{ 'font-semibold': option === currentSort }"
          @click="selectSort(option)"
        >
          {{ t(`category.sorting.${option}`) }}
        </button>
      </div>
    </div>

    <!-- One pill per facet group -->
    <div v-for="facet in visibleFacets" :key="facet.id" class="relative">
      <button
        type="button"
        class="h-11 inline-flex items-center gap-2 rounded-full border bg-white px-4 typography-text-sm hover:border-neutral-900"
        :class="activeCount(facet) ? 'border-neutral-900 font-semibold' : 'border-neutral-300'"
        :aria-expanded="openKey === String(facet.id)"
        aria-haspopup="true"
        @click="toggle(String(facet.id))"
      >
        {{ facetGetters.getName(facet) }}
        <span v-if="activeCount(facet)">({{ activeCount(facet) }})</span>
        <SfIconExpandMore size="sm" aria-hidden="true" :class="{ 'rotate-180': openKey === String(facet.id) }" />
      </button>

      <div v-if="openKey === String(facet.id)" :class="panelClass">
        <form
          v-if="facetGetters.getType(facet) === 'price'"
          class="flex flex-col gap-3 p-1"
          @submit.prevent="applyPrice"
        >
          <div class="flex gap-2">
            <label class="flex-1 typography-text-sm">
              {{ t('common.labels.min') }}
              <SfInput v-model="minPrice" inputmode="decimal" />
            </label>
            <label class="flex-1 typography-text-sm">
              {{ t('common.labels.max') }}
              <SfInput v-model="maxPrice" inputmode="decimal" />
            </label>
          </div>
          <UiButton type="submit" class="w-full">{{ t('common.actions.apply') }}</UiButton>
        </form>

        <template v-else>
          <label
            v-for="filter in facetGetters.getFilters(facet)"
            :key="filter.id"
            class="flex items-center gap-3 min-h-11 px-3 rounded-md cursor-pointer hover:bg-[#F3F3F3]"
          >
            <SfCheckbox :model-value="isSelected(filter.id)" @update:model-value="toggleFilter(filter.id, Boolean($event))" />
            <span class="typography-text-sm flex-1">
              {{ facetGetters.getType(facet) === 'producer' ? formatBrandName(filter.name ?? '') : filter.name }}
            </span>
            <span class="typography-text-xs text-neutral-500">{{ filter.count }}</span>
          </label>
        </template>
      </div>
    </div>

    <!-- Arizona: today's deals, preselected for the current category when it has deals -->
    <NuxtLink
      v-if="dealsActive"
      :to="dealsLink"
      class="h-11 inline-flex items-center rounded-full bg-[#C8102E] px-4 typography-text-sm font-semibold text-white hover:bg-[#A50D26]"
      data-testid="arizona-filter-bar-deals"
    >
      Tagesangebote
    </NuxtLink>

    <button
      v-if="hasActiveFilters"
      type="button"
      class="h-11 px-2 typography-text-sm font-semibold underline underline-offset-4"
      @click="resetFilters"
    >
      Filter zurücksetzen
    </button>
  </div>
</template>

<script setup lang="ts">
import { categoryGetters, categoryTreeGetters, facetGetters, type FilterGroup } from '@plentymarkets/shop-api';
import { SfCheckbox, SfIconExpandMore, SfInput } from '@storefront-ui/vue';
import type { ArizonaFilterBarProps } from './types';
import { useArizonaDailyDeals } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';

/**
 * Arizona: filters as pills above the product grid (large fashion shop pattern).
 * Uses the same URL-based filter logic as the sidebar; rating filters are left out on purpose.
 */
const props = defineProps<ArizonaFilterBarProps>();

const SUPPORTED_TYPES = new Set(['producer', 'dynamic', 'availability', 'price']);
const panelClass =
  'absolute left-0 top-full mt-2 z-dropdown w-72 max-h-[60vh] overflow-y-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-neutral-200';

const route = useRoute();
const { getFacetsFromURL, updateFilters, updatePrices, updateSorting } = useCategoryFilter();
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');

const localePath = useLocalizedPath();
const { data: productsCatalog } = useProducts();
const { currentMainCategory } = useArizonaMainCategory();
const { offers, active: dealsActive } = useArizonaDailyDeals();
// on a category page the deals page opens on its area and, if it has deals today, its subcategory
const dealsLink = computed(() => {
  const category = productsCatalog.value?.category;
  const main = currentMainCategory.value;
  const area = category && main ? categoryTreeGetters.getName(main) : '';
  const subcategory = category ? `${area} › ${categoryGetters.getCategoryName(category)}` : '';
  const query: Record<string, string> = {};
  if (offers.value.some((offer) => offer.bereich === area)) query.bereich = area;
  if (offers.value.some((offer) => offer.unterkategorie === subcategory)) query.kategorie = subcategory;
  return { path: localePath('/tagesangebote'), query };
});

const barRef = ref<HTMLElement | null>(null);
const openKey = ref<string | null>(null);
const minPrice = ref(getFacetsFromURL().priceMin ?? '');
const maxPrice = ref(getFacetsFromURL().priceMax ?? '');

const sortOptions = computed<string[]>(() => availableSortingOptions());
const currentSort = computed(() => (typeof route.query.sort === 'string' ? route.query.sort : ''));
const selectedIds = computed(() => new Set(getFacetsFromURL().facets?.split(',').filter(Boolean) ?? []));

const visibleFacets = computed(() =>
  props.facets.filter(
    (facet) =>
      SUPPORTED_TYPES.has(facetGetters.getType(facet)) &&
      // the category facet is redundant next to the category tree in the sidebar – except in categories without
      // subcategories (e.g. SALE), where it is the only way to narrow down by category
      (props.showCategoryFacet || facetGetters.getName(facet).trim().toLowerCase() !== 'kategorie') &&
      (facetGetters.getType(facet) === 'price' || facetGetters.getFilters(facet).length > 0),
  ),
);

const isSelected = (id: number | string) => selectedIds.value.has(String(id));
const activeCount = (facet: FilterGroup) => {
  if (facetGetters.getType(facet) === 'price') return getFacetsFromURL().priceMin || getFacetsFromURL().priceMax ? 1 : 0;
  return facetGetters.getFilters(facet).filter((filter) => isSelected(filter.id)).length;
};
const hasActiveFilters = computed(
  () => selectedIds.value.size > 0 || Boolean(getFacetsFromURL().priceMin || getFacetsFromURL().priceMax),
);

const toggle = (key: string) => {
  openKey.value = openKey.value === key ? null : key;
};
const selectSort = (option: string) => {
  openKey.value = null;
  updateSorting(option);
};
const toggleFilter = (id: number | string, checked: boolean) => updateFilters({ [String(id)]: checked });
const applyPrice = () => {
  openKey.value = null;
  updatePrices(minPrice.value.trim(), maxPrice.value.trim());
};
const resetFilters = () => {
  openKey.value = null;
  const query = { ...route.query };
  delete query.facets;
  delete query.priceMin;
  delete query.priceMax;
  delete query.page;
  navigateTo({ query });
};

// Close the open panel on outside click or Escape.
const onDocumentClick = (event: MouseEvent) => {
  if (openKey.value && barRef.value && !barRef.value.contains(event.target as Node)) openKey.value = null;
};
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') openKey.value = null;
};
onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onKeydown);
});

watch(
  () => route.query,
  () => {
    minPrice.value = getFacetsFromURL().priceMin ?? '';
    maxPrice.value = getFacetsFromURL().priceMax ?? '';
  },
);
</script>
