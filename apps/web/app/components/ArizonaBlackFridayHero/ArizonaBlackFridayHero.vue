<template>
  <section
    v-if="blackWeek"
    class="max-w-screen-3xl mx-auto px-4 @md:px-10 mt-4 mb-8"
    aria-labelledby="arizona-black-friday-title"
    data-testid="arizona-black-friday"
  >
    <div class="relative overflow-hidden rounded-2xl bg-neutral-950 text-white">
      <!-- decorative glow, no image so the banner appears instantly -->
      <span
        class="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#C8102E] opacity-40 blur-3xl"
        aria-hidden="true"
      />
      <span
        class="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-[#F5C400] opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <!-- faint flash over the dark background, in time with the lightning bolt -->
      <span class="arizona-bf-flash pointer-events-none absolute inset-0" aria-hidden="true" />

      <div class="relative grid gap-6 px-5 py-7 @md:grid-cols-[1.4fr_1fr] @md:items-end @md:px-10 @md:py-10">
        <div>
          <p class="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C8102E] px-3 py-1 text-xs font-bold uppercase tracking-widest">
            Black Week bei Arizona
          </p>
          <h2 id="arizona-black-friday-title" class="text-5xl font-black uppercase leading-[0.9] tracking-tight @md:text-7xl">
            Black<br />Friday
          </h2>
          <p
            v-if="maxDiscount"
            class="mt-5 flex items-center gap-2 @md:gap-3"
            data-testid="arizona-black-friday-discount"
          >
            <ArizonaBlackFridayBolt class="h-14 w-9 @md:h-20 @md:w-12" />
            <span class="text-lg font-semibold leading-none @md:text-xl">bis zu</span>
            <span class="text-5xl font-black leading-none tracking-tight text-[#F5C400] @md:text-7xl">
              −{{ maxDiscount }}&nbsp;%
            </span>
          </p>
          <p class="mt-4 max-w-xl text-lg font-semibold leading-snug @md:text-xl">
            <template v-if="!maxDiscount">Reduzierte Preise für</template>
            <template v-else-if="bfDeals.length">Unsere stärksten Rabatte auf</template>
            <template v-else>Auf</template>
            {{ dealCount ? `${dealCount} ausgewählte Artikel` : 'ausgewählte Artikel' }} – nur bis Cyber Monday.
          </p>
        </div>

        <div class="flex flex-col gap-4 @md:items-end">
          <p class="flex flex-wrap items-center gap-2 typography-text-sm" data-testid="arizona-black-friday-countdown">
            <span class="text-white/70">Endet in</span>
            <span class="min-w-40 rounded-lg bg-white/10 px-3 py-1.5 text-center text-lg font-bold tabular-nums">{{ countdown }}</span>
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              :to="localePath(allDealsLink)"
              class="rounded-full bg-[#F5C400] px-6 py-3 font-bold !text-neutral-950 !no-underline hover:bg-[#FFD633]"
              data-testid="arizona-black-friday-cta"
            >
              Zu den Black Friday Deals →
            </NuxtLink>
            <NuxtLink
              v-if="dealCount"
              :to="localePath('/sale-und-outlet')"
              class="rounded-full border border-white/40 px-6 py-3 font-semibold !text-white !no-underline hover:border-white"
            >
              Zum SALE
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- today's deals as a slider, white cards on the dark banner -->
      <div v-if="products.length" class="relative px-3 pb-5 @md:px-8 @md:pb-8">
        <SfScrollable
          buttons-placement="floating"
          class="scrollbar-hidden"
          wrapper-class="!gap-2 @md:!gap-3"
          data-testid="arizona-black-friday-slider"
        >
          <div
            v-for="(product, index) in products"
            :key="productGetters.getVariationId(product)"
            class="w-40 max-w-40 shrink-0 rounded-xl bg-white p-2 text-neutral-900 @md:w-52 @md:max-w-52"
          >
            <UiProductCard
              :product="product"
              :index="index"
              :configuration="ARIZONA_SEARCH_CARD"
              :should-load-image="true"
              is-from-slider
            />
          </div>
          <NuxtLink
            :to="localePath(allDealsLink)"
            class="flex w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-white/30 p-4 text-center font-semibold !text-white !no-underline hover:border-white @md:w-52"
          >
            <span class="text-3xl" aria-hidden="true">→</span>
            Alle {{ dealCount }} Deals ansehen
          </NuxtLink>
        </SfScrollable>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { productGetters, type Product } from '@plentymarkets/shop-api';
import { SfScrollable } from '@storefront-ui/vue';
import {
  loadArizonaDealProducts,
  useArizonaDailyDeals,
} from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import { useArizonaBlackFridayDeals } from '~/composables/useArizonaBlackFridayDeals/useArizonaBlackFridayDeals';
import { arizonaBlackWeekRemaining, isArizonaBlackWeek } from '~/utils/arizonaBlackFriday';
import { ARIZONA_SEARCH_CARD } from '~/utils/arizonaSearch';

/**
 * Arizona: Black Friday banner at the very top of the home page (Black Week, see arizonaBlackFriday.ts).
 * Shows the highest discount (with a flashing lightning bolt), a countdown to the end of Cyber Monday and the most
 * reduced items (black-friday-deals.json, highest discount first) as a slider; the main button leads to
 * /black-friday-deals. Without that file it falls back to today's deals. Disappears by itself after the Black Week.
 */
const SLIDER_ITEMS = 12;

const localePath = useLocalizedPath();
const { offers, maxDiscount: dailyMaxDiscount } = useArizonaDailyDeals();
const { deals: bfDeals, maxDiscount: bfMaxDiscount, ready: bfReady } = useArizonaBlackFridayDeals();
const maxDiscount = computed(() => (bfDeals.value.length ? bfMaxDiscount.value : dailyMaxDiscount.value));
const dealCount = computed(() => bfDeals.value.length || offers.value.length);
const allDealsLink = computed(() =>
  bfDeals.value.length ? '/black-friday-deals' : offers.value.length ? '/tagesangebote' : '/sale-und-outlet',
);

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;
// the countdown only starts in the browser, so server and browser render the same HTML
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onBeforeUnmount(() => clearInterval(timer));

const blackWeek = computed(() => isArizonaBlackWeek(now.value));
const countdown = computed(() => (mounted.value ? arizonaBlackWeekRemaining(now.value) : '\u00A0'));

const products = ref<Product[]>([]);
// the most reduced items first; today's deals only when there is no Black Friday list
watch(
  [bfDeals, offers, bfReady],
  async ([deals, daily, ready]) => {
    const list = deals.length ? deals : ready ? daily : [];
    products.value = list.length ? await loadArizonaDealProducts(list.slice(0, SLIDER_ITEMS)) : [];
  },
  { immediate: true },
);
</script>

<style scoped>
.arizona-bf-flash {
  background: radial-gradient(ellipse 60% 70% at 18% 62%, rgb(255 236 150 / 0.22), transparent 70%);
  opacity: 0;
  animation: arizona-bf-flash 7s ease-out infinite;
}

/* same rhythm as ArizonaBlackFridayBolt: a short double flash, then a long calm pause */
@keyframes arizona-bf-flash {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  82% {
    opacity: 0.7;
  }
  84% {
    opacity: 0.1;
  }
  86% {
    opacity: 1;
  }
  92% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .arizona-bf-flash {
    animation: none;
  }
}
</style>
