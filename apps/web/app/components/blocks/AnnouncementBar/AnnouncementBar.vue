<template>
  <!-- Arizona: while today's deals run, the bar cross-fades between them and its own text; both share one grid cell so the height never jumps -->
  <div class="grid min-h-10 h-full w-full" :style="inlineStyle">
    <NuxtLink
      v-if="dealsActive"
      :to="localePath('/tagesangebote')"
      class="[grid-area:1/1] min-h-10 flex items-center justify-center gap-x-2 px-4 @md:px-14 py-1 bg-[#FDECEE] typography-text-sm text-neutral-900 hover:bg-[#FAD9DE] motion-safe:transition-opacity motion-safe:duration-500"
      :class="showDeals ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      :aria-hidden="!showDeals"
      :tabindex="showDeals ? undefined : -1"
      data-testid="announcement-bar-deals"
    >
      <span class="rounded bg-[#C8102E] px-2 py-0.5 typography-text-xs font-semibold uppercase tracking-wider text-white">
        Nur heute
      </span>
      <span class="whitespace-nowrap">
        <b>{{ offers.length }}<span class="hidden @md:inline"> ausgewählte</span> {{ offers.length === 1 ? 'Angebot' : 'Angebote' }}</b>
        <template v-if="maxDiscount >= 5"> bis −{{ maxDiscount }} %</template>
        · <span class="hidden @md:inline">endet in </span><span class="tabular-nums font-semibold text-[#C8102E]">{{ remaining }}</span>
      </span>
      <span class="hidden @md:inline font-semibold underline underline-offset-2">Jetzt sichern →</span>
    </NuxtLink>
    <div
      class="[grid-area:1/1] min-h-10 flex items-center px-4 @md:px-14 [&_.rte-prose]:text-sm @md:[&_.rte-prose]:text-base motion-safe:transition-opacity motion-safe:duration-500"
      :class="showDeals ? 'opacity-0 pointer-events-none' : 'opacity-100'"
      :aria-hidden="showDeals"
    >
      <TextContent data-testid="announcement-bar-text" :text="textContentProps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArizonaDailyDeals } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();
const localePath = useLocalizedPath();
const { offers, active: dealsActive, remaining, maxDiscount } = useArizonaDailyDeals();

const SWITCH_INTERVAL_MS = 5000;
const showDealsTurn = ref(true);
const showDeals = computed(() => dealsActive.value && (showDealsTurn.value || !props.content.text));
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  timer = setInterval(() => (showDealsTurn.value = !showDealsTurn.value), SWITCH_INTERVAL_MS);
});
onBeforeUnmount(() => clearInterval(timer));

const inlineStyle = computed(() => {
  return { backgroundColor: props.content.backgroundColor || '#FFFFFF' };
});

const textContentProps = computed(() => ({
  htmlDescription: props.content.text,
  textAlignment: 'center' as const,
}));
</script>
