<template>
  <NuxtLink :id="post.slug" :to="postPath" class="karte mag-press-soft">
    <img class="karte-bild" :src="post.bild" :alt="post.titel" loading="lazy" />
    <span class="karte-verlauf" aria-hidden="true" />
    <span class="karte-oben">
      <span class="pille pille-glas">{{ post.art === 'Tipp' ? 'Tipp' : 'News' }}</span>
      <span v-if="products?.length" class="pille pille-glas">{{ products.length }} Teile</span>
    </span>
    <span class="karte-unten">
      <span class="karte-thema">{{ post.thema }} · {{ arizonaMagazineDate(post.datum) }}</span>
      <span class="karte-titel anzeige">{{ post.headline }}</span>
      <span class="karte-text">{{ post.text }}</span>
      <span class="karte-weiter">Weiterlesen <span class="pfeil" aria-hidden="true">→</span></span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { arizonaMagazineDate, arizonaMagazinePostPath } from '~/composables/useArizonaMagazine/useArizonaMagazine';
import type { ArizonaMagazineCardProps } from './types';

// Arizona: a magazine post as an image card with the text on the picture (styles in assets/magazine.css).
const props = defineProps<ArizonaMagazineCardProps>();
const localePath = useLocalizedPath();
const postPath = computed(() => localePath(arizonaMagazinePostPath(props.post.slug)));
</script>
