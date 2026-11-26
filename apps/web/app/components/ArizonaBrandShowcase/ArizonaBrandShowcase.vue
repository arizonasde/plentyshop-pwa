<template>
  <!--
    Arizona: full brand page layout for brands with a showcase (Luminox). Hero with a day/night comparison slider,
    key facts, origin story band, two pillars, the products (slot) and the series as tabs.
    Motion follows a few rules: one entrance on load, scroll reveals only where supported (CSS scroll timelines),
    press feedback on everything pressable, hover only on real pointers, reduced motion = fades only.
  -->
  <div class="lx" data-testid="brand-showcase">
    <header class="relative isolate overflow-hidden rounded-3xl bg-[#07090a] text-white" data-testid="brand-story-hero">
      <div aria-hidden="true" class="lx-glow absolute inset-0 -z-10" />
      <div class="lx-hero-grid">
        <div class="lx-rise lx-hero-title">
          <p class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#8BFFA8]">
            <ArizonaBrandIcon name="trident" :size="18" />
            {{ showcase.eyebrow }}
          </p>
          <h1 class="mt-4 text-6xl font-black uppercase leading-[0.9] tracking-[-0.03em] @md:text-7xl @lg:text-8xl">
            {{ brandName }}
          </h1>
          <p class="mt-4 whitespace-pre-line text-2xl font-bold leading-tight @md:text-3xl" data-testid="brand-claim">
            {{ story.claim }}
          </p>
        </div>

        <figure class="lx-appear lx-hero-figure">
          <div
            ref="compare"
            class="lx-compare relative aspect-[1000/1385] w-full cursor-ew-resize select-none rounded-2xl bg-black outline-none"
            role="slider"
            tabindex="0"
            aria-label="Tag und Nacht vergleichen"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="Math.round(position)"
            :aria-valuetext="`${Math.round(position)} Prozent Tag`"
            data-testid="brand-day-night"
            @pointerdown="onPointerDown"
            @keydown="onKeydown"
          >
            <div class="absolute inset-0 overflow-hidden rounded-2xl">
              <picture>
                <source media="(max-width: 767px)" :srcset="showcase.nightSmall" />
                <img
                  :src="showcase.night.src"
                  :width="showcase.night.width"
                  :height="showcase.night.height"
                  :alt="showcase.night.alt"
                  draggable="false"
                  fetchpriority="high"
                  class="absolute inset-0 h-full w-full object-cover"
                />
              </picture>
              <picture>
                <source media="(max-width: 767px)" :srcset="showcase.daySmall" />
                <img
                  :src="showcase.day.src"
                  :width="showcase.day.width"
                  :height="showcase.day.height"
                  :alt="showcase.day.alt"
                  draggable="false"
                  class="absolute inset-0 h-full w-full object-cover"
                  :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }"
                />
              </picture>
              <span class="lx-tag left-3">Tag</span>
              <span class="lx-tag right-3">Nacht</span>
            </div>
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0"
              :style="{ transform: `translateX(${position}%)` }"
            >
              <div class="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 bg-white/80" />
              <div class="lx-knob" :data-dragging="dragging || undefined">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <figcaption class="mt-3 text-center typography-text-xs text-white/60">{{ showcase.caption }}</figcaption>
        </figure>

        <div class="lx-rise lx-rise-late lx-hero-details">
          <p class="max-w-md text-white/70 leading-relaxed" data-testid="brand-intro">{{ showcase.text }}</p>
          <div class="mt-7 flex flex-wrap gap-3">
            <a href="#marke-uhren" class="lx-press lx-btn-light">Uhren ansehen</a>
            <a href="#marke-geschichte" class="lx-press lx-btn-ghost">Die Geschichte</a>
          </div>
          <ul class="mt-8 flex flex-wrap gap-x-6 gap-y-3 typography-text-sm font-semibold text-white/85">
            <li v-for="badge in showcase.badges" :key="badge.label" class="flex items-center gap-2">
              <ArizonaBrandIcon :name="badge.icon" :size="20" class="text-[#8BFFA8]" />
              {{ badge.label }}
            </li>
          </ul>
        </div>
      </div>
    </header>

    <dl class="mt-2 grid grid-cols-2 gap-2 @md:grid-cols-4" data-testid="brand-facts">
      <div v-for="fact in story.facts" :key="fact.label" class="rounded-2xl bg-[#07090a] px-4 py-4 text-white">
        <dt class="text-2xl font-black tracking-tight text-[#8BFFA8] @md:text-3xl">{{ fact.value }}</dt>
        <dd class="mt-0.5 typography-text-xs text-white/65 @md:typography-text-sm">{{ fact.label }}</dd>
      </div>
    </dl>

    <section
      v-if="story.mission"
      id="marke-geschichte"
      class="lx-reveal relative isolate mt-14 scroll-mt-24 overflow-hidden rounded-3xl bg-[#07090a] text-white"
      data-testid="brand-mission"
    >
      <img
        :src="story.mission.image.src"
        :width="story.mission.image.width"
        :height="story.mission.image.height"
        :alt="story.mission.image.alt"
        loading="lazy"
        class="h-60 w-full object-cover object-[65%_40%] @md:absolute @md:inset-y-0 @md:right-0 @md:-z-10 @md:h-full @md:w-[65%]"
      />
      <div
        aria-hidden="true"
        class="absolute inset-0 -z-10 hidden bg-gradient-to-r from-[#07090a] from-[35%] via-[#07090a]/60 via-[55%] to-transparent @md:block"
      />
      <div class="px-5 py-8 @md:max-w-[58%] @md:px-12 @md:py-14">
        <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8BFFA8]">{{ story.mission.kicker }}</p>
        <h2 class="mt-3 text-3xl font-black leading-[1.05] tracking-tight @md:text-5xl">{{ story.mission.title }}</h2>
        <ol class="mt-8 grid gap-x-8 gap-y-5 @sm:grid-cols-2">
          <li v-for="step in story.mission.steps" :key="step.year" class="border-l-2 border-[#8BFFA8]/40 pl-4">
            <span class="block text-xl font-black text-[#8BFFA8]">{{ step.year }}</span>
            <span class="mt-1 block typography-text-sm leading-relaxed text-white/75">{{ step.text }}</span>
          </li>
        </ol>
      </div>
    </section>

    <div v-if="story.pillars?.length" class="mt-4 grid gap-4 @lg:grid-cols-2">
      <article
        v-for="pillar in story.pillars"
        :id="pillar.id"
        :key="pillar.id"
        class="lx-reveal flex scroll-mt-24 flex-col overflow-hidden rounded-3xl"
        :class="pillar.icon === 'swiss' ? 'bg-[#07090a] text-white' : 'border border-neutral-200 bg-white'"
        :data-testid="`brand-pillar-${pillar.id}`"
      >
        <img
          :src="pillar.image.src"
          :width="pillar.image.width"
          :height="pillar.image.height"
          :alt="pillar.image.alt"
          loading="lazy"
          class="lx-clip aspect-[4/3] w-full object-cover"
          :class="pillar.icon === 'swiss' ? 'object-[50%_70%]' : 'object-center'"
        />
        <div class="flex flex-1 flex-col p-6 @md:p-8">
          <p
            class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
            :class="pillar.icon === 'swiss' ? 'text-[#FF5A4E]' : 'text-neutral-900'"
          >
            <ArizonaBrandIcon :name="pillar.icon" :size="20" />
            {{ pillar.kicker }}
          </p>
          <h2 class="mt-3 text-3xl font-black leading-[1.05] tracking-tight">{{ pillar.title }}</h2>
          <p
            v-for="(paragraph, p) in pillar.paragraphs"
            :key="p"
            class="mt-4 leading-relaxed"
            :class="pillar.icon === 'swiss' ? 'text-white/75' : 'text-neutral-700'"
          >
            {{ paragraph }}
          </p>
          <ul class="mt-6 space-y-2.5">
            <li v-for="point in pillar.points" :key="point" class="flex gap-3 typography-text-sm font-semibold">
              <span
                aria-hidden="true"
                class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                :class="pillar.icon === 'swiss' ? 'bg-[#DA291C]' : 'bg-neutral-900'"
              />
              {{ point }}
            </li>
          </ul>
        </div>
      </article>
    </div>

    <section id="marke-uhren" class="mt-14 scroll-mt-24">
      <slot name="products" />
    </section>

    <section id="marke-serien" class="mt-14 scroll-mt-24" data-testid="brand-series">
      <h2 class="text-3xl font-black tracking-tight @md:text-4xl">{{ story.seriesTitle }}</h2>
      <p class="mt-2 max-w-3xl text-neutral-700">{{ story.seriesIntro }}</p>

      <div
        role="tablist"
        aria-label="Einsatzgebiet"
        class="relative mt-6 grid max-w-md grid-cols-3 rounded-full bg-neutral-100 p-1"
      >
        <span
          aria-hidden="true"
          class="lx-tab-indicator absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-[#07090a]"
          :style="{ transform: `translateX(${activeGroup * 100}%)` }"
        />
        <button
          v-for="(group, index) in story.seriesGroups"
          :id="`serie-tab-${index}`"
          :key="group.title"
          ref="tabs"
          type="button"
          role="tab"
          :aria-selected="activeGroup === index"
          :aria-controls="`serie-panel-${index}`"
          :tabindex="activeGroup === index ? 0 : -1"
          class="lx-press relative z-raised rounded-full px-4 py-2 typography-text-sm font-bold"
          :class="activeGroup === index ? 'text-white' : 'text-neutral-700'"
          @click="activeGroup = index"
          @keydown="onTabKeydown"
        >
          {{ group.title }}
        </button>
      </div>

      <div
        v-for="(group, index) in story.seriesGroups"
        v-show="activeGroup === index"
        :id="`serie-panel-${index}`"
        :key="group.title"
        role="tabpanel"
        :aria-labelledby="`serie-tab-${index}`"
        class="mt-5"
      >
        <p class="mb-3 typography-text-sm text-neutral-600">{{ group.text }}</p>
        <ul class="grid grid-cols-1 gap-3 @md:grid-cols-2 @lg:grid-cols-3">
          <li
            v-for="series in group.series"
            :key="series.name"
            class="flex flex-col rounded-2xl border border-neutral-200 px-5 py-4"
          >
            <span class="font-bold">{{ series.name }}</span>
            <span class="typography-text-xs text-neutral-500">Serie {{ series.models }}</span>
            <span class="mt-2 typography-text-sm text-neutral-700">{{ series.text }}</span>
          </li>
        </ul>
      </div>

      <div class="mt-10 grid gap-8 @md:grid-cols-2">
        <div v-for="section in story.sections" :key="section.title">
          <h3 class="text-lg font-bold">{{ section.title }}</h3>
          <p v-for="(paragraph, p) in section.paragraphs" :key="p" class="mt-2 text-neutral-700 leading-relaxed">
            {{ paragraph }}
          </p>
        </div>
      </div>
      <p class="mt-8 typography-text-xs text-neutral-500">{{ story.footnote }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { ArizonaBrandStory } from '~/utils/arizonaBrandStories/types';

const props = defineProps<{ story: ArizonaBrandStory; brandName: string }>();
const showcase = computed(() => props.story.showcase!);

// Day/night slider: share of the day photo in percent (0 = all night, 100 = all day)
const position = ref(50);
const dragging = ref(false);
const compare = ref<HTMLElement>();
let hintFrame = 0;
let touched = false;

const setFromPointer = (event: PointerEvent) => {
  const rect = compare.value!.getBoundingClientRect();
  position.value = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
};

const stopHint = () => {
  touched = true;
  cancelAnimationFrame(hintFrame);
};

const onPointerDown = (event: PointerEvent) => {
  if (dragging.value || !compare.value) return; // ignore a second finger
  stopHint();
  dragging.value = true;
  compare.value.setPointerCapture(event.pointerId);
  setFromPointer(event);
  const move = (e: PointerEvent) => setFromPointer(e);
  const up = () => {
    dragging.value = false;
    compare.value?.removeEventListener('pointermove', move);
    compare.value?.removeEventListener('pointerup', up);
    compare.value?.removeEventListener('pointercancel', up);
  };
  compare.value.addEventListener('pointermove', move);
  compare.value.addEventListener('pointerup', up);
  compare.value.addEventListener('pointercancel', up);
};

const onKeydown = (event: KeyboardEvent) => {
  const steps: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 };
  if (event.key in steps) position.value = Math.min(100, Math.max(0, position.value + steps[event.key]!));
  else if (event.key === 'Home') position.value = 0;
  else if (event.key === 'End') position.value = 100;
  else return;
  event.preventDefault();
  stopHint();
};

