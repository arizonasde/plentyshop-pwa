<template>
  <!-- the wrapper always takes up a pixel so lazy hydration starts and the deals file gets loaded -->
  <div class="min-h-px">
    <NuxtLink
      v-if="active"
      :to="localePath('/tagesangebote')"
      class="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-lg bg-[#FDECEE] px-4 py-3 typography-text-sm text-neutral-900 hover:bg-[#FAD9DE]"
      data-testid="arizona-daily-deals"
    >
      <span class="rounded bg-[#C8102E] px-2 py-0.5 typography-text-xs font-semibold text-white">Tagesangebote</span>
      <span>
        Heute im Angebot: <b>{{ offers.length }} {{ offers.length === 1 ? 'Tagesangebot' : 'Tagesangebote' }}</b>
        · noch <span class="tabular-nums">{{ remaining }}</span>
      </span>
      <span class="font-semibold underline underline-offset-2">alle ansehen →</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useArizonaDailyDeals } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import type { ArizonaDailyDealsProps } from './types';

/**
 * Arizona: home page hint to today's deals. The deals themselves are spread over the shop (label on the product
 * cards) and collected on /tagesangebote. Hidden when there are no current deals.
 */
// the block keeps its editor props (title, text, maxItems) so existing templates stay valid
defineProps<ArizonaDailyDealsProps>();
const localePath = useLocalizedPath();
const { offers, active, remaining } = useArizonaDailyDeals();
</script>
