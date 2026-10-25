<template>
  <p
    v-if="pieces >= MIN_PIECES"
    class="flex items-center gap-2 typography-text-sm font-medium text-[#C2410C]"
    data-testid="bestseller-hint"
  >
    <svg
      class="size-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"
      />
    </svg>
    <span>Beliebt: In den letzten 7 Tagen {{ pieces }}-mal gekauft</span>
  </p>
</template>

<script setup lang="ts">
import type { ArizonaBestsellerHintProps } from './types';

/** Arizona: "popular" hint on the product page from the real sales of the last 7 days (all channels). */
const MIN_PIECES = 10;
const props = defineProps<ArizonaBestsellerHintProps>();
const { bestseller } = useArizonaShopFacts();
const pieces = computed(() => bestseller.value?.[String(props.itemId)] ?? 0);
</script>
