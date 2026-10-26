<template>
  <div class="grid gap-3 @md:grid-cols-2" data-testid="sale-banners">
    <NuxtLink
      v-for="banner in banners"
      :key="banner.title"
      :to="{ path: route.path, query: { facets: banner.facets } }"
      class="group relative flex min-h-[9.5rem] overflow-hidden rounded-xl px-6 py-5 text-white"
      :class="banner.background"
    >
      <svg
        class="pointer-events-none absolute -right-6 -top-6 size-40 opacity-20 transition-transform duration-500 group-hover:rotate-12"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path :d="LEAF" />
      </svg>
      <svg
        class="pointer-events-none absolute -bottom-8 right-24 size-24 rotate-45 opacity-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path :d="LEAF" />
      </svg>
      <span class="relative flex flex-col justify-between gap-3">
        <span>
          <span class="block text-xs font-semibold uppercase tracking-widest opacity-90">{{ banner.eyebrow }}</span>
          <span class="mt-1 block text-2xl @md:text-3xl font-bold leading-tight">{{ banner.title }}</span>
          <span class="mt-1 block typography-text-sm opacity-90">{{ banner.text }}</span>
        </span>
        <span
          class="inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-1.5 typography-text-sm font-semibold text-neutral-900 group-hover:bg-neutral-100"
        >
          {{ banner.cta }} →
        </span>
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
/**
 * Arizona: two medium banners on the SALE page that point to autumn deals. They filter the SALE page by category
 * via the "Kategorie" facet (IDs of the facet values in plentyONE: 113 Jacken, 108 Pullover, 114 Strickjacken,
 * 119 Kleider).
 */
const route = useRoute();
const LEAF = 'M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z';

const banners = [
  {
    eyebrow: 'Herbst-Deals',
    title: 'Jacken & Strick reduziert',
    text: 'Warm eingepackt in die kalte Jahreszeit – nur solange der Vorrat reicht.',
    cta: 'Jetzt entdecken',
    facets: '113,108,114',
    background: 'bg-gradient-to-br from-[#7C2D12] via-[#B45309] to-[#D97706]',
  },
  {
    eyebrow: 'Herbst-Deals',
    title: 'Kleider im Sale',
    text: 'Lieblingskleider für Herbsttage zu reduzierten Preisen.',
    cta: 'Kleider ansehen',
    facets: '119',
    background: 'bg-gradient-to-br from-[#3F1D2B] via-[#7F1D1D] to-[#B91C1C]',
  },
];
</script>
