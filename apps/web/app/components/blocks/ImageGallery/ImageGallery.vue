<template>
  <!-- Arizona: image tiles with a large view on tablets and desktops, the swipe gallery stays on phones -->
  <section v-if="viewport.isGreaterOrEquals('md')" class="grid-in-left-top">
    <ArizonaTileGallery :images="addModernImageExtensionForGallery(productGetters.getGallery(currentProduct))" />
  </section>
  <section v-else class="grid-in-left-top @md:h-full @xl:max-h-[700px]">
    <Gallery
      :images="addModernImageExtensionForGallery(productGetters.getGallery(currentProduct))"
      :configuration="content"
    />
  </section>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ImageGalleryProps } from '~/components/blocks/ImageGallery/types';

const { addModernImageExtensionForGallery } = useModernImage();

defineProps<ImageGalleryProps>();
const { currentProduct } = useProducts();
const viewport = useViewport();
</script>
