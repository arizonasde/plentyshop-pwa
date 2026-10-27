<template>
  <!-- Arizona: while today's deals run, the bar points to them instead of its own text -->
  <NuxtLink
    v-if="dealsActive"
    :to="localePath('/tagesangebote')"
    class="min-h-10 h-full w-full flex flex-wrap items-center justify-center gap-x-2 px-4 @md:px-14 py-1 bg-[#FDECEE] typography-text-sm text-neutral-900 hover:bg-[#FAD9DE]"
    data-testid="announcement-bar-deals"
  >
    <span class="rounded bg-[#C8102E] px-2 py-0.5 typography-text-xs font-semibold uppercase tracking-wider text-white">
      Nur heute
    </span>
    <span>
      <b>{{ offers.length }} ausgewählte {{ offers.length === 1 ? 'Angebot' : 'Angebote' }}</b>
      <template v-if="maxDiscount >= 5"> bis −{{ maxDiscount }} %</template>
      · endet in <span class="tabular-nums font-semibold text-[#C8102E]">{{ remaining }}</span>
    </span>
    <span class="hidden @md:inline font-semibold underline underline-offset-2">Jetzt sichern →</span>
  </NuxtLink>
  <div
    v-else
    class="min-h-10 h-full w-full flex items-center px-4 @md:px-14 [&_.rte-prose]:text-sm @md:[&_.rte-prose]:text-base"
    :style="inlineStyle"
  >
    <TextContent data-testid="announcement-bar-text" :text="textContentProps" />
  </div>
</template>

<script setup lang="ts">
import { useArizonaDailyDeals } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();
const localePath = useLocalizedPath();
const { offers, active: dealsActive, remaining, maxDiscount } = useArizonaDailyDeals();

const inlineStyle = computed(() => {
  return { backgroundColor: props.content.backgroundColor || '#FFFFFF' };
});

const textContentProps = computed(() => ({
  htmlDescription: props.content.text,
  textAlignment: 'center' as const,
}));
</script>