// One gentle hint the first time the slider is seen: swing towards night and back, so it is clear it can be dragged.
const playHint = () => {
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const keys = [50, 22, 50];
  const segment = 700;
  let start = 0;
  const frame = (now: number) => {
    if (touched) return;
    if (!start) start = now;
    const elapsed = now - start;
    const index = Math.min(keys.length - 2, Math.floor(elapsed / segment));
    const t = Math.min(1, (elapsed - index * segment) / segment);
    position.value = keys[index]! + (keys[index + 1]! - keys[index]!) * ease(t);
    if (elapsed < segment * (keys.length - 1)) hintFrame = requestAnimationFrame(frame);
  };
  hintFrame = requestAnimationFrame(frame);
};

let observer: IntersectionObserver | undefined;
onMounted(() => {
  if (!compare.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer?.disconnect();
      setTimeout(() => !touched && playHint(), 600);
    },
    { threshold: 0.6 },
  );
  observer.observe(compare.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(hintFrame);
});

// Series tabs
const activeGroup = ref(0);
const tabs = ref<HTMLButtonElement[]>([]);
const onTabKeydown = (event: KeyboardEvent) => {
  const count = props.story.seriesGroups?.length ?? 0;
  const next: Record<string, number> = {
    ArrowRight: (activeGroup.value + 1) % count,
    ArrowLeft: (activeGroup.value - 1 + count) % count,
    Home: 0,
    End: count - 1,
  };
  if (!(event.key in next)) return;
  event.preventDefault();
  activeGroup.value = next[event.key]!;
  tabs.value[activeGroup.value]?.focus();
};
</script>

