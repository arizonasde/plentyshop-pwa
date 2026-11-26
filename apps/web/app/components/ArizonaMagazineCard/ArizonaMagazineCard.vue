<template>
  <article :id="post.slug" class="karte">
    <NuxtLink :to="postPath" class="bildrahmen mag-press-soft" tabindex="-1" aria-hidden="true">
      <img class="bild" :src="post.bild" :alt="post.titel" loading="lazy" />
      <span class="marke">{{ post.art === 'Tipp' ? 'Tipp' : 'News' }}</span>
    </NuxtLink>
    <div class="kicker">{{ post.thema }} · {{ arizonaMagazineDate(post.datum) }}</div>
    <h4 class="serif">
      <NuxtLink :to="postPath">{{ post.headline }}</NuxtLink>
    </h4>
    <p>{{ post.text }}</p>
    <NuxtLink :to="postPath" class="weiter">Weiterlesen <span class="pfeil" aria-hidden="true">→</span></NuxtLink>
    <div v-if="products?.length" class="mini">
      <ArizonaMagazineProduct
        v-for="product in products.slice(0, 4)"
        :key="productGetters.getVariationId(product)"
        :product="product"
        mini
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { arizonaMagazineDate, arizonaMagazinePostPath } from '~/composables/useArizonaMagazine/useArizonaMagazine';
import type { ArizonaMagazineCardProps } from './types';

// Arizona: a news or tip card on the magazine pages (styles in assets/magazine.css).
const props = defineProps<ArizonaMagazineCardProps>();
const localePath = useLocalizedPath();
const postPath = computed(() => localePath(arizonaMagazinePostPath(props.post.slug)));
</script>
