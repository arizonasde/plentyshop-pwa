<template>
  <!--
    Arizona: German home page, built in code (content in utils/arizonaHomepage.ts).
    Motion rules: one entrance on load (hero), scroll reveals only where CSS scroll timelines exist, press feedback on
    everything pressable, hover effects only on real pointers, reduced motion = no autoplay, no movement.
  -->
  <div class="hp max-w-screen-3xl mx-auto px-4 @md:px-10" data-testid="arizona-homepage">
    <h1 class="sr-only">Arizona Shopping – Mode für Damen und Herren</h1>

    <!-- 1 · Hero: season story with crossfading slides -->
    <section
      class="hp-hero"
      aria-roledescription="Karussell"
      aria-label="Aktuelle Kollektion"
      data-testid="arizona-home-hero"
      @mouseenter="paused = true"
      @mouseleave="paused = false"
      @focusin="paused = true"
      @focusout="paused = false"
    >
      <div class="hp-hero-media">
        <NuxtLink
          v-for="(slide, index) in slides"
          :key="slide.title"
          :to="localePath(slide.link)"
          class="hp-slide-img"
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
              class="h-full w-full object-cover"
            />
          </picture>
        </NuxtLink>
      </div>

      <div class="hp-hero-panel">
        <div class="hp-hero-stack">
          <div
            v-for="(slide, index) in slides"
            :key="slide.title"
            class="hp-hero-copy"
            :data-active="index === active || undefined"
            :aria-hidden="index !== active"
            :inert="index !== active || undefined"
          >
            <p class="hp-kicker">{{ slide.pill }}</p>
            <h2 class="hp-serif hp-hero-title">{{ slide.title }}</h2>
            <p class="mt-4 max-w-md text-base leading-relaxed text-neutral-700">{{ slide.text }}</p>
            <div class="mt-6 flex flex-wrap items-center gap-3">
              <NuxtLink :to="localePath(slide.link)" class="hp-btn hp-btn-dark hp-press">
                {{ slide.cta }}
                <span class="hp-arrow" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
            <ul class="mt-7 flex gap-3" aria-label="Passende Artikel">
              <li v-for="product in slide.products" :key="product.link">
                <NuxtLink :to="localePath(product.link)" class="hp-thumb hp-press">
                  <img :src="product.image" :alt="product.alt" width="72" height="96" loading="lazy" />
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="hp-dots" role="group" aria-label="Motiv wählen">
          <button
            v-for="(slide, index) in slides"
            :key="slide.title"
            type="button"
            class="hp-dot"
            :aria-label="`Motiv ${index + 1}: ${slide.pill}`"
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
    </section>

    <!-- 2 · Service promises -->
    <ul class="hp-promises" aria-label="Unsere Vorteile" data-testid="arizona-home-promises">
      <li v-for="promise in promises" :key="promise.title">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path v-for="(d, i) in promise.icon" :key="i" :d="d" />
        </svg>
        <span>
          <strong>{{ promise.title }}</strong>
          <span>{{ promise.text }}</span>
        </span>
      </li>
    </ul>

    <!-- 3 · Worlds: Damen, Herren, SALE -->
    <nav class="hp-worlds" aria-label="Einkaufswelten" data-testid="arizona-home-worlds">
      <NuxtLink
        v-for="world in worlds"
        :key="world.title"
        :to="localePath(world.link)"
        class="hp-world hp-press hp-reveal"
        :data-sale="world.sale || undefined"
      >
        <span class="hp-serif hp-world-title">{{ world.title }}</span>
        <span class="hp-world-text">{{ world.text }}</span>
        <span class="hp-world-arrow" aria-hidden="true">→</span>
      </NuxtLink>
    </nav>

    <!-- 4 · Popular this week (beliebt.json, written daily) -->
    <section class="hp-section" aria-labelledby="hp-popular" data-testid="arizona-home-popular">
      <header class="hp-head hp-reveal">
        <div>
          <p class="hp-kicker">Diese Woche</p>
          <h2 id="hp-popular" class="hp-serif hp-h2">Gerade besonders beliebt</h2>
        </div>
        <p class="hp-head-text">Diese Lieblingsteile sind diese Woche besonders gefragt – schnell sein lohnt sich.</p>
      </header>
      <ProductRecommendedProducts
        name="ProductRecommendedProducts"
        type="content"
        :meta="{ uuid: 'arizona-home-beliebt' }"
        :content="popularContent"
      />
    </section>

    <!-- 5 · Season story: winter jackets -->
    <section class="hp-story" aria-labelledby="hp-jackets" data-testid="arizona-home-jackets">
      <div class="hp-story-text hp-reveal">
        <p class="hp-kicker">Saison</p>
        <h2 id="hp-jackets" class="hp-serif hp-h2 hp-story-title">Winterjacken –<br />die Lieblinge der Saison</h2>
        <p class="mt-4 max-w-sm leading-relaxed text-neutral-700">
          Teddy, Stepp oder wattiert: warme Jacken für kalte Tage, für Damen und Herren.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/damenmode/jacken/winterjacken')" class="hp-btn hp-btn-dark hp-press">
            Für Damen <span class="hp-arrow" aria-hidden="true">→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/herrenmode/jacken-maentel/jacken')" class="hp-btn hp-btn-line hp-press">
            Für Herren <span class="hp-arrow" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
      <ul class="hp-story-grid">
        <li v-for="jacket in jackets" :key="jacket.link" class="hp-clip">
          <NuxtLink :to="localePath(jacket.link)" class="hp-tile hp-press">
            <picture>
              <source media="(max-width: 767px)" :srcset="jacket.mobile" />
              <img :src="jacket.desktop" :alt="jacket.alt" width="600" height="900" loading="lazy" />
            </picture>
            <span class="hp-tile-label">{{ jacket.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- 6 · New in, Damen / Herren as tabs -->
    <section class="hp-section" aria-labelledby="hp-new" data-testid="arizona-home-new">
      <header class="hp-head hp-reveal">
        <div>
          <p class="hp-kicker">Frisch eingetroffen</p>
          <h2 id="hp-new" class="hp-serif hp-h2">Neu im Shop</h2>
        </div>
        <div class="hp-tabs" role="tablist" aria-label="Neuheiten für">
          <span
            class="hp-tab-indicator"
            aria-hidden="true"
            :style="{ transform: `translateX(${newInIndex * 100}%)` }"
          />
          <button
            v-for="(tab, index) in newIn"
            :id="`hp-tab-${tab.key}`"
            :key="tab.key"
            type="button"
            role="tab"
            class="hp-tab"
            :aria-selected="index === newInIndex"
            :aria-controls="`hp-panel-${tab.key}`"
            @click="newInIndex = index"
          >
            {{ tab.label }}
          </button>
        </div>
      </header>
      <div :id="`hp-panel-${currentNewIn.key}`" role="tabpanel" :aria-labelledby="`hp-tab-${currentNewIn.key}`">
        <ProductRecommendedProducts
          :key="currentNewIn.key"
          name="ProductRecommendedProducts"
          type="content"
          :meta="{ uuid: `arizona-home-neu-${currentNewIn.key}` }"
          :content="newInContent"
        />
        <NuxtLink :to="localePath(currentNewIn.link)" class="hp-more">
          Alle {{ currentNewIn.label }}-Artikel <span class="hp-arrow" aria-hidden="true">→</span>
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
      <header class="hp-head hp-reveal">
        <div>
          <p class="hp-kicker">Trends & Tipps</p>
          <h2 id="hp-magazine" class="hp-serif hp-h2">Aus dem Magazin</h2>
        </div>
        <NuxtLink :to="localePath('/magazin')" class="hp-more !mt-0">
          Zum Magazin <span class="hp-arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </header>
      <ul class="hp-mag">
        <li v-for="post in magazinePosts" :key="post.slug" class="hp-reveal">
          <NuxtLink :to="localePath(arizonaMagazinePostPath(post.slug))" class="hp-mag-card hp-press">
            <span class="hp-mag-img">
              <img :src="post.bild" :alt="post.titel" loading="lazy" />
            </span>
            <span class="hp-kicker mt-4 block">{{ post.art }} · {{ post.thema }}</span>
            <span class="hp-serif hp-mag-title">{{ post.headline }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- 8 · Brands as a slow marquee -->
    <section class="hp-brands" aria-labelledby="hp-brands" data-testid="arizona-home-brands">
      <header class="hp-head hp-reveal">
        <div>
          <p class="hp-kicker">{{ brands.length }} Marken</p>
          <h2 id="hp-brands" class="hp-serif hp-h2">Unsere Marken</h2>
        </div>
        <NuxtLink :to="localePath('/marken')" class="hp-more !mt-0">
          Alle Marken ansehen <span class="hp-arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </header>
      <div v-for="(row, rowIndex) in brandRows" :key="rowIndex" class="hp-marquee" :data-reverse="rowIndex === 1 || undefined">
        <ul class="hp-marquee-track">
          <li v-for="brand in row" :key="brand.slug">
            <NuxtLink :to="localePath(`/marken/${brand.slug}`)" class="hp-brand">{{ brand.name }}</NuxtLink>
          </li>
        </ul>
        <ul class="hp-marquee-track" aria-hidden="true">
          <li v-for="brand in row" :key="brand.slug">
            <NuxtLink :to="localePath(`/marken/${brand.slug}`)" class="hp-brand" tabindex="-1">{{ brand.name }}</NuxtLink>
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
import {
  arizonaMagazinePostPath,
  useArizonaMagazine,
} from '~/composables/useArizonaMagazine/useArizonaMagazine';
import { ARIZONA_BRANDS } from '~/utils/arizonaBrands';
import {
  ARIZONA_HOME_JACKETS,
  ARIZONA_HOME_NEW_IN,
  ARIZONA_HOME_POPULAR_FALLBACK,
  ARIZONA_HOME_SLIDES,
} from '~/utils/arizonaHomepage';

const localePath = useLocalizedPath();

/* Hero: the progress bar of the active dot is a CSS animation; when it ends the next slide shows. Hover, focus and a
   hidden tab pause it, reduced motion switches autoplay off. */
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

const promises = [
  { title: 'Gratis-Versand', text: 'ab 99 € mit DHL', icon: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7', 'M7 19a2 2 0 1 0 0-.01', 'M17 19a2 2 0 1 0 0-.01'] },
  { title: '1–3 Werktage', text: 'schnelle Lieferung', icon: ['M12 7v5l3 2', 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18'] },
  { title: '60 Tage', text: 'kostenlose Rückgabe', icon: ['M4 12a8 8 0 1 0 2.3-5.6', 'M4 4v4h4'] },
  { title: 'Kauf auf Rechnung', text: 'PayPal, Klarna, Karte', icon: ['M3 6h18v12H3z', 'M3 10h18', 'M7 15h4'] },
];

const worlds = [
  { title: 'Damen', text: 'Jacken, Strick, Jeans & mehr', link: '/damenmode', sale: false },
  { title: 'Herren', text: 'Jacken, Hoodies, Jeans & mehr', link: '/herrenmode', sale: false },
  { title: 'SALE', text: 'Reduziert & Outlet', link: '/sale-und-outlet', sale: true },
];

const jackets = ARIZONA_HOME_JACKETS;

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
  layout: { fullWidth: false },
};

const newIn = ARIZONA_HOME_NEW_IN;
const newInIndex = ref(0);
const currentNewIn = computed(() => newIn[newInIndex.value]!);
const newInContent = computed<ProductRecommendedProductsContent>(() => ({
  source: {
    type: 'category',
    categoryId: currentNewIn.value.categoryId,
    itemId: '',
    crossSellingRelation: 'Similar',
    sort: 'variation.createdAt_desc',
  },
  text: emptyText,
  layout: { fullWidth: false },
}));

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
      '<h2>Neuheiten zuerst erfahren</h2><p>Neue Kollektionen, Aktionen und Tipps aus dem Magazin – direkt in dein Postfach.</p>',
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
  --hp-ink: #1a1a1a;
  --hp-paper: #f4efe8;
  --hp-line: #e4ddd2;
  --hp-red: #c8102e;
  color: var(--hp-ink);
}
.hp-serif {
  font-family: 'Bodoni Moda', Didot, 'Bodoni 72', Georgia, serif;
  font-weight: 500;
  letter-spacing: -0.01em;
}
.hp-kicker {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--hp-red);
}
.hp-h2 {
  font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem);
  line-height: 1.05;
  margin-top: 0.35rem;
  text-wrap: balance;
}

/* ---------- Buttons, press feedback ---------- */
.hp-press {
  transition:
    transform 160ms var(--hp-ease-out),
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;
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
  font-weight: 700;
  text-decoration: none !important;
}
.hp-btn-dark {
  background: var(--hp-ink);
  color: #fff !important;
}
.hp-btn-line {
  border: 1.5px solid var(--hp-ink);
  color: var(--hp-ink) !important;
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
  margin-top: 0.75rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.3em;
  text-decoration-thickness: 1px;
}
@media (hover: hover) and (pointer: fine) {
  .hp-btn-dark:hover {
    background: #3a3a3a;
  }
  .hp-btn-line:hover {
    background: var(--hp-ink);
    color: #fff !important;
  }
  .hp-btn:hover .hp-arrow,
  .hp-more:hover .hp-arrow,
  .hp-world:hover .hp-world-arrow {
    transform: translateX(4px);
  }
}
.hp :focus-visible {
  outline: 2px solid var(--hp-ink);
  outline-offset: 3px;
}

/* ---------- Hero ---------- */
.hp-hero {
  display: grid;
  margin-top: 1rem;
  overflow: hidden;
  border-radius: 1.5rem;
  background: var(--hp-paper);
}
.hp-hero-media {
  position: relative;
  display: grid;
  aspect-ratio: 3 / 2;
}
.hp-slide-img {
  grid-area: 1 / 1;
  opacity: 0;
  transform: scale(1.03);
  filter: blur(6px);
  transition:
    opacity 700ms ease,
    transform 1200ms var(--hp-ease-out),
    filter 700ms ease;
  pointer-events: none;
}
.hp-slide-img[data-active] {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
  pointer-events: auto;
}
.hp-hero-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.75rem 1.25rem 1.5rem;
}
.hp-hero-stack {
  display: grid;
}
.hp-hero-copy {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 300ms ease,
    transform 300ms var(--hp-ease-out);
}
.hp-hero-copy[data-active] {
  opacity: 1;
  transform: none;
  transition-delay: 150ms;
}
.hp-hero-title {
  margin-top: 0.6rem;
  white-space: pre-line;
  font-size: clamp(2.25rem, 1.6rem + 2.6vw, 4rem);
  line-height: 1;
  text-wrap: balance;
}
.hp-thumb {
  display: block;
  width: 64px;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}
.hp-thumb img {
  aspect-ratio: 3 / 4;
  width: 100%;
  object-fit: cover;
}
.hp-dots {
  display: flex;
  gap: 0.5rem;
}
.hp-dot {
  position: relative;
  display: flex;
  height: 44px;
  width: 3.5rem;
  align-items: center;
}
.hp-dot::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  height: 3px;
  border-radius: 9999px;
  background: rgb(26 26 26 / 0.15);
}
.hp-dot-fill {
  position: relative;
  height: 3px;
  width: 100%;
  border-radius: 9999px;
  background: var(--hp-ink);
  transform: scaleX(0);
  transform-origin: left;
}
.hp-dot[aria-current] .hp-dot-fill {
  transform: scaleX(1);
}
.hp-dot-fill[data-running] {
  animation: hp-progress 6500ms linear both;
}
@keyframes hp-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@container (min-width: 768px) {
  .hp-hero {
    grid-template-columns: 1.45fr 1fr;
    margin-top: 1.25rem;
    border-radius: 2rem;
  }
  .hp-hero-media {
    aspect-ratio: auto;
    min-height: 100%;
  }
  .hp-hero-panel {
    padding: 3rem 3rem 2.25rem;
    justify-content: space-between;
  }
  .hp-hero-stack {
    margin-block: auto;
  }
  .hp-thumb {
    width: 76px;
  }
}
@container (min-width: 1280px) {
  .hp-hero-panel {
    padding-inline: 4rem;
  }
}
/* one entrance on load */
.hp-hero-panel {
  animation: hp-rise 700ms var(--hp-ease-out) 80ms both;
}
.hp-hero-media {
  animation: hp-fade 900ms ease both;
}
@keyframes hp-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
@keyframes hp-fade {
  from {
    opacity: 0;
  }
}

