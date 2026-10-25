<template>
  <ul class="space-y-2 typography-text-sm text-neutral-900" data-testid="service-promises">
    <li v-for="promise in servicePromises" :key="promise" class="flex items-center gap-2">
      <SfIconCheck size="sm" class="text-positive-700 shrink-0" aria-hidden="true" />
      {{ promise }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { SfIconCheck } from '@storefront-ui/vue';

// Arizona service promises, shown next to every buying decision (product page, cart). The delivery promise names the
// concrete days once the page runs in the browser.
const deliveryPromise = ref('Lieferung in 1–2 Werktagen');
onMounted(() => (deliveryPromise.value = `Lieferung voraussichtlich ${formatArizonaDeliveryWindow()}`));

const servicePromises = computed(() => [
  'Versand mit DHL für 4,90 €',
  deliveryPromise.value,
  'Bezahlen mit PayPal, SEPA-Lastschrift oder giropay',
  '60 Tage kostenlose Rückgabe',
]);
</script>
