<template>
  <figure v-if="overviewImage" class="mt-6" data-testid="product-overview-image">
    <figcaption class="mb-2 flex items-baseline justify-between gap-3">
      <span class="font-semibold">Alle Farben auf einen Blick</span>
      <span v-if="colorCount > 1" class="typography-text-sm text-neutral-600">In {{ colorCount }} Farben erhältlich</span>
    </figcaption>
    <button
      type="button"
      class="block w-full overflow-hidden rounded-lg bg-[#F3F3F3] focus-visible:outline focus-visible:outline-2"
      :aria-label="colorCount > 1 ? 'Zur Farbauswahl springen' : 'Bild ansehen'"
      @click="scrollToColors"
    >
      <NuxtImg
        :src="overviewImage.urlMiddle || overviewImage.url"
        :alt="alt"
        width="700"
        height="700"
        loading="lazy"
        class="aspect-square w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-[1.02]"
      />
    </button>
    <p v-if="colorCount > 1" class="mt-2 typography-text-sm text-neutral-600">
      Farbe gefunden? Einfach oben auswählen – Versand mit DHL für 4,90 €, 60 Tage kostenlose Rückgabe.
    </p>
  </figure>
</template>

<script setup lang="ts">
import type { ArizonaProductOverviewImageProps } from './types';

/**
 * Arizona: shows the item's first gallery image (position 0 – usually the supplier's overview collage with all colours,
 * which the variation gallery leaves out) in the free space below the purchase area, as a nudge to explore the colours.
 */
const props = defineProps<ArizonaProductOverviewImageProps>();

const COLOR_ATTRIBUTE_ID = 2;

const overviewImage = computed(() => {
  const all = props.product.images?.all ?? [];
  const first = all.find((image) => Number(image.position) === 0) ?? all[0];
  if (!first) return undefined;
  const inVariationGallery = (props.product.images?.variation ?? []).some(
    (image) => image.cleanImageName === first.cleanImageName,
  );
  // only square overview images (the collage format), not a regular product photo that is already in the gallery
  const isSquare = Number(first.width) > 0 && Number(first.width) === Number(first.height);
  return !inVariationGallery && isSquare ? first : undefined;
});

const colorCount = computed(
  () =>
    props.product.variationAttributeMap?.attributes?.find((attribute) => attribute.attributeId === COLOR_ATTRIBUTE_ID)
      ?.values?.length ?? 0,
);

const alt = computed(() => `${getBrandName(props.product)} ${getDisplayName(props.product)} – alle Farben`.trim());

const scrollToColors = () => {
  document
    .getElementById(`attribute-${COLOR_ATTRIBUTE_ID}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
</script>