/* ---------- Promises ---------- */
.hp-promises {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 0.75rem;
  padding: 1.25rem 0.25rem;
  border-bottom: 1px solid var(--hp-line);
}
.hp-promises li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.8125rem;
  line-height: 1.3;
}
.hp-promises svg {
  flex-shrink: 0;
  margin-top: 1px;
}
.hp-promises strong {
  display: block;
  font-size: 0.875rem;
}
.hp-promises li > span > span {
  color: #5c5750;
}
@container (min-width: 768px) {
  .hp-promises {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: 1.5rem 0.5rem;
  }
  .hp-promises li {
    justify-content: center;
  }
}

/* ---------- Worlds ---------- */
.hp-worlds {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.hp-world {
  position: relative;
  display: flex;
  min-height: 8.5rem;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 1.25rem;
  background: var(--hp-paper);
  padding: 1.1rem 1.1rem 1rem;
  text-decoration: none !important;
  color: var(--hp-ink) !important;
}
.hp-world[data-sale] {
  grid-column: 1 / -1;
  min-height: 5.5rem;
  background: var(--hp-red);
  color: #fff !important;
}
.hp-world-title {
  font-size: clamp(2rem, 1.4rem + 2.4vw, 3.5rem);
  line-height: 0.95;
}
.hp-world[data-sale] .hp-world-title {
  font-family: inherit;
  font-weight: 900;
  letter-spacing: 0.02em;
}
.hp-world-text {
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  opacity: 0.8;
}
.hp-world-arrow {
  position: absolute;
  top: 1rem;
  right: 1.1rem;
  font-size: 1.25rem;
  transition: transform 200ms var(--hp-ease-out);
}
@media (hover: hover) and (pointer: fine) {
  .hp-world:hover {
    background: #ebe3d8;
  }
  .hp-world[data-sale]:hover {
    background: #a50d26;
  }
}
@container (min-width: 768px) {
  .hp-worlds {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    margin-top: 2rem;
  }
  .hp-world,
  .hp-world[data-sale] {
    grid-column: auto;
    min-height: 11rem;
    padding: 1.5rem 1.75rem;
  }
}

/* ---------- Sections ---------- */
.hp-section,
.hp-brands {
  margin-top: 3.5rem;
}
.hp-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  margin-bottom: 1.25rem;
}
.hp-head-text {
  max-width: 26rem;
  color: #5c5750;
  line-height: 1.5;
}
@container (min-width: 768px) {
  .hp-section,
  .hp-brands {
    margin-top: 5rem;
  }
  .hp-head {
    margin-bottom: 1.75rem;
  }
}

