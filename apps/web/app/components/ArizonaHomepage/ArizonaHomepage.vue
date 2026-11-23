<template>
  <!--
    Arizona: German home page, built in code (content in utils/arizonaHomepage.ts). Style: big fashion shop, young and
    bold – heavy uppercase type, colour blocks with cut-out products, bento stage, many product rows.
    Motion rules: one entrance on load, scroll reveals only where CSS scroll timelines exist, press feedback on
    everything pressable, hover effects only on real pointers, reduced motion = no autoplay, no tickers, no movement.
  -->
  <div class="hp max-w-screen-3xl mx-auto px-4 @md:px-10" data-testid="arizona-homepage">
    <h1 class="sr-only">Arizona Shopping – Mode für Damen, Herren und Kinder</h1>

    <!-- Ticker: service promises -->
    <div class="hp-ticker" data-testid="arizona-home-ticker">
      <p class="sr-only">{{ ticker.join(' · ') }}</p>
      <div v-for="copy in 2" :key="copy" class="hp-ticker-track" aria-hidden="true">
        <span v-for="text in ticker" :key="text" class="hp-ticker-item">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path :d="SPARK" fill="currentColor" /></svg>
          {{ text }}
        </span>
      </div>
    </div>

      <!-- 1 · Bento stage -->
      <section class="hp-stage" aria-label="Highlights" data-testid="arizona-home-hero">
        <div
          class="hp-stage-main"
          aria-roledescription="Karussell"
          @mouseenter="paused = true"
          @mouseleave="paused = false"
          @focusin="paused = true"
          @focusout="paused = false"
        >
          <NuxtLink
            v-for="(slide, index) in slides"
            :key="slide.link"
            :to="localePath(slide.link)"
            class="hp-slide"
            :data-active="index === active || undefined"
            :aria-hidden="index !== active"
            :tabindex="index === active ? undefined : -1"
          >
            <picture>
              <source media="(max-width: 767px)" :srcset="slide.image.mobile" />
              <img
                :src="slide.image.desktop"
                :alt="slide.image.alt"
                width="1400"
                height="933"
                :fetchpriority="index === 0 ? 'high' : undefined"
                :loading="index === 0 ? 'eager' : 'lazy'"
                class="hp-slide-img"
              />
            </picture>
            <span class="hp-slide-scrim" aria-hidden="true" />
            <span class="hp-slide-copy">
              <span class="hp-chip">{{ slide.kicker }}</span>
              <span class="hp-slide-title">{{ slide.title }}</span>
              <span class="hp-btn hp-btn-white">
                {{ slide.cta }} <span class="hp-arrow" aria-hidden="true">→</span>
              </span>
            </span>
          </NuxtLink>
          <span class="hp-sticker" aria-hidden="true">
            <svg viewBox="0 0 100 100" class="hp-sticker-ring">
              <defs><path id="hp-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs>
              <text><textPath href="#hp-circle">NEU · JEDE · WOCHE · NEU · JEDE · WOCHE ·</textPath></text>
            </svg>
            <span class="hp-sticker-core">NEW</span>
          </span>
          <div class="hp-dots" role="group" aria-label="Motiv wählen">
            <button
              v-for="(slide, index) in slides"
              :key="slide.link"
              type="button"
              class="hp-dot"
              :aria-label="`Motiv ${index + 1}: ${slide.kicker}`"
              :aria-current="index === active ? 'true' : undefined"
              @click="active = index"
            >
              <span
                class="hp-dot-fill"
                :data-running="index === active && autoplay ? '' : undefined"
                :style="{ animationPlayState: paused ? 'paused' : 'running' }"
                @animationend="next"
              />
            </button>
          </div>
        </div>

        <NuxtLink
          v-for="world in worlds"
          :key="world.title"
          :to="localePath(world.link)"
          class="hp-world hp-press"
          :style="{ backgroundColor: world.color }"
        >
          <span class="hp-world-title">{{ world.title }}</span>
          <span class="hp-world-cta">Jetzt shoppen <span class="hp-arrow" aria-hidden="true">→</span></span>
          <img :src="world.image" :alt="world.alt" class="hp-cutout hp-world-img" loading="eager" />
        </NuxtLink>
      </section>

      <!-- 2 · Category tiles -->
      <section class="hp-section" aria-labelledby="hp-cats" data-testid="arizona-home-categories">
        <header class="hp-head">
          <h2 id="hp-cats" class="hp-h2">Shop by <span class="hp-hl">Kategorie</span></h2>
        </header>
        <ul class="hp-cats">
          <li v-for="cat in categories" :key="cat.link">
            <NuxtLink :to="localePath(cat.link)" class="hp-cat hp-press" :style="{ backgroundColor: cat.color }">
              <img :src="cat.image" :alt="`${cat.title} ${cat.sub}`" class="hp-cutout hp-cat-img" loading="lazy" />
              <span class="hp-cat-label">
                <strong>{{ cat.title }}</strong>
                <span>{{ cat.sub }}</span>
              </span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/sale-und-outlet')" class="hp-cat hp-cat-sale hp-press">
              <span class="hp-cat-sale-text">SALE</span>
              <span class="hp-cat-label"><strong>Reduziert</strong><span>&amp; Outlet</span></span>
            </NuxtLink>
          </li>
        </ul>
      </section>

      <!-- 3 · Popular this week (beliebt.json, written daily) -->
      <section class="hp-section" aria-labelledby="hp-popular" data-testid="arizona-home-popular">
        <header class="hp-head">
          <h2 id="hp-popular" class="hp-h2"><span class="hp-hl hp-hl-pink">Gerade</span> beliebt</h2>
          <p class="hp-head-sub">Die Lieblingsteile der Woche – schnell sein lohnt sich.</p>
        </header>
        <ProductRecommendedProducts
          name="ProductRecommendedProducts"
          type="content"
          :meta="{ uuid: 'arizona-home-beliebt' }"
          :content="popularContent"
        />
      </section>

    <!-- 4 · SALE band -->
    <section class="hp-sale hp-reveal" aria-labelledby="hp-sale" data-testid="arizona-home-sale">
      <div class="hp-sale-marquee" aria-hidden="true">
        <span v-for="copy in 2" :key="copy" class="hp-sale-track">
          <span v-for="n in 6" :key="n">SALE <svg viewBox="0 0 24 24" width="40" height="40"><path :d="SPARK" fill="currentColor" /></svg></span>
        </span>
      </div>
      <div class="hp-sale-body">
        <h2 id="hp-sale" class="hp-sale-title">Reduziert.<br />Für alle.</h2>
        <div class="hp-sale-side">
          <p class="hp-sale-text">Damen, Herren und Kinder – stöbere durch alle reduzierten Teile.</p>
          <NuxtLink :to="localePath('/sale-und-outlet')" class="hp-btn hp-btn-white hp-press">
            Zum SALE <span class="hp-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

      <!-- 5 · New in -->
      <section
        v-for="row in newIn"
        :key="row.key"
        class="hp-section"
        :aria-labelledby="`hp-new-${row.key}`"
        :data-testid="`arizona-home-new-${row.key}`"
      >
        <header class="hp-head">
          <h2 :id="`hp-new-${row.key}`" class="hp-h2">
            Neu bei <span class="hp-hl" :class="row.highlight">{{ row.label }}</span>
          </h2>
          <NuxtLink :to="localePath(row.link)" class="hp-more">
            Alle ansehen <span class="hp-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </header>
        <ProductRecommendedProducts
          name="ProductRecommendedProducts"
          type="content"
          :meta="{ uuid: `arizona-home-neu-${row.key}` }"
          :content="newInContent(row.categoryId)"
        />
      </section>

      <!-- 6 · Season bento: winter jackets -->
      <section class="hp-section" aria-labelledby="hp-jackets" data-testid="arizona-home-jackets">
        <div class="hp-bento">
          <div class="hp-bento-text hp-reveal">
            <span class="hp-chip hp-chip-dark">Saison</span>
            <h2 id="hp-jackets" class="hp-bento-title">Jacken&shy;wetter.</h2>
            <p class="hp-bento-sub">Teddy, Stepp oder wattiert – warm durch den Winter.</p>
            <div class="flex flex-wrap gap-2">
              <NuxtLink :to="localePath('/damenmode/jacken/winterjacken')" class="hp-btn hp-btn-black hp-press">
                Damen <span class="hp-arrow" aria-hidden="true">→</span>
              </NuxtLink>
              <NuxtLink :to="localePath('/herrenmode/jacken-maentel/jacken')" class="hp-btn hp-btn-black hp-press">
                Herren <span class="hp-arrow" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
          <NuxtLink
            v-for="jacket in jackets"
            :key="jacket.link"
            :to="localePath(jacket.link)"
            class="hp-bento-tile hp-press hp-clip"
          >
            <picture>
              <source media="(max-width: 767px)" :srcset="jacket.mobile" />
              <img :src="jacket.desktop" :alt="jacket.alt" width="600" height="900" loading="lazy" />
            </picture>
            <span class="hp-chip hp-bento-label">{{ jacket.label }}</span>
          </NuxtLink>
        </div>
      </section>

      <!-- 7 · Magazine -->
      <section
        v-if="magazinePosts.length"
        class="hp-section"
        aria-labelledby="hp-magazine"
        data-testid="arizona-home-magazine"
      >
        <header class="hp-head">
          <h2 id="hp-magazine" class="hp-h2">Trends <span class="hp-hl hp-hl-mint">&amp; Tipps</span></h2>
          <NuxtLink :to="localePath('/magazin')" class="hp-more">
            Zum Magazin <span class="hp-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </header>
        <ul class="hp-mag">
          <li v-for="post in magazinePosts" :key="post.slug" class="hp-reveal">
            <NuxtLink :to="localePath(arizonaMagazinePostPath(post.slug))" class="hp-mag-card hp-press">
              <span class="hp-mag-img">
                <img :src="post.bild" :alt="post.titel" loading="lazy" />
                <span class="hp-chip hp-mag-chip">{{ post.art }}</span>
              </span>
              <span class="hp-mag-title">{{ post.headline }}</span>
            </NuxtLink>
          </li>
        </ul>
      </section>

    <!-- 8 · Brands -->
    <section class="hp-brands" aria-labelledby="hp-brands" data-testid="arizona-home-brands">
      <div class="hp-head hp-brands-head">
        <h2 id="hp-brands" class="hp-h2">Deine Marken. <span class="hp-hl hp-hl-white">Ein Shop.</span></h2>
        <NuxtLink :to="localePath('/marken')" class="hp-more">
          Alle Marken <span class="hp-arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </div>
      <div v-for="(row, rowIndex) in brandRows" :key="rowIndex" class="hp-marquee" :data-reverse="rowIndex === 1 || undefined">
        <ul v-for="copy in 2" :key="copy" class="hp-marquee-track" :aria-hidden="copy === 2 || undefined">
          <li v-for="brand in row" :key="brand.slug">
            <NuxtLink :to="localePath(`/marken/${brand.slug}`)" class="hp-brand" :tabindex="copy === 2 ? -1 : undefined">
              {{ brand.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- 9 · Newsletter -->
      <section class="hp-newsletter hp-reveal" data-testid="arizona-home-newsletter">
        <NewsletterSubscribe name="NewsletterSubscribe" type="content" :content="newsletterContent" />
      </section>
  </div>
</template>

<script setup lang="ts">
import ProductRecommendedProducts from '~/components/blocks/ProductRecommendedProducts/ProductRecommendedProducts.vue';
import NewsletterSubscribe from '~/components/blocks/NewsletterSubscribe/NewsletterSubscribe.vue';
import type { ProductRecommendedProductsContent } from '~/components/blocks/ProductRecommendedProducts/types';
import type { NewsletterSubscribeContent } from '~/components/blocks/NewsletterSubscribe/types';
import { arizonaMagazinePostPath, useArizonaMagazine } from '~/composables/useArizonaMagazine/useArizonaMagazine';
import { ARIZONA_BRANDS } from '~/utils/arizonaBrands';
import {
  ARIZONA_HOME_CATEGORIES,
  ARIZONA_HOME_JACKETS,
  ARIZONA_HOME_POPULAR_FALLBACK,
  ARIZONA_HOME_SLIDES,
  ARIZONA_HOME_TICKER,
  ARIZONA_HOME_WORLDS,
} from '~/utils/arizonaHomepage';

const localePath = useLocalizedPath();
const SPARK = 'M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z';

const ticker = ARIZONA_HOME_TICKER;
const worlds = ARIZONA_HOME_WORLDS;
const categories = ARIZONA_HOME_CATEGORIES;
const jackets = ARIZONA_HOME_JACKETS;

/* Stage: the progress bar of the active dot is a CSS animation; when it ends the next slide shows. Hover, focus and
   a hidden tab pause it, reduced motion switches autoplay off. */
const slides = ARIZONA_HOME_SLIDES;
const active = ref(0);
const paused = ref(false);
const autoplay = ref(false);
const next = () => (active.value = (active.value + 1) % slides.length);
const onVisibility = () => (paused.value = document.hidden);
onMounted(() => {
  autoplay.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('visibilitychange', onVisibility);
});
onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisibility));

