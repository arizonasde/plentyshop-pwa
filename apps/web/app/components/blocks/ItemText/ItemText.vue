<template>
  <div :style="inlineStyle" data-testid="item-text-block">
    <div v-if="displayAsCollapsable">
      <UiAccordionItem
        v-if="text"
        v-model="initiallyCollapsed"
        summary-class="@md:rounded-md w-full hover:bg-neutral-100 py-2 flex justify-between items-center select-none"
        content-padding-class=""
        data-testid="item-text"
      >
        <template #summary>
          <h2 class="font-bold text-lg leading-6 @md:text-2xl">
            {{ content.text.title }}
          </h2>
        </template>
        <!-- Arizona: original logo of the manufacturer above the description -->
        <ArizonaBrandLogo class="mb-4" />
        <div
          v-if="text"
          data-testid="item-text-innertext"
          class="no-preflight [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
          v-html="text"
        />
        <p v-if="manufacturerNumber" class="mt-4 typography-text-sm" data-testid="item-text-manufacturer-number">
          <span class="font-semibold">Herstellernummer:</span> {{ manufacturerNumber }}
        </p>
      </UiAccordionItem>
      <UiDivider v-if="initiallyCollapsed && text?.length" class="mb-2 mt-2" />
    </div>
    <div v-else>
      <h2 class="font-bold text-lg leading-6 @md:text-2xl">
        {{ content.text.title }}
      </h2>
      <ArizonaBrandLogo class="mb-4" />
      <div v-if="text" class="no-preflight [&>p:first-child]:mt-0 [&>p:last-child]:mb-0" v-html="text" />
      <p v-if="manufacturerNumber" class="mt-4 typography-text-sm" data-testid="item-text-manufacturer-number">
        <span class="font-semibold">Herstellernummer:</span> {{ manufacturerNumber }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { ItemTextProps } from './types';
import { getArizonaManufacturerNumber } from '~/utils/arizonaManufacturerNumber';

const props = defineProps<ItemTextProps>();
const initiallyCollapsed = computed(() => !props.content?.layout.initiallyCollapsed);
const displayAsCollapsable = computed(() => props.content?.layout.displayAsCollapsable);
const { currentProduct } = useProducts();
const content = computed(() => props.content);
const text = computed(() => productGetters.getDescription(currentProduct.value));
// Arizona: manufacturer number below the description (moved here from the purchase area)
const manufacturerNumber = computed(() => getArizonaManufacturerNumber(currentProduct.value));
const inlineStyle = computed(() => {
  const layout = props.content?.layout || {};
  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});

const { registerBlockVisibility } = useBlocksVisibility();

watch(
  text,
  (newText) => {
    registerBlockVisibility(props.meta.uuid, newText?.length > 0);
  },
  { immediate: true },
);
</script>