/* ---------- Story ---------- */
.hp-story {
  display: grid;
  gap: 1.5rem;
  margin-top: 3.5rem;
  border-radius: 1.5rem;
  background: var(--hp-paper);
  padding: 1.75rem 1.25rem 1.25rem;
}
.hp-story-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}
.hp-tile {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 1rem;
  background: #e9e2d7;
}
.hp-tile img {
  aspect-ratio: 2 / 3;
  width: 100%;
  object-fit: cover;
  transition: transform 600ms var(--hp-ease-out);
}
.hp-tile-label {
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.92);
  padding: 0.3rem 0.65rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--hp-ink);
}
@media (hover: hover) and (pointer: fine) {
  .hp-tile:hover img {
    transform: scale(1.04);
  }
}
@container (min-width: 768px) {
  .hp-story {
    grid-template-columns: minmax(16rem, 0.8fr) 2fr;
    align-items: center;
    gap: 3rem;
    margin-top: 5rem;
    border-radius: 2rem;
    padding: 3rem;
  }
  .hp-story-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
  /* staggered heights like a lookbook */
  .hp-story-grid li:nth-child(even) {
    transform: translateY(2rem);
  }
  .hp-story {
    padding-bottom: 5rem;
  }
  .hp-tile-label {
    left: 0.75rem;
    bottom: 0.75rem;
    font-size: 0.75rem;
  }
}

