<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <div class="mag" data-testid="arizona-magazine">
      <p v-if="!cover" class="wrap leer">Die nächste Ausgabe ist in Arbeit – schau bald wieder vorbei.</p>

      <template v-else>
        <!-- hero: blurred cover image as backdrop, sharp image + headline on top -->
        <section id="titel" class="held">
          <img class="held-hintergrund" :src="cover.bild" alt="" aria-hidden="true" />
          <div class="wrap held-raster">
            <div class="held-text mag-rise">
              <div class="marke-zeile">
                <span class="wortmarke">Trends &amp; Tipps</span>
                <span class="ausgabe">Ausgabe {{ issue }}</span>
              </div>
              <span class="pille pille-akzent">Titelgeschichte · {{ cover.art }}</span>
              <h1 class="anzeige">
                <NuxtLink :to="localePath(arizonaMagazinePostPath(cover.slug))">{{ cover.headline }}</NuxtLink>
              </h1>
              <p class="lead">{{ cover.text }}</p>
              <div class="aktionen">
                <NuxtLink class="knopf mag-press" :to="localePath(arizonaMagazinePostPath(cover.slug))">
                  Artikel lesen <span class="pfeil" aria-hidden="true">→</span>
                </NuxtLink>
                <NuxtLink v-if="cover.kategorie" class="knopf knopf-rand mag-press" :to="localePath(cover.kategorie)">
                  Zum Shop
                </NuxtLink>
              </div>
            </div>
            <NuxtLink
              :to="localePath(arizonaMagazinePostPath(cover.slug))"
              class="held-bild mag-appear mag-press-soft"
              tabindex="-1"
              aria-hidden="true"
            >
              <img :src="cover.bild" :alt="cover.titel" fetchpriority="high" />
              <span class="bild-hinweis">Bild KI-bearbeitet, Originalprodukt</span>
            </NuxtLink>
          </div>
        </section>

        <!-- stories: one circle per topic -->
        <nav class="wrap storys" aria-label="Themen dieser Ausgabe">
          <NuxtLink
            v-for="post in posts"
            :key="post.slug"
            :to="localePath(arizonaMagazinePostPath(post.slug))"
            class="story mag-press"
          >
            <span class="story-ring"><img :src="post.kachel || post.bild" alt="" loading="lazy" /></span>
            <span class="story-name">{{ post.thema }}</span>
          </NuxtLink>
        </nav>

        <section v-if="coverProducts.length" id="look" class="band">
          <div class="wrap">
            <div class="kopfzeile mag-reveal">
              <div>
                <span class="ueber">Shop the Look</span>
                <h2 class="anzeige">Das trägt die Titelgeschichte</h2>
              </div>
              <NuxtLink v-if="cover.kategorie" class="textlink" :to="localePath(cover.kategorie)">
                Alles ansehen <span class="pfeil" aria-hidden="true">→</span>
              </NuxtLink>
            </div>
            <div class="leiste-wisch">
              <ArizonaMagazineProduct
                v-for="product in coverProducts"
                :key="variationKey(product)"
                :product="product"
              />
            </div>
          </div>
        </section>

        <section v-if="rest.length" id="beitraege" class="wrap abschnitt">
          <div class="kopfzeile mag-reveal">
            <div>
              <span class="ueber">In dieser Ausgabe</span>
              <h2 class="anzeige">Lies weiter</h2>
            </div>
            <div v-if="news.length && tips.length" class="filter" role="group" aria-label="Beiträge filtern">
              <button
                v-for="option in filterOptions"
                :key="option.value"
                type="button"
                class="pille pille-knopf mag-press"
                :class="{ 'is-aktiv': filter === option.value }"
                :aria-pressed="filter === option.value"
                @click="filter = option.value"
              >
                {{ option.label }} <span class="anzahl">{{ option.count }}</span>
              </button>
            </div>
          </div>
          <div class="bento">
            <ArizonaMagazineCard
              v-for="(post, index) in shown"
              :key="post.slug"
              class="mag-reveal"
              :class="{ 'is-gross': index === 0 && shown.length > 2 }"
              :post="post"
              :products="productsOf(post)"
            />
            <NuxtLink
              v-if="tips[0] && filter !== 'News'"
              :to="localePath(arizonaMagazinePostPath(tips[0].slug))"
              class="tipp-kachel mag-reveal mag-press-soft"
            >
              <span class="ueber">Tipp der Woche</span>
              <span class="tipp-zitat anzeige">„{{ tips[0].headline.replace(/[.!]$/, '') }}.“</span>
              <span class="textlink">Zum Tipp <span class="pfeil" aria-hidden="true">→</span></span>
            </NuxtLink>
          </div>
        </section>

        <section v-if="shorts.length" id="kurz" class="wrap abschnitt">
          <div class="kopfzeile mag-reveal">
            <div>
              <span class="ueber">Aus der Modewelt</span>
              <h2 class="anzeige">Kurz gemeldet</h2>
            </div>
          </div>
          <div class="leiste-wisch leiste-kurz">
            <a
              v-for="short in shorts"
              :key="short.link"
              :href="short.link"
              rel="nofollow noopener"
              target="_blank"
              class="meldung mag-press-soft"
            >
              <span class="pille">{{ short.quelle }}</span>
              <span class="meldung-titel">{{ short.titel }}</span>
              <span class="meldung-fuss">{{ shortDate(short.datum) }} <span aria-hidden="true">↗</span></span>
            </a>
          </div>
        </section>
      </template>

      <footer class="wrap fuss">
        <span>© Arizona Shopping · Trends &amp; Tipps · Stand {{ today }}</span>
        <span>Bilder KI-bearbeitet mit Originalprodukten · Themen aufgegriffen aus den genannten Quellen</span>
      </footer>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { productGetters, type Product } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