const emptyText = { htmlDescription: '', textAlignment: 'left' as const };
const popularContent: ProductRecommendedProductsContent = {
  source: {
    type: 'variations',
    categoryId: '',
    itemId: '',
    crossSellingRelation: 'Similar',
    variationIds: ARIZONA_HOME_POPULAR_FALLBACK,
    variationList: 'beliebt',
  },
  text: emptyText,
  layout: { fullWidth: false, slider: true },
};

const newIn = [
  { key: 'damen', label: 'Damen', categoryId: '44', link: '/damenmode', highlight: 'hp-hl-lilac' },
  { key: 'herren', label: 'Herren', categoryId: '16', link: '/herrenmode', highlight: 'hp-hl-mint' },
];
const newInContent = (categoryId: string): ProductRecommendedProductsContent => ({
  source: { type: 'category', categoryId, itemId: '', crossSellingRelation: 'Similar', sort: 'variation.createdAt_desc' },
  text: emptyText,
  layout: { fullWidth: false },
});

const { posts } = await useArizonaMagazine();
const magazinePosts = computed(() => posts.value.slice(0, 3));

const brands = [...ARIZONA_BRANDS].sort((a, b) => a.name.localeCompare(b.name, 'de'));
const half = Math.ceil(brands.length / 2);
const brandRows = [brands.slice(0, half), brands.slice(half)];

