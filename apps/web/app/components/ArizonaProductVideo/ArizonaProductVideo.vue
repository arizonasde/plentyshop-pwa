<template>
  <!-- Arizona: KI-Produktvideo (ohne Ton) – nur wenn für die Variante eines hinterlegt ist -->
  <div v-if="entry" class="relative overflow-hidden bg-[#F3F3F3]" data-testid="product-video">
    <video
      :key="entry.video"
      :src="entry.video"
      :poster="entry.poster"
      class="aspect-[3/4] w-full object-cover"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      aria-label="Produktvideo"
    />
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';

const { currentProduct } = useProducts();
const { load, videoFor } = useArizonaProductVideo();

onMounted(load);

const entry = computed(() =>
  Object.keys(currentProduct.value ?? {}).length ? videoFor(productGetters.getVariationId(currentProduct.value)) : null,
);
</script>
