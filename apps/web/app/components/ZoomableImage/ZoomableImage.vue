<template>
  <div
    ref="containerReference"
    class="w-full h-full relative flex items-center justify-center snap-center snap-always basis-full shrink-0 grow gallery-image"
  >
    <div
      v-if="showZoomHint && isMobile"
      class="zoom-hint absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded z-editor-inline"
    >
      {{ t('product.doubleTapZoom') }}
    </div>

    <template v-if="!isMobile && imagesLoaded[`gallery-img-${index}`]">
      <NuxtImg
        v-if="disableZoom"
        v-bind="nuxtImgProps"
        :data-testid="`product-image-${index}`"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @load="updateImageStatusFor(`gallery-img-${index}`)"
      />

      <Drift v-else :key="route.fullPath" :index="index">
        <NuxtImg
          v-bind="nuxtImgProps"
          :data-testid="`product-image-${index}`"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @load="updateImageStatusFor(`gallery-img-${index}`)"
        />
      </Drift>
    </template>

    <NuxtImg
      v-else
      v-bind="nuxtImgProps"
      :data-testid="`product-image-${index}`"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @load="updateImageStatusFor(`gallery-img-${index}`)"
    />

    <SfLoaderCircular v-if="!imagesLoaded[`gallery-img-${index}`]" class="absolute" size="sm" />
  </div>
</template>

<script setup lang="ts">
import { productImageGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { ImagesData } from '@plentymarkets/shop-api';
import type { ZoomableImageProps } from '~/components/ZoomableImage/types';

const props = defineProps<ZoomableImageProps>();

const containerReference = useTemplateRef<null>('containerReference');
const imagesLoaded = ref([] as unknown as { [key: string]: boolean });

const { isZoomed, imageStyle, onTouchStart, onTouchMove, onTouchEnd } = useImageZoom(containerReference);
const viewport = useViewport();
const route = useRoute();

const image = computed(() => props.image);
const index = computed(() => props.index);
const activeIndex = computed(() => props.activeIndex);
const isFirstImage = computed(() => props.isFirstImage);
const isMobile = computed(() => viewport.isLessThan('lg'));

const showZoomHint = ref(false);

const imageUrl = productImageGetters.getImageUrl(image.value);
// Arizona: describe the image with brand, name and colour instead of its file name
const { currentProduct } = useProducts();
const imageAlt = Object.keys(currentProduct.value).length
  ? buildProductImageAlt(currentProduct.value, productImageGetters.getImageAlternate(image.value), index.value)
  : productImageGetters.getImageAlternate(image.value) || productImageGetters.getCleanImageName(image.value) || '';
const imageTitle = imageAlt;

// Arizona: real widths of the plentyONE image sizes in this system – "middle" fits into 700 × 700 px (485 px wide
// for portrait photos), "secondPreview" into 800 × 1111 px (set on 25.10.2026 for phones), "preview" is only 139 px.
const MIDDLE_IMAGE_WIDTH = 485;
const SECOND_PREVIEW_IMAGE_WIDTH = 800;

const getSourceSet = (image: ImagesData) => {
  const middle = productImageGetters.getImageUrlMiddle(image);
  const secondPreview = productImageGetters.getImageUrlSecondPreview(image);
  const full = productImageGetters.getImageUrl(image);
  const fullWidth = productImageGetters.getImageWidth(image) || 1600;

  return `
    ${middle} ${MIDDLE_IMAGE_WIDTH}w,
    ${secondPreview} ${SECOND_PREVIEW_IMAGE_WIDTH}w,
    ${full} ${fullWidth}w
  `;
};

const computedWidth = computed(() => {
  const imageWidth = productImageGetters.getImageWidth(image.value) || 600;
  return imageUrl.includes(defaults.IMAGE_LINK_SUFIX) ? imageWidth : '';
});

const computedHeight = computed(() => {
  const imageHeight = productImageGetters.getImageHeight(image.value) || 600;
  return imageUrl.includes(defaults.IMAGE_LINK_SUFIX) ? imageHeight : '';
});

const nuxtImgProps = computed<Record<string, unknown>>(() => ({
  id: `gallery-img-${index.value}`,
  alt: imageAlt,
  title: imageTitle,
  'aria-hidden': activeIndex.value !== index.value,
  src: productImageGetters.getImageUrl(image.value),
  fit: 'fill',
  class: isMobile.value
    ? { 'object-contain h-full w-full': true, zoomed: isZoomed.value }
    : { 'object-contain h-full w-full': true, [`demo-trigger-${index.value}`]: true },
  'data-zoom': imageUrl,
  quality: 80,
  srcset: getSourceSet(image.value),
  // Arizona: real display width of the gallery (full width on phones, about half the page on large screens)
  sizes: '2xs:100vw md:50vw xl:640px',
  draggable: 'false',
  loading: isFirstImage.value ? 'eager' : 'lazy',
  fetchpriority: isFirstImage.value ? 'high' : 'auto',
  width: computedWidth.value,
  height: computedHeight.value,
  style: isMobile.value ? imageStyle.value : '',
}));

const updateImageStatusFor = (imageId: string) => {
  if (!imagesLoaded.value[imageId]) imagesLoaded.value[imageId] = true;
};

onMounted(() => {
  nextTick(() => {
    for (const [index] of props.images.entries()) {
      const myImg: HTMLImageElement | null = document.querySelector(`#gallery-img-${index}`);
      const imgId = String(myImg?.id);
      if (!imagesLoaded.value[imgId]) imagesLoaded.value[imgId] = Boolean(myImg?.complete);
    }
  });

  if (isMobile.value) {
    showZoomHint.value = true;
    setTimeout(() => {
      showZoomHint.value = false;
    }, 3000);
  }
});
</script>
