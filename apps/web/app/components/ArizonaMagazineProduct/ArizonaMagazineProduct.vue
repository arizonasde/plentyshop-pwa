<template>
  <NuxtLink :to="path" class="arizona-magazine-product mag-press-soft" :class="{ 'is-mini': mini }">
    <span class="rahmen">
      <img :src="image" :alt="name" loading="lazy" />
    </span>
    <template v-if="!mini">
      <b>{{ brand }}</b>
      <span class="name">{{ name }}</span>
    </template>
    <span class="preis">{{ format(price) }}</span>
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
  min-width: 0;
  text-decoration: none;
  font-size: 13px;
  line-height: 1.4;
}
.rahmen {
  display: block;
  overflow: hidden;
  margin-bottom: 10px;
  background: #ece7df;
}
.rahmen img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
  transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
}
@media (hover: hover) and (pointer: fine) {
  .arizona-magazine-product:hover .rahmen img {
    transform: scale(1.04);
  }
  .arizona-magazine-product:hover .name {
    color: #1a1a1a;
  }
}
b {
  display: block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.name {
  display: block;
  color: #6f6a63;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 200ms ease;
}
.preis {
  display: block;
  margin-top: 2px;
  font-weight: 600;
}
.is-mini {
  font-size: 11px;
}
.is-mini .rahmen {
  margin-bottom: 4px;
}
.is-mini .preis {
  margin: 0;
  font-weight: 500;
  color: #6f6a63;
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
