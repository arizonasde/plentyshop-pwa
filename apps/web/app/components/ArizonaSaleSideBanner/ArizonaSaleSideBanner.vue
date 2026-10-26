<template>
  <aside
    class="relative mb-6 flex min-h-[38rem] flex-col justify-end overflow-hidden rounded-2xl bg-neutral-900 text-white @md:sticky @md:top-4"
    data-testid="sale-side-banner"
  >
    <img
      :src="IMAGE"
      alt="Frau in warmer Winterjacke beim Spaziergang an der Strandpromenade"
      class="absolute inset-0 size-full object-cover object-top"
      loading="eager"
      width="600"
      height="900"
    />
    <span class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/0" aria-hidden="true" />

    <span
      class="absolute left-5 top-5 rounded-full bg-[#C8102E] px-3 py-1 text-xs font-bold uppercase tracking-widest"
    >
      Herbst-Deals
    </span>

    <div class="relative px-6 pb-7">
      <p class="text-7xl font-black leading-none tracking-tight">SALE</p>
      <p class="mt-3 text-xl font-semibold leading-snug">Reduzierte Lieblingsstücke für die kalte Jahreszeit</p>
      <p class="mt-2 typography-text-sm text-white/80">Jacken, Strick, Kleider und mehr zu reduzierten Preisen.</p>
      <p class="mt-5 flex items-center gap-2 typography-text-sm font-semibold">
        <span class="size-1.5 shrink-0 rounded-full bg-[#C8102E]" aria-hidden="true" />
        Nur solange der Vorrat reicht
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
/**
 * Arizona: tall photo banner in the left column of the SALE page, where other categories show their category tree.
 * Stays in view while scrolling through the items.
 */
const IMAGE =
  'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-startseite/arizona-jacken-sport-damen-1-600.webp';
</script>
