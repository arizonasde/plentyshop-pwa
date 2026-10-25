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
 * same day; later orders on the next working day. Public holidays are not taken into account.
 */
const CUTOFF_HOUR = 12;
const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

const now = ref(new Date());
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => (now.value = new Date()), 30_000);
});
onBeforeUnmount(() => clearInterval(timer));

/** Weekday, hour and minute in Germany, independent of the visitor's time zone. */
const germanTime = (date: Date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday ?? '');
  return { weekday, hour: Number(parts.hour), minute: Number(parts.minute) };
};

const message = computed(() => {
  const { weekday, hour, minute } = germanTime(now.value);
  const isWorkingDay = weekday >= 1 && weekday <= 5;

  if (isWorkingDay && hour < CUTOFF_HOUR) {
    const minutesLeft = (CUTOFF_HOUR - hour) * 60 - minute;
    const hours = Math.floor(minutesLeft / 60);
    const minutes = minutesLeft % 60;
    const remaining = hours > 0 ? `${hours} Std. ${minutes} Min.` : `${minutes} Min.`;
    return { today: true, remaining };
  }

  let next = (weekday + 1) % 7;
  while (next === 0 || next === 6) next = (next + 1) % 7;
  const day = next === (weekday + 1) % 7 ? 'morgen' : `am ${WEEKDAYS[next]}`;
  return { today: false, day };
});
</script>
