<template>
  <nav aria-label="Hauptkategorien" data-testid="arizona-main-category-pills">
    <ul class="flex items-center gap-1">
      <li v-for="node in tree" :key="node.id">
        <NuxtLink
          :to="linkOf(node)"
          class="inline-flex items-center rounded-full px-4 py-2 font-semibold text-base whitespace-nowrap transition-colors"
          :class="
            node.id === currentMainCategory?.id
              ? 'bg-neutral-900 text-white hover:bg-neutral-800'
              : 'text-neutral-900 hover:bg-[#F3F3F3] active:bg-neutral-300'
          "
          :aria-current="node.id === currentMainCategory?.id ? 'true' : undefined"
        >
          {{ categoryTreeGetters.getName(node) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { categoryTreeGetters } from '@plentymarkets/shop-api';

// Arizona: main categories as pills in the header row, left of the centred logo (large fashion shop pattern).
const { tree, linkOf, currentMainCategory } = useArizonaMainCategory();
</script>