const newsletterContent: NewsletterSubscribeContent = {
  text: {
    bgColor: 'transparent',
    textAlignment: 'center',
    htmlDescription:
      '<h2>Sei zuerst dabei.</h2><p>Neuheiten, Aktionen und Style-Tipps – direkt in dein Postfach.</p>',
  },
  input: { displayNameInput: false, nameIsRequired: false },
  button: { label: 'Anmelden' },
  settings: { emailFolderId: 1 },
};
</script>

<style scoped>
.hp {
  --hp-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --hp-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --hp-ink: #0a0a0a;
  --hp-red: #e5102e;
  --hp-yellow: #ffe45c;
  --hp-pink: #ffc8dd;
  --hp-lilac: #d9ccff;
  --hp-mint: #b8f2d0;
  color: var(--hp-ink);
}
/* ---------- Type ---------- */
.hp-h2 {
  font-size: clamp(1.75rem, 1.2rem + 2.2vw, 3.25rem);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}
.hp-hl {
  display: inline-block;
  padding: 0 0.15em;
  background: var(--hp-yellow);
  transform: rotate(-1.5deg);
}
.hp-hl-pink {
  background: var(--hp-pink);
}
.hp-hl-lilac {
  background: var(--hp-lilac);
}
.hp-hl-mint {
  background: var(--hp-mint);
}
.hp-hl-white {
  background: #fff;
  color: var(--hp-ink);
}
.hp-chip {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  border-radius: 9999px;
  background: #fff;
  padding: 0.3rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--hp-ink);
}
.hp-chip-dark {
  background: var(--hp-ink);
  color: #fff;
}