import {
  arizonaMagazinePostPath,
  loadArizonaMagazineProducts,
  useArizonaMagazine,
} from '~/composables/useArizonaMagazine/useArizonaMagazine';
import type { ArizonaMagazineFilter as Filter, ArizonaMagazinePost } from '~/composables/useArizonaMagazine/types';

// Arizona: the fashion magazine "Trends & Tipps" (data from magazin.py, see useArizonaMagazine).
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  layout: false,
  pageType: 'static',
});

const localePath = useLocalizedPath();
const { posts, shorts, cover } = await useArizonaMagazine();

/** every post except the cover story, newest first */
const rest = computed(() => posts.value.filter((post) => post.slug !== cover.value?.slug));
const news = computed(() => rest.value.filter((post) => post.art === 'News'));
const tips = computed(() => rest.value.filter((post) => post.art === 'Tipp'));

const filter = ref<Filter>('alle');
const filterOptions = computed(() => [
  { value: 'alle' as Filter, label: 'Alle', count: rest.value.length },
  { value: 'News' as Filter, label: 'News', count: news.value.length },
  { value: 'Tipp' as Filter, label: 'Tipps', count: tips.value.length },
]);
const shown = computed(() =>
  filter.value === 'alle' ? rest.value : rest.value.filter((post) => post.art === filter.value),
);

const { data: products } = await useAsyncData('arizonaMagazineProducts', () =>
  loadArizonaMagazineProducts(posts.value),
);
const variationKey = (product: Product) => String(productGetters.getVariationId(product));
const productsOf = (post: ArizonaMagazinePost) =>
  post.produkte.map((entry) => products.value?.get(entry.variationId)).filter(Boolean) as Product[];
const coverProducts = computed(() => (cover.value ? productsOf(cover.value) : []));

// issue = calendar week of the cover story
const stand = computed(() => new Date(posts.value.length ? (cover.value?.datum ?? Date.now()) : Date.now()));
const issue = computed(() => {
  const date = new Date(Date.UTC(stand.value.getFullYear(), stand.value.getMonth(), stand.value.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const week = Math.ceil(((date.getTime() - Date.UTC(date.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
  return `${week}/${date.getUTCFullYear()}`;
});
const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const shortDate = (iso: string) => {
  const [, month, day] = iso.split('-');
  return `${day}.${month}.`;
};

const breadcrumbs = [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Magazin', link: localePath('/magazin') },
];
useArizonaStaticPageHead(
  'Trends & Tipps – das Modemagazin',
  'Trends & Tipps, das Modemagazin von Arizona Shopping: aktuelle Modetrends, Styling-Tipps und die passenden Teile zum Nachshoppen.',
);
</script>

<style src="~/assets/magazine.css"></style>