<style scoped>
.lx {
  --lx-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --lx-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}

/* Hero layout in plain CSS: phone = title, watch, details stacked; from 768px = text left, watch right */
.lx-hero-grid {
  display: grid;
  row-gap: 1.75rem;
  padding: 2.25rem 1.25rem 2rem;
}
.lx-hero-figure {
  width: 100%;
  max-width: 300px;
  margin-inline: auto;
}
@container (min-width: 768px) {
  .lx-hero-grid {
    grid-template-columns: 1.1fr 1fr;
    grid-template-rows: 1fr auto auto 1fr;
    column-gap: 2rem;
    row-gap: 0;
    padding: 3.5rem 3rem;
  }
  .lx-hero-title {
    grid-column: 1;
    grid-row: 2;
  }
  .lx-hero-details {
    grid-column: 1;
    grid-row: 3;
    padding-top: 1rem;
  }
  .lx-hero-figure {
    grid-column: 2;
    grid-row: 1 / span 4;
    align-self: center;
    max-width: 420px;
  }
}
@container (min-width: 1024px) {
  .lx-hero-grid {
    padding-inline: 4rem;
  }
}

.lx-glow {
  background:
    radial-gradient(55% 60% at 72% 45%, rgb(139 255 168 / 0.14), transparent 70%),
    radial-gradient(40% 40% at 10% 100%, rgb(255 165 59 / 0.08), transparent 70%);
}