/* ---------- Buttons, press feedback ---------- */
.hp-press {
  transition:
    transform 160ms var(--hp-ease-out),
    background-color 200ms ease,
    box-shadow 200ms ease;
}
.hp-press:active {
  transform: scale(0.97);
}
.hp-btn {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 0.5rem;
  border-radius: 9999px;
  padding: 0.7rem 1.4rem;
  font-size: 0.9375rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  text-decoration: none !important;
}
.hp-btn-white {
  background: #fff;
  color: var(--hp-ink) !important;
}
.hp-btn-black {
  background: var(--hp-ink);
  color: #fff !important;
}
.hp-arrow {
  display: inline-block;
  transition: transform 200ms var(--hp-ease-out);
}
.hp-more {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.3em;
  color: inherit !important;
}
@media (hover: hover) and (pointer: fine) {
  .hp-btn:hover .hp-arrow,
  .hp-more:hover .hp-arrow,
  .hp-world:hover .hp-arrow,
  .hp-slide:hover .hp-arrow {
    transform: translateX(4px);
  }
  .hp-btn-black:hover {
    background: #333;
  }
}
.hp :focus-visible {
  outline: 3px solid var(--hp-ink);
  outline-offset: 3px;
}

/* ---------- Ticker ---------- */
.hp-ticker {
  display: flex;
  margin-top: 0.25rem;
  overflow: hidden;
  border-radius: 9999px;
  background: var(--hp-ink);
  color: #fff;
}
.hp-ticker-track {
  display: flex;
  flex-shrink: 0;
  animation: hp-marquee 38s linear infinite;
}
.hp-ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1.25rem;
  white-space: nowrap;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.hp-ticker-item svg {
  color: var(--hp-yellow);
}

