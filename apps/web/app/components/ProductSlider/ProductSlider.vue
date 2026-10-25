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
      class="pb-4 scrollbar-hidden"
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
  <div class="mt-4 typography-text-xs flex gap-1">
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
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';
const { showNetPrices } = useCart();
const localePath = useLocalizedPath();

defineProps<ProductSliderProps>();

const cardConfiguration = ARIZONA_CARD_CONFIGURATION;

const { sliderRootRef, shouldLoadImage } = useSliderImagePreload({
  itemWidth: 240,
  itemGap: 16,
  preloadBuffer: 2,
});
</script>
