<template>
  <div class="mt-4 space-y-3" data-testid="secure-checkout">
    <p class="flex items-center justify-center gap-2 typography-text-sm text-neutral-700">
      <svg
        class="size-4 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      Sicher bestellen – deine Daten werden verschlüsselt übertragen
    </p>
    <div class="flex justify-center">
      <ArizonaTrustBadge />
    </div>
  </div>
</template>

<script setup lang="ts">
// Arizona: short security note and rating summary below the buy button in the checkout.
</script>
