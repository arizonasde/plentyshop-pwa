<template>
  <!--
    Arizona: street brand page (Carlo Colucci). Dark concrete look with a huge condensed name that widens on hover,
    a look builder (four real items, crossfading photos, link to the item, real wishlist), a ticker, the culture
    chapter, a photo pair and the products („Der Drop“, slot). Motion: one entrance on load, scroll reveals only via
    CSS scroll timelines, press feedback on everything pressable, hover only on real pointers, reduced motion = fades.
  -->
  <div class="cs" data-testid="brand-street">
    <section class="cs-dark cs-grain" data-testid="brand-story-hero">
      <header class="cs-pad pt-7">
        <div class="cs-mono flex flex-wrap justify-between gap-3 text-xs uppercase tracking-[0.12em] text-[#9b978f]">
          <span>Marken / {{ brandName }}</span>
          <span class="text-[var(--cs-lime)]">● {{ total ? `${total} Artikel online` : 'Kollektion online' }}</span>
        </div>
        <h1 class="cs-name cs-rise mt-8">
          <span class="sr-only">{{ brandName }}</span>
          <span aria-hidden="true">{{ shortName }}</span>
        </h1>
        <div class="mt-5 flex flex-wrap items-end justify-between gap-6">
          <p class="cs-wide m-0 max-w-[760px] text-[clamp(20px,2.2vw,32px)] leading-[1.05]" data-testid="brand-claim">
            {{ street.tagline }}
          </p>
          <p
            class="cs-tape cs-hint cs-mono m-0 bg-[var(--cs-lime)] px-4 py-2.5 text-sm font-bold uppercase tracking-[0.08em] text-[var(--cs-ink)]"
          >
            Fahr über den Namen
          </p>
        </div>
      </header>

      <div class="cs-pad cs-builder pb-24 pt-16" data-testid="brand-look-builder">
        <div class="cs-stage">
          <img
            v-for="(look, index) in street.looks"
            :key="look.name"
            :src="look.image.src"
            :width="look.image.width"
            :height="look.image.height"
            :alt="index === active ? look.image.alt : ''"
            :aria-hidden="index !== active"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : undefined"
            class="cs-look"
            :data-active="index === active || undefined"
          />
          <span class="cs-cond cs-look-name" aria-hidden="true">{{ current.name }}</span>
          <span class="cs-mono cs-tape cs-look-no">LOOK 0{{ active + 1 }} / 0{{ street.looks.length }}</span>
        </div>

        <div class="flex min-w-0 flex-col gap-7">
          <div>
            <p class="cs-mono m-0 text-xs uppercase tracking-[0.14em] text-[#9b978f]">Look-Builder</p>
            <h2 class="cs-wide m-0 mt-2.5 text-[clamp(32px,3.4vw,52px)] leading-none">Wähl dein Oberteil.</h2>
          </div>
          <div role="radiogroup" aria-label="Oberteil wählen" class="grid grid-cols-4 gap-3">
            <button
              v-for="(look, index) in street.looks"
              :key="look.name"
              ref="thumbs"
              type="button"
              role="radio"
              class="cs-thumb"
              :aria-checked="index === active"
              :aria-label="look.name"
              :tabindex="index === active ? 0 : -1"
              :data-active="index === active || undefined"
              @click="active = index"
              @keydown="onKeydown"
            >
              <img :src="look.image.src" alt="" loading="lazy" class="h-full w-full object-cover" />
            </button>
          </div>
          <div class="border-t border-[#3a3a3c] pt-6" aria-live="polite">
            <p class="cs-wide m-0 text-[22px]">{{ current.name }}</p>
            <p class="m-0 mt-2.5 text-[17px] leading-relaxed text-[#c9c5bd]">{{ current.text }}</p>
            <p class="cs-mono m-0 mt-4 text-[13px] tracking-[0.06em] text-[var(--cs-lime)]">
              Dazu: {{ current.combo }}
            </p>
          </div>
          <div class="mt-auto flex flex-wrap gap-3">
            <NuxtLink :to="localePath(current.url)" class="cs-press cs-wide cs-btn-lime">Zum Artikel</NuxtLink>
            <button
              type="button"
              class="cs-press cs-mono cs-btn-save"
              :aria-pressed="saved"
              :data-saved="saved || undefined"
              :disabled="wishlistLoading"
              @click="toggleSave"
            >
              {{ saved ? 'Gemerkt' : 'Merken' }}
            </button>
          </div>
        </div>
      </div>

      <div aria-hidden="true" class="cs-ticker-band">
        <div class="cs-ticker cs-cond">
          <span v-for="copy in 2" :key="copy">{{ tickerText }}</span>
        </div>
      </div>

      <div class="cs-pad cs-culture py-32" data-testid="brand-culture">
        <div class="cs-reveal">
          <p class="cs-mono m-0 text-xs uppercase tracking-[0.14em] text-[var(--cs-lime)]">
            {{ street.culture.kicker }}
          </p>
          <h2 class="cs-cond m-0 mt-3 cs-culture-title leading-[0.82]">{{ street.culture.title }}</h2>
        </div>
        <div class="cs-reveal text-[19px] leading-relaxed text-[#c9c5bd]">
          <p class="m-0">{{ street.culture.text }}</p>
          <ul class="m-0 mt-7 flex list-none flex-col gap-3 p-0">
            <li
              v-for="moment in street.culture.moments"
              :key="moment.year"
              class="flex items-baseline gap-4 border-t border-[#3a3a3c] pt-3"
            >
              <span class="cs-mono text-sm text-[var(--cs-lime)]">{{ moment.year }}</span>
              <span class="text-[#eeeae2]">{{ moment.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="cs-pad cs-gallery pb-32">
        <img
          v-for="(image, index) in street.gallery"
          :key="image.src"
          :src="image.src"
          :width="image.width"
          :height="image.height"
          :alt="image.alt"
          loading="lazy"
          class="cs-reveal"
          :class="index === 0 ? 'cs-gallery-a' : 'cs-gallery-b'"
        />
      </div>
    </section>

    <section id="marke-kollektion" class="mt-14 scroll-mt-24">
      <slot name="products" />
    </section>

    <p class="mt-8 typography-text-xs text-neutral-500">{{ story.footnote }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ArizonaBrandStory } from '~/utils/arizonaBrandStories/types';

const props = defineProps<{ story: ArizonaBrandStory; brandName: string; total?: number }>();
const street = computed(() => props.story.street!);
const localePath = useLocalizedPath();
const { isWishlistItem, interactWithWishlist, loading: wishlistLoading } = useWishlist();

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@500;700&display=swap',
    },
  ],
});

