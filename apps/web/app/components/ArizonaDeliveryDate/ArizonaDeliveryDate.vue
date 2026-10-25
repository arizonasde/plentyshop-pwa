<template>
  <p class="flex items-center gap-2 typography-text-sm font-medium text-positive-700" data-testid="delivery-date">
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
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
    <span v-if="promise">
      Lieferung <strong>{{ promise.day }}</strong>.
      <span class="font-normal text-neutral-700">Bestellung innerhalb {{ promise.orderWithin }}</span>
    </span>
    <span v-else>Lieferung in 1–3 Werktagen</span>
  </p>
</template>

<script setup lang="ts">
import { getArizonaDeliveryPromise } from '~/utils/arizonaDelivery';

/**
 * Arizona: earliest delivery day with the time left to order for it on the product page, e.g.
 * "Lieferung Morgen, 26. Oktober. Bestellung innerhalb 29 Min." (see utils/arizonaDelivery.ts). Rendered with the
 * generic wording on the server and replaced in the browser, where the time is current.
 */
const promise = ref<ReturnType<typeof getArizonaDeliveryPromise>>();
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  const update = () => (promise.value = getArizonaDeliveryPromise());
  update();
  timer = setInterval(update, 30_000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
