<template>
  <NuxtLink :to="path" class="arizona-magazine-product mag-press-soft" :class="{ 'is-mini': mini }">
    <span class="rahmen">
      <img :src="image" :alt="name" loading="lazy" />
    </span>
    <span class="info">
      <b>{{ brand }}</b>
      <span v-if="!mini" class="name">{{ name }}</span>
      <span class="preis">{{ format(price) }}</span>
    </span>
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
/* white product tile on the dark magazine: image on white, text below */
.arizona-magazine-product {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
  color: #111;
  text-decoration: none;
  font-size: 13px;
  line-height: 1.4;
}
.rahmen {
  display: block;
  overflow: hidden;
  background: #fff;
}
.rahmen img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  display: block;
  padding: 12px;
  transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
}
.info {
  display: block;
  padding: 12px 16px 16px;
  border-top: 1px solid #eee;
}
b {
  display: block;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #777;
}
.name {
  display: block;
  margin-top: 2px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.preis {
  display: inline-block;
  margin-top: 8px;
  border-radius: 9999px;
  background: #111;
  color: #fff;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}
@media (hover: hover) and (pointer: fine) {
  .arizona-magazine-product:hover .rahmen img {
    transform: scale(1.05);
  }
}
@media (prefers-reduced-motion: reduce) {
  .rahmen img {
    transition: none;
  }
  .arizona-magazine-product:hover .rahmen img {
    transform: none;
  }
}
</style>
