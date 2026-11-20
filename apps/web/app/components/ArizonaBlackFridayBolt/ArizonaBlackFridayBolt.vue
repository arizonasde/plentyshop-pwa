<template>
  <!-- Arizona: lightning bolt that underlines the Black Friday discount; flashes briefly every few seconds -->
  <svg
    class="arizona-bolt shrink-0"
    viewBox="0 0 48 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FFE45C" />
        <stop offset="1" stop-color="#F5A300" />
      </linearGradient>
    </defs>
    <path
      d="M30 2 4 46h17l-6 32 29-46H26l8-30Z"
      :fill="`url(#${gradientId})`"
      stroke="#FFF6C2"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
const gradientId = `arizona-bolt-${useId()}`;
</script>

<style scoped>
.arizona-bolt {
  filter: drop-shadow(0 0 6px rgb(245 196 0 / 0.45));
  animation: arizona-bolt-flash 7s ease-out infinite;
  transform-origin: 50% 50%;
}

/* short double flash, then a long calm pause */
@keyframes arizona-bolt-flash {
  0%,
  80%,
  100% {
    filter: drop-shadow(0 0 6px rgb(245 196 0 / 0.45));
    transform: scale(1);
  }
  82% {
    filter: drop-shadow(0 0 18px rgb(255 228 92 / 0.95)) brightness(1.25);
    transform: scale(1.06);
  }
  84% {
    filter: drop-shadow(0 0 8px rgb(245 196 0 / 0.5));
    transform: scale(1);
  }
  86% {
    filter: drop-shadow(0 0 22px rgb(255 228 92 / 1)) brightness(1.35);
    transform: scale(1.08);
  }
  90% {
    filter: drop-shadow(0 0 6px rgb(245 196 0 / 0.45));
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .arizona-bolt {
    animation: none;
  }
}
</style>