/* ---------- Tabs ---------- */
.hp-tabs {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-radius: 9999px;
  background: var(--hp-paper);
  padding: 4px;
}
.hp-tab {
  position: relative;
  min-height: 40px;
  min-width: 6.5rem;
  border-radius: 9999px;
  padding: 0 1.1rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: #5c5750;
  transition: color 200ms ease;
}
.hp-tab[aria-selected='true'] {
  color: #fff;
}
.hp-tab-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  border-radius: 9999px;
  background: var(--hp-ink);
  transition: transform 260ms var(--hp-ease-in-out);
}

/* ---------- Magazine ---------- */
.hp-mag {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 78%;
  gap: 0.875rem;
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
  text-decoration: none !important;
  color: var(--hp-ink) !important;
}
.hp-mag-img {
  display: block;
  overflow: hidden;
  border-radius: 1rem;
  background: var(--hp-paper);
}
.hp-mag-img img {
  aspect-ratio: 4 / 3;
  width: 100%;
  object-fit: cover;
  transition: transform 600ms var(--hp-ease-out);
}
.hp-mag-title {
  display: block;
  margin-top: 0.35rem;
  font-size: 1.375rem;
  line-height: 1.15;
  text-wrap: balance;
}
@media (hover: hover) and (pointer: fine) {
  .hp-mag-card:hover img {
    transform: scale(1.04);
  }
}
@container (min-width: 768px) {
  .hp-mag {
    grid-auto-flow: row;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.5rem;
    overflow: visible;
    margin-inline: 0;
    padding-inline: 0;
  }
  .hp-mag-title {
    font-size: 1.625rem;
  }
}

