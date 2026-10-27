<template>
  <NuxtLink :to="path" class="arizona-magazine-product" :class="{ 'is-mini': mini }">
    <img :src="image" :alt="name" loading="lazy" />
    <template v-if="!mini">
      <b>{{ brand }}</b>
      <span>{{ name }}</span>
    </template>
    {{ format(price) }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ArizonaMagazineProductProps } from './types';

// Arizona: a product of a magazine post, linked to the colour (variation) shown in the post.
const props = defineProps<ArizonaMagazineProductProps>();
const localePath = useLocalizedPath();
const { format } = usePriceFormatter();
const { price } = useProductPrice(props.product);

const name = computed(() => getDisplayName(props.product));
const brand = computed(() => formatBrandName(productGetters.getManufacturer(props.product)?.externalName ?? ''));
const image = computed(() => productGetters.getCoverImage(props.product));
const path = computed(() =>
  localePath(
    `/${productGetters.getUrlPath(props.product)}_${productGetters.getItemId(props.product)}_${productGetters.getVariationId(props.product)}`,
  ),
);
</script>

<style scoped>
.arizona-magazine-product {
  display: block;
  text-decoration: none;
  font-size: 13px;
}
.arizona-magazine-product img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background: #ece7df;
  display: block;
  margin-bottom: 8px;
  transition: opacity 0.2s;
}
.arizona-magazine-product:hover img {
  opacity: 0.85;
}
.arizona-magazine-product b {
  display: block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.arizona-magazine-product span {
  display: block;
  color: #6f6a63;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.arizona-magazine-product.is-mini {
  font-size: 11px;
  color: #6f6a63;
}
.arizona-magazine-product.is-mini img {
  margin-bottom: 4px;
}
</style>