/* ---------- Stage ---------- */
.hp-stage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  margin-top: 0.75rem;
}
.hp-stage-main {
  position: relative;
  grid-column: 1 / -1;
  display: grid;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 1.25rem;
  background: #222;
  animation: hp-fade 700ms ease both;
}
.hp-slide {
  position: relative;
  grid-area: 1 / 1;
  display: block;
  opacity: 0;
  pointer-events: none;
  transition: opacity 700ms ease;
  color: #fff !important;
  text-decoration: none !important;
}
.hp-slide[data-active] {
  opacity: 1;
  pointer-events: auto;
}
.hp-slide-img {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 30% center;
  transform: scale(1.06);
  transition: transform 6500ms linear;
}
.hp-slide[data-active] .hp-slide-img {
  transform: scale(1);
}
.hp-slide-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgb(0 0 0 / 0) 35%, rgb(0 0 0 / 0.65) 100%);
}
.hp-slide-copy {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 3.25rem;
}
.hp-slide-title {
  white-space: pre-line;
  font-size: clamp(3.25rem, 2rem + 6vw, 8.5rem);
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -0.045em;
  text-transform: uppercase;
}
.hp-slide[data-active] .hp-slide-copy > * {
  animation: hp-rise 600ms var(--hp-ease-out) both;
}
.hp-slide[data-active] .hp-slide-copy > :nth-child(2) {
  animation-delay: 60ms;
}
.hp-slide[data-active] .hp-slide-copy > :nth-child(3) {
  animation-delay: 120ms;
}
.hp-btn-white {
  align-self: flex-start;
}
.hp-sticker {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  height: 5.5rem;
  width: 5.5rem;
  place-items: center;
  border-radius: 9999px;
  background: var(--hp-yellow);
  color: var(--hp-ink);
  pointer-events: none;
}
.hp-sticker-ring {
  position: absolute;
  inset: 0;
  animation: hp-spin 14s linear infinite;
}
.hp-sticker-ring text {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  fill: currentColor;
}
.hp-sticker-core {
  font-size: 1.125rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}
