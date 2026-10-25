<template>
  <a
    v-if="rating"
    :href="rating.link"
    target="_blank"
    rel="noopener"
    class="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 hover:border-neutral-400"
    data-testid="trust-badge"
  >
    <span class="flex text-[#F5A623]" :aria-label="`${formatted} von 5 Sternen`" role="img">
      <svg v-for="star in 5" :key="star" class="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M11.48 3.5a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.75a.53.53 0 0 1 .29.9l-3.73 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.21a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.17 9.99a.53.53 0 0 1 .3-.9l5.15-.75a2.12 2.12 0 0 0 1.6-1.16z"
        />
      </svg>
    </span>
    <span class="typography-text-sm font-semibold text-neutral-900">{{ formatted }} / 5</span>
    <span class="typography-text-sm text-neutral-600">
      aus {{ rating.anzahl.toLocaleString('de-DE') }} Bewertungen · Trustami
    </span>
    <span v-if="!compact" class="basis-full typography-text-xs text-neutral-500">
      Bewertungen unserer Kunden u. a. von eBay, Amazon und Kaufland, gesammelt von Trustami. Die Echtheit der
      importierten Bewertungen prüft Trustami nicht einzeln.
    </span>
  </a>
</template>

<script setup lang="ts">
import type { ArizonaTrustBadgeProps } from './types';

/**
 * Arizona: rating summary of the Trustami profile (updated daily by shop_bestseller.py), with the required note on
 * where the reviews come from and how they are checked (§ 5b Abs. 3 UWG).
 */
withDefaults(defineProps<ArizonaTrustBadgeProps>(), { compact: false });
const { rating } = useArizonaShopFacts();
const formatted = computed(() => rating.value?.note.toLocaleString('de-DE', { minimumFractionDigits: 2 }) ?? '');
</script>
