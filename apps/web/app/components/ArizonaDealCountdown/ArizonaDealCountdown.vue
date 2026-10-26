<template>
  <span
    v-if="active"
    class="inline-flex items-center gap-1.5 rounded-full bg-[#C8102E] px-2.5 py-1 text-xs font-semibold text-white"
    data-testid="deal-countdown"
  >
    <svg
      class="size-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
    Tagesangebot · noch <span class="tabular-nums">{{ remaining }}</span>
  </span>
</template>

<script setup lang="ts">
/** Arizona: small countdown badge for an item that is one of today's deals (see useArizonaDailyDeals). */
import { useArizonaDailyDeals } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import type { ArizonaDealCountdownProps } from './types';

const props = defineProps<ArizonaDealCountdownProps>();
const { isDeal, remaining } = useArizonaDailyDeals();
const active = computed(() => isDeal(props.itemId));
</script>