/* ---------- Brands marquee ---------- */
.hp-marquee {
  display: flex;
  overflow: hidden;
  border-top: 1px solid var(--hp-line);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.hp-marquee:last-child {
  border-bottom: 1px solid var(--hp-line);
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
  display: block;
  padding: 0.9rem 1.4rem;
  white-space: nowrap;
  font-family: 'Bodoni Moda', Didot, 'Bodoni 72', Georgia, serif;
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  color: var(--hp-ink) !important;
  text-decoration: none !important;
  transition: color 200ms ease;
}
@media (hover: hover) and (pointer: fine) {
  .hp-brand:hover {
    color: var(--hp-red) !important;
  }
}
@keyframes hp-marquee {
  to {
    transform: translateX(-100%);
  }
}

/* ---------- Newsletter ---------- */
.hp-newsletter {
  margin-top: 3.5rem;
  margin-bottom: 2rem;
  overflow: hidden;
  border-radius: 1.5rem;
  background: var(--hp-paper);
}
.hp-newsletter :deep([data-testid='newsletter-block']) {
  margin-top: 0;
  padding-block: 2.5rem;
}
.hp-newsletter :deep(h2) {
  margin-bottom: 0.5rem;
  font-family: 'Bodoni Moda', Didot, 'Bodoni 72', Georgia, serif;
  font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem);
  font-weight: 500;
  line-height: 1.05;
}
@container (min-width: 768px) {
  .hp-newsletter {
    margin-top: 5rem;
    border-radius: 2rem;
  }
  .hp-newsletter :deep([data-testid='newsletter-block']) {
    padding-block: 3.5rem;
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
}
@keyframes hp-reveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}
@keyframes hp-clip {
  from {
    clip-path: inset(0 0 18% 0 round 1rem);
    opacity: 0.4;
  }
  to {
    clip-path: inset(0 0 0 0 round 1rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hp-slide-img,
  .hp-hero-copy {
    transform: none !important;
    filter: none !important;
  }
  .hp-hero-panel,
  .hp-hero-media {
    animation: hp-fade 300ms ease both;
  }
  .hp-marquee {
    mask-image: none;
  }
  .hp-marquee-track {
    animation: none;
    flex-wrap: wrap;
    flex-shrink: 1;
  }
  .hp-marquee-track[aria-hidden] {
    display: none;
  }
  .hp-reveal,
  .hp-clip {
    animation: none;
  }
  .hp-press:active {
    transform: none;
  }
}
</style>
