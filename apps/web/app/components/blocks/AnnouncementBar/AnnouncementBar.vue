<template>
  <!-- Arizona: while today's deals run, the bar cross-fades between them, the Black Friday code of the day and its own text; all share one grid cell so the height never jumps -->
  <div class="grid min-h-10 h-full w-full" :style="inlineStyle">
    <NuxtLink
      v-if="dealsActive"
      :to="localePath('/tagesangebote')"
      class="[grid-area:1/1] min-h-10 flex items-center justify-center gap-x-2 px-4 @md:px-14 py-1 bg-[#FDECEE] typography-text-sm text-neutral-900 hover:bg-[#FAD9DE] motion-safe:transition-opacity motion-safe:duration-500"
      :class="current === 'deals' ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      :aria-hidden="current !== 'deals'"
      :tabindex="current === 'deals' ? undefined : -1"
      data-testid="announcement-bar-deals"
    >
      <span
        class="rounded bg-[#C8102E] px-2 py-0.5 typography-text-xs font-semibold uppercase tracking-wider text-white"
      >
        Nur heute
      </span>
      <span class="whitespace-nowrap">
        <b
          >{{ offers.length }}<span class="hidden @md:inline"> ausgewählte</span>
          {{ offers.length === 1 ? 'Angebot' : 'Angebote' }}</b
        >
        <template v-if="maxDiscount >= 5"> bis −{{ maxDiscount }} %</template>
        · <span class="hidden @md:inline">endet in </span
        ><span class="tabular-nums font-semibold text-[#C8102E]">{{ remaining }}</span>
      </span>
      <span class="hidden @md:inline font-semibold underline underline-offset-2">Jetzt sichern →</span>
    </NuxtLink>
    <button
      v-if="codeToday"
      type="button"
      class="[grid-area:1/1] min-h-10 flex items-center justify-center gap-x-2 px-4 @md:px-14 py-1 bg-neutral-950 typography-text-sm text-white motion-safe:transition-opacity motion-safe:duration-500"
      :class="current === 'code' ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      :aria-hidden="current !== 'code'"
      :tabindex="current === 'code' ? undefined : -1"
      :aria-label="`Black Friday: heute extra ${codeToday.percent} % mit Code ${codeToday.code}, Code kopieren`"
      data-testid="announcement-bar-code"
      @click="copyCode"
    >
      <span class="rounded bg-[#C8102E] px-2 py-0.5 typography-text-xs font-semibold uppercase tracking-wider">
        Black Friday
      </span>
      <span class="whitespace-nowrap">
        <span class="hidden @md:inline">Nur heute </span><b class="text-[#F5C400]">extra −{{ codeToday.percent }} %</b>
        <span class="hidden @md:inline"> auf alles</span> mit Code
      </span>
      <span class="rounded border border-dashed border-[#F5C400] px-2 py-0.5 font-mono font-bold tracking-wider">{{
        copied ? 'Kopiert ✓' : codeToday.code
      }}</span>
    </button>
    <div
      class="arizona-announcement-text [grid-area:1/1] min-h-10 flex items-center px-4 @md:px-14 motion-safe:transition-opacity motion-safe:duration-500"
      :class="current === 'text' ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      :aria-hidden="current !== 'text'"
    >
      <TextContent data-testid="announcement-bar-text" :text="textContentProps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArizonaDailyDeals } from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import { arizonaBlackFridayCodeToday } from '~/utils/arizonaBlackFriday';
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();
const localePath = useLocalizedPath();
const { offers, active: dealsActive, remaining, maxDiscount } = useArizonaDailyDeals();

const SWITCH_INTERVAL_MS = 5000;
// the code of the day only in the browser, so a cached page never shows yesterday's code
const mounted = ref(false);
const codeToday = computed(() => (mounted.value ? arizonaBlackFridayCodeToday() : null));
const turns = computed(() => {
  const list: ('deals' | 'code' | 'text')[] = [];
  if (codeToday.value) list.push('code');
  if (dealsActive.value) list.push('deals');
  if (props.content.text || !list.length) list.push('text');
  return list;
});
const turn = ref(0);
const current = computed(() => turns.value[turn.value % turns.value.length]);
let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  mounted.value = true;
  timer = setInterval(() => (turn.value += 1), SWITCH_INTERVAL_MS);
});

const copied = ref(false);
const copyCode = async () => {
  if (!codeToday.value) return;
  try {
    await navigator.clipboard.writeText(codeToday.value.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    // clipboard blocked: the code stays readable in the bar
  }
};
onBeforeUnmount(() => clearInterval(timer));

const inlineStyle = computed(() => {
  return { backgroundColor: props.content.backgroundColor || '#FFFFFF' };
});

const textContentProps = computed(() => ({
  htmlDescription: props.content.text,
  textAlignment: 'center' as const,
}));
</script>

<style scoped>
/*
 * Arizona: text size of the bar text. Not as Tailwind classes [&_.rte-prose]:text-sm – critters drops these selectors
 * from the inlined critical CSS, so the bar first rendered 48px high and the whole page jumped up 8px (layout shift).
 */
.arizona-announcement-text :deep(.rte-prose) {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
@container (min-width: 768px) {
  .arizona-announcement-text :deep(.rte-prose) {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
</style>
