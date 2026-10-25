<template>
  <div class="px-4 @md:px-6 max-w-screen-3xl mx-auto" data-testid="footer-highlights">
    <ul class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-3 @md:gap-4">
      <li
        v-for="highlight in highlights"
        :key="highlight.title"
        class="flex items-start gap-4 rounded-2xl bg-white px-5 py-5 @md:py-6"
      >
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#F3F3F3]" aria-hidden="true">
          <svg
            class="size-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path v-for="path in highlight.icon" :key="path" :d="path" />
          </svg>
        </span>
        <span class="min-w-0">
          <span class="flex flex-wrap items-center gap-2 font-semibold typography-text-sm @md:typography-text-base">
            {{ highlight.title }}
            <ArizonaDhlBadge v-if="highlight.dhl" />
          </span>
          <span class="mt-1 block typography-text-sm text-neutral-600">{{ highlight.text }}</span>
        </span>
      </li>
    </ul>
    <div class="mt-4 flex justify-center">
      <ArizonaTrustBadge />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Arizona: row of service highlights with line icons at the top of the footer
 * (shipping with DHL, returns, payment, customer service).
 */
const highlights = [
  {
    title: 'Versand mit DHL',
    text: '4,90 € pro Bestellung, in 1–3 Werktagen bei dir',
    dhl: true,
    // truck
    icon: [
      'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2',
      'M15 18H9',
      'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14',
      'M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
      'M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    ],
  },
  {
    title: '60 Tage Rückgabe',
    text: 'Kostenlos zurückschicken, ganz ohne Stress',
    // rotate-ccw
    icon: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
  },
  {
    title: 'Sicher bezahlen',
    text: 'PayPal, SEPA-Lastschrift oder giropay',
    // shield-check
    icon: [
      'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
      'm9 12 2 2 4-4',
    ],
  },
  {
    title: 'Persönlicher Service',
    text: 'Telefon 06241 / 5003701 oder über das Kontaktformular',
    // headset
    icon: [
      'M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3',
    ],
  },
];
</script>