/* Buttons and tabs: press feedback, hover only on real pointers */
.lx-press {
  transition:
    transform 160ms var(--lx-ease-out),
    background-color 200ms ease,
    color 200ms ease;
}
.lx-press:active {
  transform: scale(0.97);
}
.lx-btn-light,
.lx-btn-ghost {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.7rem 1.35rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none !important;
}
.lx-btn-light {
  background: #fff;
  color: #07090a !important;
}
.lx-btn-ghost {
  border: 1px solid rgb(255 255 255 / 0.35);
  color: #fff !important;
}
@media (hover: hover) and (pointer: fine) {
  .lx-btn-light:hover {
    background: #e7e7e7;
  }
  .lx-btn-ghost:hover {
    background: rgb(255 255 255 / 0.08);
  }
}

/* Day/night slider */
.lx-compare {
  touch-action: pan-y;
}
.lx-compare:focus-visible {
  box-shadow: 0 0 0 3px #8bffa8;
}
.lx-tag {
  position: absolute;
  top: 0.75rem;
  border-radius: 9999px;
  background: rgb(0 0 0 / 0.55);
  padding: 0.2rem 0.6rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
  backdrop-filter: blur(6px);
}
.lx-knob {
  position: absolute;
  top: 50%;
  left: 0;
  display: grid;
  height: 2.75rem;
  width: 2.75rem;
  place-items: center;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255 / 0.9);
  background: rgb(7 9 10 / 0.6);
  color: #fff;
  backdrop-filter: blur(6px);
  transform: translate(-50%, -50%);
  transition: transform 160ms var(--lx-ease-out);
}
.lx-knob[data-dragging] {
  transform: translate(-50%, -50%) scale(0.92);
}

