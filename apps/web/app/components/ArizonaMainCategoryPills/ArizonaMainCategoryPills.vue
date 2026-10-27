<template>
  <nav aria-label="Hauptkategorien" data-testid="arizona-main-category-pills">
    <ul class="flex items-center gap-1">
      <li v-for="node in tree" :key="node.id">
        <NuxtLink
          :to="linkOf(node)"
          class="inline-flex items-center rounded-full px-4 py-2 font-semibold text-base whitespace-nowrap transition-colors"
          :class="
            isActive(node)
              ? isSale(node)
                ? 'bg-[#C8102E] text-white hover:bg-[#A50D26]'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
              : isSale(node)
                ? 'text-[#C8102E] hover:bg-[#FDECEE] active:bg-[#F9D3D8]'
                : 'text-neutral-900 hover:bg-[#F3F3F3] active:bg-neutral-300'
          "
          :aria-current="isActive(node) ? 'true' : undefined"
        >
          {{ categoryTreeGetters.getName(node) }}
        </NuxtLink>
      </li>
      <!-- Arizona: the magazine "Trends & Tipps" next to the main categories -->
      <li>
        <NuxtLink
          :to="localePath('/magazin')"
          class="inline-flex items-center rounded-full px-4 py-2 font-semibold text-base whitespace-nowrap transition-colors"
          :class="isMagazine ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'text-neutral-900 hover:bg-[#F3F3F3]'"
          :aria-current="isMagazine ? 'page' : undefined"
          data-testid="arizona-main-category-magazine"
        >
          Magazin
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/shop-api';
import { ARIZONA_SALE_CATEGORY_ID } from '~/utils/arizonaCategoryTexts';

// Arizona: main categories as pills in the header row, left of the centred logo (large fashion shop pattern).
const { tree, linkOf, currentMainCategory } = useArizonaMainCategory();
// SALE is highlighted in red instead of black
const isSale = (node: { id: number }) => node.id === ARIZONA_SALE_CATEGORY_ID;
const localePath = useLocalizedPath();
const route = useRoute();
const isMagazine = computed(() => route.path.startsWith(localePath('/magazin')));
// on the magazine only the magazine pill is highlighted
const isActive = (node: { id: number }) => !isMagazine.value && node.id === currentMainCategory.value?.id;
</script>
