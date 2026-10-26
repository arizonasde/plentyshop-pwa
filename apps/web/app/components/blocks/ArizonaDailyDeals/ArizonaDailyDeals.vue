<template>
  <!-- the wrapper always takes up a pixel so lazy hydration starts and the deals file gets loaded -->
  <div class="min-h-px">
    <section v-if="active && products.length" class="py-6" data-testid="arizona-daily-deals">
    <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="typography-headline-4 @md:typography-headline-3 font-bold">{{ content?.title || 'Angebote des Tages' }}</h2>
        <p class="typography-text-sm text-neutral-600">
          {{ content?.text || 'Nur heute zum Sonderpreis – solange der Vorrat reicht.' }}
        </p>
      </div>
      <p class="flex items-center gap-2 rounded-full bg-[#C8102E] px-4 py-2 font-semibold text-white">
        <span class="typography-text-sm">Endet in</span>
        <span class="tabular-nums text-lg">{{ remaining }}</span>
      </p>
    </div>
    <div class="grid grid-cols-2 @md:grid-cols-3 gap-x-2 gap-y-4 @md:gap-x-3">
      <UiProductCard
        v-for="(product, index) in products"
        :key="productGetters.getVariationId(product)"
        :product="product"
        :index="index"
        :configuration="ARIZONA_CARD_CONFIGURATION"
      />
    </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { productGetters, type Product } from '@plentymarkets/shop-api';
import { useArizonaDailyDeals } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import type { ArizonaDailyDealsProps } from './types';

/**
 * Arizona: home page block "Angebote des Tages" – up to three of today's deals with a countdown to the end of the
 * offer. Hidden when there are no current deals.
 */
const props = defineProps<ArizonaDailyDealsProps>();
const { offers, active, remaining } = useArizonaDailyDeals();
const products = ref<Product[]>([]);

watch(
  offers,
  async (list) => {
    if (!list.length) return (products.value = []);
    const top = list.slice(0, props.content?.maxItems || 3);
    const withVariation = top.filter((offer) => offer.variationId).map((offer) => Number(offer.variationId));
    const loaded: Product[] = [];
    if (withVariation.length) {
      const { data } = await useSdk().plentysystems.getProductsByIds({ variationIds: withVariation });
      loaded.push(...(data?.products ?? []));
    }
    for (const offer of top.filter((o) => !o.variationId)) {
      try {
        const { data } = await useSdk().plentysystems.getProduct({ id: String(offer.itemId) });
        if (data) loaded.push(data as Product);
      } catch {
        // item not available – skip it
      }
    }
    const order = (product: Product) => top.findIndex((o) => String(o.itemId) === String(productGetters.getItemId(product)));
    products.value = loaded.sort((a, b) => order(a) - order(b));
  },
  { immediate: true },
);
</script>