.hp-dots {
  position: absolute;
  left: 1.25rem;
  bottom: 0.75rem;
  display: flex;
  gap: 0.5rem;
}
.hp-dot {
  position: relative;
  display: flex;
  height: 32px;
  width: 2.75rem;
  align-items: center;
}
.hp-dot::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  height: 3px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.35);
}
.hp-dot-fill {
  position: relative;
  height: 3px;
  width: 100%;
  border-radius: 9999px;
  background: #fff;
  transform: scaleX(0);
  transform-origin: left;
}
.hp-dot[aria-current] .hp-dot-fill {
  transform: scaleX(1);
}
.hp-dot-fill[data-running] {
  animation: hp-progress 6500ms linear both;
}
.hp-world {
  position: relative;
  display: flex;
  min-height: 12rem;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1.25rem;
  padding: 1rem;
  color: var(--hp-ink) !important;
  text-decoration: none !important;
  animation: hp-rise 700ms var(--hp-ease-out) 120ms both;
}
.hp-world + .hp-world {
  animation-delay: 180ms;
}
.hp-world-title {
  position: relative;
  z-index: 1;
  font-size: clamp(1.75rem, 1rem + 3vw, 4rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}
.hp-world-cta {
  position: relative;
  z-index: 1;
  margin-top: 0.35rem;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}
.hp-cutout {
  mix-blend-mode: multiply;
  object-fit: contain;
}
.hp-world-img {
  position: absolute;
  right: -8%;
  bottom: -6%;
  height: 78%;
  width: auto;
  max-width: none;
  transform: rotate(-6deg);
  transition: transform 400ms var(--hp-ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .hp-world:hover .hp-world-img {
    transform: rotate(-2deg) scale(1.05);
  }
}
@container (min-width: 768px) {
  .hp-stage {
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  .hp-stage-main {
    grid-column: 1;
    grid-row: 1 / span 2;
    aspect-ratio: auto;
    min-height: 36rem;
    border-radius: 1.75rem;
  }
  .hp-slide-img {
    object-position: center;
  }
  .hp-slide-copy {
    padding: 2.5rem 2.5rem 4rem;
  }
  .hp-dots {
    left: 2.5rem;
    bottom: 1.5rem;
  }
  .hp-sticker {
    top: 1.75rem;
    right: 1.75rem;
    height: 7.5rem;
    width: 7.5rem;
  }
  .hp-sticker-core {
    font-size: 1.5rem;
  }
  .hp-world {
    min-height: 0;
    border-radius: 1.75rem;
    padding: 1.75rem;
  }
}
@container (min-width: 1280px) {
  .hp-stage-main {
    min-height: 42rem;
  }
}

/* ---------- Sections ---------- */
.hp-section {
  margin-top: 3rem;
}
.hp-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  margin-bottom: 1.25rem;
}
.hp-head-sub {
  width: 100%;
  margin-top: -0.25rem;
  color: #555;
}
@container (min-width: 768px) {
  .hp-section {
    margin-top: 4.5rem;
  }
  .hp-head {
    margin-bottom: 1.5rem;
  }
  .hp-head-sub {
    width: auto;
    margin-top: 0;
  }
}

/* ---------- Category tiles ---------- */
.hp-cats {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 42%;
  gap: 0.625rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 1rem;
  scrollbar-width: none;
  margin-inline: -1rem;
  padding-inline: 1rem;
}
.hp-cats li {
  scroll-snap-align: start;
}
.hp-cat {
  position: relative;
  display: block;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 1.25rem;
  color: var(--hp-ink) !important;
  text-decoration: none !important;
}
.hp-cat-img {
  position: absolute;
  inset: 6% 8% 22%;
  height: 72%;
  width: 84%;
  transition: transform 400ms var(--hp-ease-out);
}
.hp-cat-label {
  position: absolute;
  inset: auto 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}
.hp-cat-label strong {
  font-size: 0.9375rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
.hp-cat-label span {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.7;
}
.hp-cat-sale {
  background: var(--hp-red);
  color: #fff !important;
}
.hp-cat-sale-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  transform: rotate(-8deg);
}
.hp-cat-sale .hp-cat-label span {
  opacity: 0.85;
}
@media (hover: hover) and (pointer: fine) {
  .hp-cat:hover .hp-cat-img {
    transform: translateY(-4px) rotate(-3deg) scale(1.05);
  }
}
@container (min-width: 768px) {
  .hp-cats {
    grid-auto-columns: calc((100% - 5 * 1rem) / 6);
    gap: 1rem;
    margin-inline: 0;
    padding-inline: 0;
    scroll-padding-inline: 0;
  }
  .hp-cat-label {
    inset: auto 1rem 1rem;
  }
  .hp-cat-label strong {
    font-size: 1.375rem;
  }
}

/* ---------- SALE band ---------- */
.hp-sale {
  position: relative;
  margin-top: 3rem;
  overflow: hidden;
  border-radius: 1.25rem;
  background: var(--hp-red);
  color: #fff;
}
.hp-sale-marquee {
  display: flex;
  overflow: hidden;
  padding-top: 1rem;
  color: rgb(255 255 255 / 0.22);
}
.hp-sale-track {
  display: flex;
  flex-shrink: 0;
  animation: hp-marquee 30s linear infinite;
}
.hp-sale-track > span {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding-right: 1rem;
  font-size: clamp(4rem, 2rem + 8vw, 10rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.05em;
}
.hp-sale-body {
  position: relative;
  display: grid;
  gap: 1.25rem;
  padding: 1.25rem 1.25rem 2rem;
}
.hp-sale-title {
  font-size: clamp(2.75rem, 1.5rem + 4.5vw, 6rem);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.045em;
  text-transform: uppercase;
}
.hp-sale-side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}
.hp-sale-text {
  max-width: 24rem;
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.4;
}
@container (min-width: 768px) {
  .hp-sale {
    margin-top: 4.5rem;
  }
  .hp-sale-body {
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 2rem;
    padding: 1.5rem 2.5rem 3rem;
  }
}

/* ---------- Season bento ---------- */
.hp-bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
}
.hp-bento-text {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 1.25rem;
  background: var(--hp-lilac);
  padding: 1.5rem 1.25rem;
}
.hp-bento-title {
  font-size: clamp(2.5rem, 1.5rem + 4vw, 5rem);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.045em;
  text-transform: uppercase;
  hyphens: manual;
}
.hp-bento-sub {
  font-weight: 600;
}
.hp-bento-tile {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 1.25rem;
  background: #ddd;
}
.hp-bento-tile img {
  aspect-ratio: 2 / 3;
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 600ms var(--hp-ease-out);
}
.hp-bento-label {
  position: absolute;
  left: 0.625rem;
  bottom: 0.625rem;
}
@media (hover: hover) and (pointer: fine) {
  .hp-bento-tile:hover img {
    transform: scale(1.05);
  }
}
@container (min-width: 768px) {
  .hp-bento {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: auto auto;
    gap: 1rem;
  }
  .hp-bento-text {
    grid-column: 1 / span 2;
    justify-content: flex-end;
    border-radius: 1.75rem;
    padding: 2.5rem;
  }
  .hp-bento-tile {
    border-radius: 1.75rem;
  }
  .hp-bento-tile:nth-of-type(1) {
    grid-column: 3;
    grid-row: 1 / span 2;
  }
  .hp-bento-tile:nth-of-type(2) {
    grid-column: 4;
    grid-row: 1 / span 2;
  }
  .hp-bento-tile:nth-of-type(3) {
    display: none;
  }
  .hp-bento-tile:nth-of-type(4) {
    display: none;
  }
  .hp-bento-label {
    left: 1rem;
    bottom: 1rem;
  }
}
@container (min-width: 1280px) {
  .hp-bento {
    grid-template-columns: 1.4fr repeat(4, minmax(0, 1fr));
  }
  .hp-bento-text {
    grid-column: 1;
    grid-row: 1;
  }
  .hp-bento-tile:nth-of-type(1),
  .hp-bento-tile:nth-of-type(2),
  .hp-bento-tile:nth-of-type(3),
  .hp-bento-tile:nth-of-type(4) {
    display: block;
    grid-row: 1;
    grid-column: auto;
  }
  .hp-bento-tile:nth-of-type(even) {
    margin-top: 3rem;
  }
  .hp-bento-tile:nth-of-type(odd) {
    margin-bottom: 3rem;
  }
}

/* ---------- Magazine ---------- */
.hp-mag {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 80%;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 1rem;
  scrollbar-width: none;
  margin-inline: -1rem;
  padding-inline: 1rem;
}
.hp-mag li {
  scroll-snap-align: start;
}
.hp-mag-card {
  display: block;
  color: var(--hp-ink) !important;
  text-decoration: none !important;
}
.hp-mag-img {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 1.25rem;
  background: #eee;
}
.hp-mag-img img {
  aspect-ratio: 4 / 5;
  width: 100%;
  object-fit: cover;
  transition: transform 600ms var(--hp-ease-out);
}
.hp-mag-chip {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--hp-yellow);
}
.hp-mag-title {
  display: block;
  margin-top: 0.75rem;
  font-size: 1.25rem;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  text-wrap: balance;
}
@media (hover: hover) and (pointer: fine) {
  .hp-mag-card:hover img {
    transform: scale(1.05);
  }
}
@container (min-width: 768px) {
  .hp-mag {
    grid-auto-flow: row;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    overflow: visible;
    margin-inline: 0;
    padding-inline: 0;
  }
  .hp-mag-img {
    border-radius: 1.75rem;
  }
  .hp-mag-img img {
    aspect-ratio: 4 / 3;
  }
  .hp-mag-title {
    font-size: 1.5rem;
  }
}

