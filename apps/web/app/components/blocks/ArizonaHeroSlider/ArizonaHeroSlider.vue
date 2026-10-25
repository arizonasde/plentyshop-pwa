<template>
  <section
    v-if="slides.length"
    class="relative overflow-hidden bg-gradient-to-r from-[#3B3632] via-[#6E6762] to-[#B9B3AE] text-white"
    :aria-roledescription="'Karussell'"
    aria-label="Aktuelle Kollektionen"
    data-testid="arizona-hero-slider"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div class="grid @lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 p-4 @md:p-6 @lg:p-8">
      <!-- text side -->
      <div class="order-2 @lg:order-1 flex flex-col justify-between gap-6 @lg:py-2">
        <Transition name="arizona-hero-fade" mode="out-in">
          <div :key="active" class="flex flex-col gap-3">
            <span
              class="w-fit rounded-full bg-white px-3 py-1 text-[0.7rem] @md:text-xs font-semibold uppercase tracking-wide text-neutral-900"
            >
              {{ current.pill }}
            </span>
            <span class="text-sm @md:text-lg font-semibold uppercase tracking-wider">{{ current.eyebrow }}</span>
            <NuxtLink
              :to="localePath(current.link)"
              class="text-3xl @md:text-5xl font-bold leading-tight hover:underline underline-offset-4"
            >
              {{ current.title }}
            </NuxtLink>
          </div>
        </Transition>

        <div class="flex items-center gap-1.5" role="tablist" aria-label="Folie wählen">
          <button
            v-for="(slide, i) in slides"
            :key="slide.title"
            type="button"
            role="tab"
            :aria-selected="i === active"
            :aria-label="`Folie ${i + 1}: ${slide.title}`"
            class="h-1.5 rounded-full bg-white transition-all"
            :class="i === active ? 'w-11' : 'w-1.5 opacity-60 hover:opacity-100'"
            @click="go(i)"
          />
        </div>

        <Transition name="arizona-hero-fade" mode="out-in">
          <ul :key="active" class="grid grid-cols-4 gap-1.5 @lg:max-w-[32rem]" data-testid="arizona-hero-products">
            <li v-for="product in current.products.slice(0, 4)" :key="product.link">
              <NuxtLink
                :to="localePath(product.link)"
                class="block aspect-[3/4] overflow-hidden rounded bg-[#F3F3F3] transition-transform hover:-translate-y-0.5"
              >
                <img
                  :src="product.image"
                  :alt="product.alt"
                  class="size-full object-contain mix-blend-multiply"
                  loading="lazy"
                  width="150"
                  height="200"
                />
              </NuxtLink>
            </li>
          </ul>
        </Transition>
      </div>

      <!-- image side -->
      <div class="order-1 @lg:order-2 relative overflow-hidden rounded-xl aspect-[3/2] @lg:aspect-auto @lg:min-h-[28rem]">
        <TransitionGroup name="arizona-hero-fade">
          <NuxtLink
            v-for="(slide, i) in slides"
            v-show="i === active"
            :key="slide.title"
            :to="localePath(slide.link)"
            class="absolute inset-0 block"
            :aria-hidden="i !== active"
            :tabindex="i === active ? 0 : -1"
          >
            <picture>
              <source media="(max-width: 767px)" :srcset="slide.image.mobile" />
              <img
                :src="slide.image.desktop"
                :alt="slide.image.alt"
                class="size-full object-cover"
                :loading="i === 0 && index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="i === 0 && index === 0 ? 'high' : undefined"
                width="1400"
                height="933"
              />
            </picture>
          </NuxtLink>
        </TransitionGroup>

        <div
          class="absolute bottom-4 right-4 flex overflow-hidden rounded-full border border-white/70 bg-white/20 backdrop-blur"
        >
          <button
            type="button"
            class="flex size-11 items-center justify-center hover:bg-white/30"
            aria-label="Vorherige Folie"
            @click="go(active - 1)"
          >
            <SfIconChevronLeft />
          </button>
          <span class="w-px bg-white/70" aria-hidden="true" />
          <button
            type="button"
            class="flex size-11 items-center justify-center hover:bg-white/30"
            aria-label="Nächste Folie"
            @click="go(active + 1)"
          >
            <SfIconChevronRight />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import type { ArizonaHeroSliderProps } from './types';

/**
 * Arizona: hero slider for the home page in the style of large fashion shops – dark gradient with pill, title and
 * four product tiles on the left, a large photo on the right. Slides change automatically (paused while the
 * pointer or keyboard focus is inside) and by dots or arrows.
 */
const props = defineProps<ArizonaHeroSliderProps>();
const localePath = useLocalizedPath();

const slides = computed(() => props.content?.slides ?? []);
const active = ref(0);
const paused = ref(false);
const current = computed(() => slides.value[active.value] ?? slides.value[0]!);

const go = (i: number) => {
  const count = slides.value.length;
  if (count) active.value = (i + count) % count;
};

let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  timer = setInterval(() => {
    if (!paused.value) go(active.value + 1);
  }, props.content?.interval ?? 6000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<style scoped>
.arizona-hero-fade-enter-active,
.arizona-hero-fade-leave-active {
  transition: opacity 0.5s ease;
}
.arizona-hero-fade-enter-from,
.arizona-hero-fade-leave-to {
  opacity: 0;
}
</style>