// The huge headline uses the second word of the brand („Colucci“), the full name stays the accessible label
const shortName = computed(() => props.brandName.split(' ').pop() ?? props.brandName);
const tickerText = computed(() => `${street.value.ticker.join(' · ')} · `);

// Look builder
const active = ref(0);
const current = computed(() => street.value.looks[active.value]!);
const thumbs = ref<HTMLButtonElement[]>([]);
const onKeydown = (event: KeyboardEvent) => {
  const count = street.value.looks.length;
  const next: Record<string, number> = {
    ArrowRight: (active.value + 1) % count,
    ArrowDown: (active.value + 1) % count,
    ArrowLeft: (active.value - 1 + count) % count,
    ArrowUp: (active.value - 1 + count) % count,
    Home: 0,
    End: count - 1,
  };
  if (!(event.key in next)) return;
  event.preventDefault();
  active.value = next[event.key]!;
  thumbs.value[active.value]?.focus();
};

const saved = computed(() => isWishlistItem(current.value.variationId));
const toggleSave = () => interactWithWishlist(current.value.variationId, 1);
</script>

<style scoped>
.cs {
  --cs-ink: #161617;
  --cs-paper: #eeeae2;
  --cs-lime: #d7ff3a;
  --cs-ease: cubic-bezier(0.23, 1, 0.32, 1);
}
.cs-dark {
  overflow: hidden;
  background-color: var(--cs-ink);
  color: var(--cs-paper);
  font-family: Archivo, system-ui, sans-serif;
}
.cs-grain {
  background-image: radial-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px);
  background-size: 4px 4px;
}
.cs-pad {
  padding-inline: clamp(16px, 4vw, 56px);
}
.cs-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
.cs-cond,
.cs-name,
:slotted(.cs-drop) {
  font-family: Archivo, system-ui, sans-serif;
  font-stretch: 62%;
  font-weight: 900;
  text-transform: uppercase;
}
.cs-wide {
  font-family: Archivo, system-ui, sans-serif;
  font-stretch: 125%;
  font-weight: 800;
  text-transform: uppercase;
}
:slotted(.cs-drop) {
  font-size: clamp(64px, 9vw, 140px);
  line-height: 0.85;
}
.cs-name {
  margin: 0;
  font-size: clamp(96px, 21vw, 330px);
  line-height: 0.78;
  letter-spacing: -0.01em;
  transition:
    font-stretch 500ms var(--cs-ease),
    letter-spacing 500ms var(--cs-ease);
}
.cs-tape {
  transform: rotate(-4deg);
}

