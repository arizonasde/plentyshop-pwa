<template>
  <ClientOnly>
    <p
      v-if="message"
      class="flex items-center gap-2 rounded-lg bg-[#FFF8D6] px-3 py-2.5 typography-text-sm text-neutral-900"
      data-testid="shipping-countdown"
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
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span>
        <template v-if="message.today">
          Bestellst du in den nächsten <strong>{{ message.remaining }}</strong>, verschicken wir noch
          <strong>heute</strong> mit DHL.
        </template>
        <template v-else>
          Jetzt bestellen – Versand <strong>{{ message.day }}</strong> mit DHL.
        </template>
      </span>
    </p>
  </ClientOnly>
</template>

<script setup lang="ts">
/**
 * Arizona: countdown on the product page – orders placed Monday to Friday before 12:00 (German time) are shipped the
 * same day, later orders on the next working day (see utils/arizonaDelivery.ts, including public holidays).
 */
const now = ref(new Date());
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 30_000);
});
onBeforeUnmount(() => clearInterval(timer));

const message = computed(() => {
  const shipping = getArizonaShipping(now.value);
  if (shipping.shipsToday) {
    const hours = Math.floor(shipping.minutesLeft / 60);
    const minutes = shipping.minutesLeft % 60;
    return { today: true, remaining: hours > 0 ? `${hours} Std. ${minutes} Min.` : `${minutes} Min.` };
  }
  return { today: false, day: shipping.shippingDayLabel };
});
</script>
