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

// Arizona service promises, shown next to every buying decision (product page, cart).
const servicePromises = [
  'Gratis Versand und Rückversand',
  'Lieferung in 1–2 Werktagen',
  'Kauf auf Rechnung',
  '60 Tage Rückgaberecht',
];
</script>
