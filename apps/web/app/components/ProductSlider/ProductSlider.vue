<template>
  <div v-if="grid" class="grid grid-cols-2 @md:grid-cols-4 gap-x-2 gap-y-4 @md:gap-x-3 @md:gap-y-5" data-testid="product-grid-wide">
    <UiProductCard
      v-for="(product, index) in items"
      :key="productGetters.getId(product)"
      :product="product"
      :index="index"
      :configuration="cardConfiguration"
    />
  </div>
  <div v-else ref="sliderRootRef">
    <SfScrollable
      buttons-placement="floating"
      class="scrollbar-hidden"
      :wrapper-class="[wrapperClass, '!gap-2 @md:!gap-3']"
      data-testid="product-slider"
    >
      <UiProductCard
        v-for="(product, index) in items"
        :key="productGetters.getId(product)"
        :product="product"
        :should-load-image="shouldLoadImage(index)"
        :index="index"
        :configuration="cardConfiguration"
        is-from-slider
        class="w-44 max-w-44 @md:w-60 @md:max-w-60 shrink-0"
      />
    </SfScrollable>
  </div>
  <!-- Arizona: on the home page the note is shown once at the bottom instead of under every slider -->
  <ArizonaVatHint v-if="!isHomePage" class="mt-1" />
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';
import ArizonaVatHint from '~/components/ArizonaVatHint/ArizonaVatHint.vue';

const route = useRoute();
const isHomePage = computed(() => route.meta.identifier === HOMEPAGE_IDENTIFIER);

defineProps<ProductSliderProps>();

const cardConfiguration = ARIZONA_CARD_CONFIGURATION;

const { sliderRootRef, shouldLoadImage } = useSliderImagePreload({
  itemWidth: 240,
  itemGap: 16,
  preloadBuffer: 2,
});
</script>
