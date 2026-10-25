<template>
  <div ref="sliderRootRef">
    <SfScrollable
      buttons-placement="floating"
      class="pb-4 scrollbar-hidden"
      :wrapper-class="wrapperClass"
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
import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';
const { showNetPrices } = useCart();
const localePath = useLocalizedPath();

defineProps<ProductSliderProps>();

// Arizona: slider cards look like the cards in the category listing (brand first, no rating or cart button).
const cardConfiguration: ItemGridContent = {
  cardBorders: false,
  contentAlignment: 'left',
  fields: { title: true, manufacturer: true, rating: false, previewText: false, price: true, addToCart: false },
  fieldsOrder: ['manufacturer', 'title', 'rating', 'previewText', 'price', 'addToCart'],
  fieldsDisabled: ['title'],
  showWishlistButton: true,
  showSecondImageOnHover: true,
  addToCartStyle: 'primary',
  itemsPerRowDesktop: 4,
  itemsPerRowTablet: 3,
  itemsPerRowMobile: 2,
  showItemCount: false,
  itemCountPosition: 'left',
  paginationPosition: 'bottom',
  layout: { fullWidth: false },
};

const { sliderRootRef, shouldLoadImage } = useSliderImagePreload({
  itemWidth: 240,
  itemGap: 16,
  preloadBuffer: 2,
});
</script>