/* Look builder: photo left, controls right from 768px; stacked on phones */
.cs-builder {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
}
@container (min-width: 768px) {
  .cs-builder {
    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
    align-items: stretch;
  }
}
.cs-stage {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #222;
}
.cs-look {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.04);
  transition:
    opacity 420ms ease,
    transform 700ms var(--cs-ease);
}
.cs-look[data-active] {
  opacity: 1;
  transform: scale(1);
}
.cs-look-name {
  position: absolute;
  left: 20px;
  bottom: 12px;
  font-size: clamp(56px, 8vw, 120px);
  line-height: 0.8;
  color: var(--cs-paper);
  mix-blend-mode: difference;
}
.cs-look-no {
  position: absolute;
  right: 20px;
  top: 24px;
  background: var(--cs-paper);
  color: var(--cs-ink);
  padding: 0.5rem 0.75rem;
  font-size: 13px;
  font-weight: 700;
}
.cs-thumb {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border: 0;
  padding: 0;
  background: #222;
  cursor: pointer;
  outline: 3px solid transparent;
  outline-offset: 3px;
  transition:
    transform 160ms var(--cs-ease),
    outline-color 200ms ease;
}
.cs-thumb[data-active] {
  outline-color: var(--cs-lime);
}
.cs-thumb:focus-visible {
  outline-color: var(--cs-paper);
}
.cs-thumb:active {
  transform: scale(0.95);
}

/* Buttons */
.cs-press {
  transition:
    transform 160ms var(--cs-ease),
    background-color 200ms ease,
    color 200ms ease;
}
.cs-press:active {
  transform: scale(0.97);
}
.cs-btn-lime {
  display: inline-flex;
  min-height: 56px;
  align-items: center;
  padding-inline: 1.75rem;
  background: var(--cs-lime);
  color: var(--cs-ink) !important;
  font-size: 15px;
  text-decoration: none !important;
}
.cs-btn-save {
  min-height: 56px;
  padding-inline: 1.4rem;
  border: 2px solid var(--cs-paper);
  background: transparent;
  color: var(--cs-paper);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}
.cs-btn-save[data-saved] {
  background: var(--cs-paper);
  color: var(--cs-ink);
}
.cs-btn-save:disabled {
  opacity: 0.6;
}

/* Ticker */
.cs-ticker-band {
  overflow: hidden;
  background: var(--cs-paper);
  color: var(--cs-ink);
  padding-block: 14px;
  transform: rotate(2deg) scale(1.05);
}
.cs-ticker {
  display: flex;
  width: max-content;
  gap: 2.5rem;
  white-space: nowrap;
  font-size: clamp(36px, 4vw, 56px);
  animation: cs-ticker 30s linear infinite;
}
@keyframes cs-ticker {
  to {
    transform: translateX(-50%);
  }
}

/* Culture + gallery; the condensed title is sized from its column so „Deutschrap“ always fits */
.cs-culture-title {
  font-size: min(150px, calc((100cqw - 48px) / 5.4));
  overflow-wrap: break-word;
}
.cs-culture {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 3rem;
  align-items: center;
}
.cs-gallery {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.cs-gallery img {
  width: 100%;
  object-fit: cover;
}
.cs-gallery-a {
  aspect-ratio: 3 / 4;
  object-position: top;
}
.cs-gallery-b {
  aspect-ratio: 4 / 3;
  object-position: 50% 30%;
  align-self: end;
}
@container (min-width: 768px) {
  .cs-culture {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .cs-culture-title {
    font-size: min(150px, calc((50cqw - 72px) / 5.4));
  }
  .cs-gallery {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  }
}

/* Hover only on real pointers */
.cs-hint {
  display: none;
}
@media (hover: hover) and (pointer: fine) {
  .cs-hint {
    display: block;
  }
  .cs-name:hover {
    font-stretch: 125%;
    letter-spacing: -0.02em;
  }
  .cs-btn-lime:hover {
    background: #fff;
  }
  .cs-btn-save:hover:not([data-saved]) {
    background: rgb(238 234 226 / 0.1);
  }
}

/* One entrance on load, scroll reveals only where scroll timelines exist */
.cs-rise {
  animation: cs-rise 700ms var(--cs-ease) both;
}
@keyframes cs-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}
@supports (animation-timeline: view()) {
  .cs-reveal {
    animation: cs-reveal var(--cs-ease) both;
    animation-timeline: view();
    animation-range: entry 0% entry 55%;
  }
}
@keyframes cs-reveal {
  from {
    opacity: 0;
    transform: translateY(40px) rotate(1deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cs-ticker {
    animation: none;
  }
  .cs-rise,
  .cs-reveal {
    animation-name: cs-fade;
  }
  .cs-look,
  .cs-name {
    transition: opacity 300ms ease;
  }
}
@keyframes cs-fade {
  from {
    opacity: 0;
  }
}
</style>
