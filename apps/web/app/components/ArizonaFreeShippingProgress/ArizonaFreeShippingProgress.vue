<template>
  <div v-if="visible" class="rounded-lg bg-neutral-100 px-4 py-3 text-sm" data-testid="arizona-free-shipping-progress">
    <p v-if="progress.reached" class="flex items-center gap-2 font-medium text-positive-700">
      <SfIconCheck size="sm" aria-hidden="true" />
      Super, dein Versand ist kostenlos!
    </p>
    <p v-else>
      Noch <b>{{ format(progress.remaining) }}</b> bis zum <b>kostenlosen Versand</b>
    </p>
    <div
      class="mt-2 h-2 overflow-hidden rounded-full bg-neutral-300"
      role="progressbar"
      :aria-valuenow="progress.percent"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`Kostenloser Versand ab ${format(ARIZONA_FREE_SHIPPING_FROM)}`"
    >
      <div
        class="h-full rounded-full transition-[width] duration-500"
        :class="progress.reached ? 'bg-positive-700' : 'bg-neutral-900'"
        :style="{ width: `${progress.percent}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCheck } from '@storefront-ui/vue';
import {
  ARIZONA_FREE_SHIPPING_COUNTRY_ID,
  ARIZONA_FREE_SHIPPING_FROM,
  getArizonaFreeShippingProgress,
} from '~/utils/arizonaShipping';
import type { ArizonaFreeShippingProgressProps } from './types';

// Arizona: shows how much is left until free shipping (Germany only, see utils/arizonaShipping).
const props = defineProps<ArizonaFreeShippingProgressProps>();
const { format } = usePriceFormatter();

const visible = computed(() => {
  const countryId = Number(props.cart?.shippingCountryId) || ARIZONA_FREE_SHIPPING_COUNTRY_ID;
  return countryId === ARIZONA_FREE_SHIPPING_COUNTRY_ID && (props.cart?.items?.length ?? 0) > 0;
});
const progress = computed(() => getArizonaFreeShippingProgress(props.cart?.itemSum ?? 0));
</script>