/* ---------- Brands ---------- */
.hp-brands {
  margin-top: 3rem;
  overflow: hidden;
  border-radius: 1.25rem;
  background: var(--hp-yellow);
  padding: 1.75rem 0 1.25rem;
}
.hp-brands .hp-head {
  margin-bottom: 1rem;
  padding-inline: 1.25rem;
}
.hp-marquee {
  display: flex;
  overflow: hidden;
}
.hp-marquee-track {
  display: flex;
  flex-shrink: 0;
  animation: hp-marquee 70s linear infinite;
}
.hp-marquee[data-reverse] .hp-marquee-track {
  animation-direction: reverse;
  animation-duration: 80s;
}
.hp-marquee:hover .hp-marquee-track,
.hp-marquee:focus-within .hp-marquee-track {
  animation-play-state: paused;
}
.hp-brand {
  display: inline-flex;
  align-items: center;
  margin: 0.3rem;
  border: 2px solid var(--hp-ink);
  border-radius: 9999px;
  padding: 0.5rem 1.1rem;
  white-space: nowrap;
  font-size: clamp(1rem, 0.8rem + 0.8vw, 1.5rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--hp-ink) !important;
  text-decoration: none !important;
  transition:
    background-color 200ms ease,
    color 200ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .hp-brand:hover {
    background: var(--hp-ink);
    color: var(--hp-yellow) !important;
  }
}
@container (min-width: 768px) {
  .hp-brands {
    margin-top: 4.5rem;
    border-radius: 1.75rem;
    padding: 2.5rem 0 2rem;
  }
  .hp-brands .hp-head {
    padding-inline: 2.5rem;
  }
  .hp-sale {
    border-radius: 1.75rem;
  }
}

