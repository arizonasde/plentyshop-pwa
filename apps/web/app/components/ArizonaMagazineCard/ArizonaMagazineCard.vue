<template>
  <article :id="post.slug" class="karte">
    <NuxtLink :to="postPath">
      <img class="bild" :src="post.bild" :alt="post.titel" loading="lazy" />
    </NuxtLink>
    <div class="kicker">{{ post.art }}</div>
    <h4 class="serif">
      <NuxtLink :to="postPath">{{ post.headline }}</NuxtLink>
    </h4>
    <p>{{ post.text }}</p>
    <NuxtLink v-if="post.kategorie" class="mehr" :to="localePath(post.kategorie)">Zum Shop</NuxtLink>
    <div v-if="products.length" class="mini">
      <ArizonaMagazineProduct
        v-for="product in products"
        :key="productGetters.getVariationId(product)"
        :product="product"
        mini
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { arizonaMagazinePostPath } from '~/composables/useArizonaMagazine/useArizonaMagazine';
import type { ArizonaMagazineCardProps } from './types';

// Arizona: a news or tip card on the magazine page (styles in assets/magazine.css).
const props = defineProps<ArizonaMagazineCardProps>();
const localePath = useLocalizedPath();
const postPath = computed(() => localePath(arizonaMagazinePostPath(props.post.slug)));
</script>
