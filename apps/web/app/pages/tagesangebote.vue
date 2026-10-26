<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer class="px-4 mt-4 mb-20" data-testid="arizona-deals-page">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div class="flex flex-wrap items-baseline gap-x-3">
          <h1 class="typography-headline-4 @md:typography-headline-3 font-bold">Tagesangebote</h1>
          <span v-if="active" class="typography-text-sm text-neutral-600">{{ filtered.length }} Artikel</span>
        </div>
        <p
          v-if="active"
          class="flex items-center gap-2 rounded-full bg-[#C8102E] px-4 py-1.5 font-semibold text-white"
          data-testid="arizona-deals-countdown"
        >
          <span class="typography-text-sm">Nur heute · endet in</span>
          <span class="tabular-nums">{{ remaining }}</span>
        </p>
      </div>

      <template v-if="active">
        <p class="typography-text-sm text-neutral-600 max-w-3xl mb-4">
          Jeden Tag neue Sonderpreise aus allen Bereichen – nur heute und solange der Vorrat reicht.
        </p>

        <div v-if="areas.length > 1" class="flex flex-wrap gap-2 mb-2" data-testid="arizona-deals-areas">
          <button
            v-for="area in ['', ...areas]"
            :key="area || 'alle'"
            type="button"
            :class="pillClass(selectedArea === area)"
            @click="selectArea(area)"
          >
            {{ area || 'Alle' }}
          </button>
        </div>
        <div v-if="subcategories.length > 1" class="flex flex-wrap gap-2 mb-4" data-testid="arizona-deals-subcategories">
          <button
            v-for="subcategory in subcategories"
            :key="subcategory"
            type="button"
            :class="pillClass(selectedSubcategory === subcategory, true)"
            @click="selectedSubcategory = selectedSubcategory === subcategory ? '' : subcategory"
          >
            {{ subcategoryLabel(subcategory) }}
          </button>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <SfLoaderCircular size="2xl" />
        </div>
        <section v-else-if="filtered.length" :class="gridClasses" data-testid="category-grid">
          <UiProductCard
            v-for="(product, index) in filtered"
            :key="productGetters.getVariationId(product)"
            :product="product"
            :configuration="ARIZONA_SEARCH_CARD"
            :index="index"
          />
        </section>
        <p v-else class="py-16 text-center text-neutral-600">In diesem Bereich gibt es heute keine Tagesangebote.</p>
      </template>

      <div v-else-if="!ready" class="flex justify-center py-20">
        <SfLoaderCircular size="2xl" />
      </div>
      <div v-else class="py-20 text-center" data-testid="arizona-deals-empty">
        <p class="typography-headline-5 font-semibold mb-2">Heute keine Tagesangebote</p>
        <p class="text-neutral-600 mb-6">Schau morgen wieder vorbei – oder stöbere in unseren reduzierten Artikeln.</p>
        <UiButton :tag="NuxtLink" :to="localePath('/sale-und-outlet')" class="!rounded-full">Zum SALE</UiButton>
      </div>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { productGetters, type Product } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { Locale } from '#i18n';
import {
  loadArizonaDealProducts,
  useArizonaDailyDeals,
} from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import { ARIZONA_SEARCH_CARD } from '~/utils/arizonaSearch';

// Arizona: all of today's deals (tagesangebote.py chooses two per subcategory), filterable by area and subcategory.
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  layout: false,
  pageType: 'static',
});

const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalizedPath();
const route = useRoute();
const { offers, active, ready, remaining } = useArizonaDailyDeals();

const breadcrumbs = [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Tagesangebote', link: localePath('/tagesangebote') },
];
useArizonaStaticPageHead(
  'Tagesangebote',
  'Die Tagesangebote bei Arizona Shopping: jeden Tag neue Sonderpreise für Damen, Herren und Kinder – nur heute.',
);

const products = ref<Product[]>([]);
const loading = ref(false);
watch(
  offers,
  async (list) => {
    if (!list.length) return (products.value = []);
    loading.value = true;
    products.value = await loadArizonaDealProducts(list);
    loading.value = false;
  },
  { immediate: true },
);

// area and subcategory come from the deals file ("Damen", "Damen › Jeans"); a link from a category preselects them
const selectedArea = ref(String(route.query.bereich ?? ''));
const selectedSubcategory = ref(String(route.query.kategorie ?? ''));
const selectArea = (area: string) => {
  selectedArea.value = area;
  selectedSubcategory.value = '';
};

const offerOf = (product: Product) =>
  offers.value.find((offer) => String(offer.itemId) === String(productGetters.getItemId(product)));
const areas = computed(() => [...new Set(offers.value.map((offer) => offer.bereich).filter(Boolean))] as string[]);
const subcategories = computed(
  () =>
    [
      ...new Set(
        offers.value
          .filter((offer) => !selectedArea.value || offer.bereich === selectedArea.value)
          .map((offer) => offer.unterkategorie)
          .filter(Boolean),
      ),
    ] as string[],
);
const subcategoryLabel = (subcategory: string) =>
  selectedArea.value ? (subcategory.split('›').pop()?.trim() ?? subcategory) : subcategory;

const filtered = computed(() =>
  products.value.filter((product) => {
    const offer = offerOf(product);
    if (selectedArea.value && offer?.bereich !== selectedArea.value) return false;
    return !selectedSubcategory.value || offer?.unterkategorie === selectedSubcategory.value;
  }),
);

const pillClass = (selected: boolean, small = false) => [
  'rounded-full border whitespace-nowrap',
  small ? 'px-3 py-1 typography-text-xs' : 'px-4 py-1.5 typography-text-sm font-medium',
  selected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white hover:border-neutral-900',
];

const gridClasses = gridClassFor({ mobile: 2, tablet: 3, desktop: 5 }, [
  'gap-x-2',
  'gap-y-4',
  '@md:gap-x-3',
  '@md:gap-y-5',
  'mb-10',
]);
</script>