.lx-tab-indicator {
  transition: transform 240ms var(--lx-ease-in-out);
}

/* One entrance on load: hero text staggers in, the watch settles */
.lx-rise > * {
  animation: lx-rise 600ms var(--lx-ease-out) both;
}
.lx-rise > :nth-child(2) {
  animation-delay: 60ms;
}
.lx-rise > :nth-child(3) {
  animation-delay: 110ms;
}
.lx-rise > :nth-child(4) {
  animation-delay: 150ms;
}
.lx-rise > :nth-child(5) {
  animation-delay: 185ms;
}
.lx-rise > :nth-child(6) {
  animation-delay: 210ms;
}
.lx-rise-late > * {
  animation-delay: 160ms;
}
.lx-rise-late > :nth-child(2) {
  animation-delay: 200ms;
}
.lx-rise-late > :nth-child(3) {
  animation-delay: 230ms;
}
.lx-appear {
  animation: lx-appear 700ms var(--lx-ease-out) 120ms both;
}
@keyframes lx-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}
@keyframes lx-appear {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}

/* Scroll reveals only where the browser supports scroll timelines; elsewhere everything is simply visible */
@supports (animation-timeline: view()) {
  .lx-reveal {
    animation: lx-reveal var(--lx-ease-out) both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }
  .lx-clip {
    animation: lx-clip var(--lx-ease-out) both;
    animation-timeline: view();
    animation-range: entry 10% cover 35%;
  }
}
@keyframes lx-reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}
@keyframes lx-clip {
  from {
    clip-path: inset(0 0 22% 0);
    transform: scale(1.04);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lx-rise > *,
  .lx-appear,
  .lx-reveal {
    animation-name: lx-fade;
  }
  .lx-clip {
    animation: none;
  }
  .lx-tab-indicator,
  .lx-knob {
    transition: none;
  }
}
@keyframes lx-fade {
  from {
    opacity: 0;
  }
}
</style>
