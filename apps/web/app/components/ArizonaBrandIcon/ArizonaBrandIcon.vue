<template>
  <!-- Arizona: small marks for brand pages – a plain trident (not the official insignia) and the Swiss cross -->
  <svg v-if="name === 'swiss'" viewBox="0 0 32 32" aria-hidden="true" class="shrink-0" :width="size" :height="size">
    <rect width="32" height="32" rx="6" fill="#DA291C" />
    <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
  </svg>
  <svg
    v-else
    viewBox="0 0 32 32"
    aria-hidden="true"
    class="shrink-0"
    :width="size"
    :height="size"
    fill="none"
    stroke="currentColor"
    stroke-width="2.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M16 4v25M16 4l-2.5 4M16 4l2.5 4" />
    <path d="M7 6v6a9 9 0 0 0 18 0V6" />
    <path d="M7 6l-2 3M7 6l2 3M25 6l-2 3M25 6l2 3" />
    <path d="M12 27h8" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ name: 'trident' | 'swiss'; size?: number }>(), { size: 20 });
</script>