/* ---------- Newsletter ---------- */
.hp-newsletter {
  margin: 3rem 0 2rem;
  overflow: hidden;
  border-radius: 1.25rem;
  background: var(--hp-ink);
  color: #fff;
}
.hp-newsletter :deep([data-testid='newsletter-block']) {
  margin-top: 0;
  padding-block: 2.5rem;
}
.hp-newsletter :deep(h2) {
  margin-bottom: 0.5rem;
  font-size: clamp(2.25rem, 1.5rem + 3vw, 4.5rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: var(--hp-yellow);
}
.hp-newsletter :deep(label),
.hp-newsletter :deep(p),
.hp-newsletter :deep(a) {
  color: #fff;
}
.hp-newsletter :deep(button[type='submit']) {
  background: var(--hp-yellow);
  color: var(--hp-ink);
  font-weight: 800;
  text-transform: uppercase;
}
@container (min-width: 768px) {
  .hp-newsletter {
    margin-top: 4.5rem;
    border-radius: 1.75rem;
  }
  .hp-newsletter :deep([data-testid='newsletter-block']) {
    padding-block: 4rem;
  }
}

/* ---------- Keyframes ---------- */
@keyframes hp-marquee {
  to {
    transform: translateX(-100%);
  }
}
@keyframes hp-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes hp-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes hp-rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}
@keyframes hp-fade {
  from {
    opacity: 0;
  }
}

/* ---------- Scroll reveals (only with CSS scroll timelines) ---------- */
@supports (animation-timeline: view()) {
  .hp-reveal {
    animation: hp-reveal var(--hp-ease-out) both;
    animation-timeline: view();
    animation-range: entry 0% entry 55%;
  }
  .hp-clip {
    animation: hp-clip var(--hp-ease-out) both;
    animation-timeline: view();
    animation-range: entry 5% cover 30%;
  }
  .hp-cats li {
    animation: hp-reveal var(--hp-ease-out) both;
    animation-timeline: view(inline);
    animation-range: entry 0% entry 80%;
  }
}
@keyframes hp-reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}
@keyframes hp-clip {
  from {
    clip-path: inset(12% 0 0 0 round 1.25rem);
    opacity: 0.3;
  }
  to {
    clip-path: inset(0 0 0 0 round 1.25rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hp-slide-img,
  .hp-world-img {
    transform: none !important;
    transition: none;
  }
  .hp-slide[data-active] .hp-slide-copy > *,
  .hp-world {
    animation: hp-fade 300ms ease both;
  }
  .hp-ticker-track,
  .hp-sale-track,
  .hp-sticker-ring {
    animation: none;
  }
  .hp-ticker-track:nth-child(n + 3),
  .hp-marquee-track[aria-hidden] {
    display: none;
  }
  .hp-marquee-track {
    animation: none;
    flex-wrap: wrap;
    flex-shrink: 1;
  }
  .hp-reveal,
  .hp-clip,
  .hp-cats li {
    animation: none;
  }
  .hp-press:active {
    transform: none;
  }
}
</style>
