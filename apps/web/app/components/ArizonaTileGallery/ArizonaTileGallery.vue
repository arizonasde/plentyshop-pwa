<template>
  <div data-testid="tile-gallery">
    <!-- Arizona: image tiles like large fashion shops – two large images, then rows of three; keeps a clear gap to the
         purchase column on the right -->
    <div class="relative grid grid-cols-6 gap-1 @md:mr-6 @lg:mr-12 @xl:mr-16">
      <button
        type="button"
        class="absolute left-3 top-3 z-raised flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white"
        aria-label="Zurück zur Übersicht"
        data-testid="tile-gallery-back"
        @click="goBack"
      >
        <SfIconChevronLeft size="sm" />
      </button>
      <button
        v-for="(image, index) in images"
        :key="productImageGetters.getImageUrl(image)"
        type="button"
        class="relative overflow-hidden bg-[#F3F3F3] cursor-zoom-in focus-visible:outline focus-visible:outline-2"
        :class="index < 2 ? 'col-span-3' : 'col-span-2'"
        :aria-label="`${altOf(image, index)} – Großansicht öffnen`"
        @click="openViewer(index)"
      >
        <NuxtImg
          :src="index < 2 ? productImageGetters.getImageUrlSecondPreview(image) : productImageGetters.getImageUrlMiddle(image)"
          :alt="altOf(image, index)"
          :loading="index < 2 ? 'eager' : 'lazy'"
          class="aspect-[3/4] w-full object-cover mix-blend-multiply transition-transform duration-300 hover:scale-[1.03]"
          :width="index < 2 ? 800 : 485"
          :height="index < 2 ? 1067 : 647"
        />
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="viewerIndex !== null"
        class="fixed inset-0 z-modal flex bg-white"
        role="dialog"
        aria-modal="true"
        aria-label="Großansicht der Produktbilder"
        data-testid="tile-gallery-viewer"
      >
        <ul class="hidden @md:flex w-20 shrink-0 flex-col gap-2 overflow-y-auto p-3">
          <li v-for="(image, index) in images" :key="`thumb-${index}`">
            <button
              type="button"
              class="block w-full border bg-[#F3F3F3]"
              :class="index === viewerIndex ? 'border-neutral-900' : 'border-transparent hover:border-neutral-400'"
              :aria-label="`Bild ${index + 1} anzeigen`"
              @click="viewerIndex = index"
            >
              <NuxtImg
                :src="productImageGetters.getImageUrlPreview(image)"
                :alt="altOf(image, index)"
                class="aspect-[3/4] w-full object-cover mix-blend-multiply"
                width="70"
                height="93"
              />
            </button>
          </li>
        </ul>

        <div class="relative flex flex-1 items-center justify-center">
          <NuxtImg
            :key="viewerIndex"
            :src="productImageGetters.getImageUrl(images[viewerIndex]!)"
            :alt="altOf(images[viewerIndex]!, viewerIndex)"
            class="max-h-screen max-w-full object-contain"
          />
          <button
            type="button"
            class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow hover:bg-[#F3F3F3]"
            aria-label="Vorheriges Bild"
            @click="step(-1)"
          >
            <SfIconChevronLeft />
          </button>
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow hover:bg-[#F3F3F3]"
            aria-label="Nächstes Bild"
            @click="step(1)"
          >
            <SfIconChevronRight />
          </button>
          <button
            type="button"
            class="absolute right-3 top-3 rounded-full p-2 hover:bg-[#F3F3F3]"
            aria-label="Großansicht schließen"
            data-testid="tile-gallery-close"
            @click="closeViewer"
          >
            <SfIconClose />
          </button>
          <p class="absolute bottom-3 left-1/2 -translate-x-1/2 typography-text-sm text-neutral-600">
            {{ viewerIndex + 1 }} / {{ images.length }}
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productImageGetters, type ImagesData } from '@plentymarkets/shop-api';
import { SfIconChevronLeft, SfIconChevronRight, SfIconClose } from '@storefront-ui/vue';
import type { ArizonaTileGalleryProps } from './types';

const props = defineProps<ArizonaTileGalleryProps>();

const { currentProduct } = useProducts();
const viewerIndex = ref<number | null>(null);

const altOf = (image: ImagesData, index: number) =>
  Object.keys(currentProduct.value).length
    ? buildProductImageAlt(currentProduct.value, productImageGetters.getImageAlternate(image), index)
    : productImageGetters.getImageAlternate(image) || productImageGetters.getCleanImageName(image) || '';

// back to the list the shopper came from; without a previous page in this tab, to the item's category
const router = useRouter();
const localePath = useLocalizedPath();
const goBack = () => {
  if (import.meta.client && window.history.state?.back) {
    router.back();
    return;
  }
  const path = productGetters.getUrlPath(currentProduct.value).split('/').slice(0, -1).join('/');
  navigateTo(localePath(path ? `/${path}` : '/'));
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeViewer();
  if (event.key === 'ArrowRight') step(1);
  if (event.key === 'ArrowLeft') step(-1);
};

const openViewer = (index: number) => {
  viewerIndex.value = index;
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKeydown);
};

const closeViewer = () => {
  viewerIndex.value = null;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
};

const step = (direction: number) => {
  if (viewerIndex.value === null || props.images.length === 0) return;
  viewerIndex.value = (viewerIndex.value + direction + props.images.length) % props.images.length;
};

onBeforeUnmount(closeViewer);
</script>
