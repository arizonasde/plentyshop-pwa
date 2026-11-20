<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <NarrowContainer class="px-4 mt-4 mb-20" data-testid="arizona-bf-deals-page">
      <!-- dark head like the Black Friday banner on the home page -->
      <div class="relative mb-5 overflow-hidden rounded-2xl bg-neutral-950 px-5 py-6 text-white @md:px-8 @md:py-8">
        <span
          class="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#C8102E] opacity-40 blur-3xl"
          aria-hidden="true"
        />
        <div class="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="mb-2 inline-flex rounded-full bg-[#C8102E] px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Black Week bei Arizona
            </p>
            <h1 class="text-4xl font-black uppercase leading-none tracking-tight @md:text-6xl">Black Friday Deals</h1>
            <p v-if="maxDiscount" class="mt-4 flex items-center gap-2">
              <ArizonaBlackFridayBolt class="h-12 w-8 @md:h-16 @md:w-10" />
              <span class="text-lg font-semibold leading-none">bis zu</span>
              <span class="text-4xl font-black leading-none text-[#F5C400] @md:text-6xl">−{{ maxDiscount }}&nbsp;%</span>
            </p>
            <p class="mt-3 max-w-2xl typography-text-sm text-white/80 @md:typography-text-base">
              Unsere stärksten Rabatte<template v-if="minDiscount"> – jeder Artikel mindestens −{{ minDiscount }} %</template>,
              die höchsten zuerst. Nur bis Cyber Monday und solange der Vorrat reicht.
            </p>
          </div>
          <p
            v-if="blackWeek"
            class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-semibold"
            data-testid="arizona-bf-deals-countdown"
          >
            <span class="typography-text-sm text-white/70">Endet in</span>
            <span class="tabular-nums">{{ countdown }}</span>
          </p>
        </div>
      </div>

      <template v-if="blackWeek && deals.length">
        <div v-if="areas.length > 1" class="mb-4 flex flex-wrap items-center gap-2" data-testid="arizona-bf-deals-areas">
          <button
            v-for="area in ['', ...areas]"
            :key="area || 'alle'"
            type="button"
            :class="pillClass(selectedArea === area)"
            @click="selectedArea = area"
          >
            {{ area || 'Alle' }}
          </button>
          <span class="typography-text-sm text-neutral-600">{{ filtered.length }} Artikel</span>
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
        <p v-else class="py-16 text-center text-neutral-600">In diesem Bereich sind die Deals gerade ausverkauft.</p>
      </template>

      <div v-else-if="blackWeek && !ready" class="flex justify-center py-20">
        <SfLoaderCircular size="2xl" />
      </div>
      <div v-else class="py-16 text-center" data-testid="arizona-bf-deals-empty">
        <p class="typography-headline-5 mb-2 font-semibold">
          {{ blackWeek ? 'Die Deals werden gerade aufgefüllt' : 'Die Black Friday Deals sind vorbei' }}
        </p>
        <p class="mb-6 text-neutral-600">Reduzierte Artikel findest du jederzeit im SALE.</p>
        <UiButton :tag="NuxtLink" :to="localePath('/sale-und-outlet')" class="!rounded-full">Zum SALE</UiButton>
      </div>
    </NarrowContainer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { productGetters, type Product } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { Locale } from '#i18n';
import { loadArizonaDealProducts } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import { useArizonaBlackFridayDeals } from '~/composables/useArizonaBlackFridayDeals/useArizonaBlackFridayDeals';
import { ARIZONA_SEARCH_CARD } from '~/utils/arizonaSearch';
import { arizonaBlackWeekRemaining, isArizonaBlackWeek } from '~/utils/arizonaBlackFriday';

// Arizona: the most reduced items of the shop for the Black Week (black-friday-deals.json, highest discount first)
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
const { deals, maxDiscount, minDiscount, ready } = useArizonaBlackFridayDeals();

const now = ref(Date.now());
const mounted = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  mounted.value = true;
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onBeforeUnmount(() => clearInterval(timer));
const blackWeek = computed(() => isArizonaBlackWeek(now.value));
const countdown = computed(() => (mounted.value ? arizonaBlackWeekRemaining(now.value) : ' '));

const breadcrumbs = [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Black Friday Deals', link: localePath('/black-friday-deals') },
];
useArizonaStaticPageHead(
  'Black Friday Deals',
  'Black Friday bei Arizona Shopping: unsere stärksten Rabatte für Damen, Herren und Kinder – nur bis Cyber Monday.',
);

const products = ref<Product[]>([]);
const loading = ref(false);
watch(
  deals,
  async (list) => {
    if (!list.length) return (products.value = []);
    loading.value = true;
    products.value = await loadArizonaDealProducts(list);
    loading.value = false;
  },
  { immediate: true },
);

const dealOf = (product: Product) =>
  deals.value.find((deal) => String(deal.itemId) === String(productGetters.getItemId(product)));
// areas in the order of their best deal, a link can preselect one (?bereich=Damen)
const areas = computed(() => [...new Set(deals.value.map((deal) => deal.bereich).filter(Boolean))] as string[]);
const selectedArea = ref(String(route.query.bereich ?? ''));
const filtered = computed(() =>
  products.value.filter((product) => !selectedArea.value || dealOf(product)?.bereich === selectedArea.value),
);

const pillClass = (selected: boolean) => [
  'rounded-full border whitespace-nowrap px-4 py-1.5 typography-text-sm font-medium',
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
