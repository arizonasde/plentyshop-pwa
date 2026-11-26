<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <div class="mag" data-testid="arizona-magazine">
      <div class="wrap">
        <header class="kopf mag-rise">
          <div class="leiste">
            <span>Ausgabe {{ issue }}</span>
            <span class="leiste-mitte">Mode · Styling · Trends</span>
            <span>{{ today }}</span>
          </div>
          <h1 class="titelzug serif">Trends <em>&amp;</em> Tipps</h1>
          <p class="unterzeile">Das Modemagazin von Arizona Shopping</p>
        </header>

        <nav v-if="cover" class="rubriken mag-rise" aria-label="Rubriken">
          <a class="chip mag-press" href="#titel">Titelgeschichte</a>
          <a v-if="coverProducts.length" class="chip mag-press" href="#look">Shop the Look</a>
          <a v-if="rest.length" class="chip mag-press" href="#beitraege">Beiträge</a>
          <a v-if="shorts.length" class="chip mag-press" href="#kurz">Kurz gemeldet</a>
        </nav>

        <p v-if="!cover" class="leer">Die nächste Ausgabe ist in Arbeit – schau bald wieder vorbei.</p>

        <template v-else>
          <section id="titel" class="cover">
            <figure class="cover-bild mag-appear">
              <NuxtLink :to="localePath(arizonaMagazinePostPath(cover.slug))" class="bildrahmen mag-press-soft">
                <img :src="cover.bild" :alt="cover.titel" fetchpriority="high" />
              </NuxtLink>
              <figcaption>Bild KI-bearbeitet, Originalprodukt</figcaption>
            </figure>
            <div class="cover-text mag-rise mag-rise-late">
              <div class="kicker">Titelgeschichte · {{ cover.art }} · {{ arizonaMagazineDate(cover.datum) }}</div>
              <h2 class="serif">
                <NuxtLink :to="localePath(arizonaMagazinePostPath(cover.slug))">{{ cover.headline }}</NuxtLink>
              </h2>
              <p class="dek">{{ cover.titel }}</p>
              <p class="text">{{ cover.text }}</p>
              <div class="aktionen">
                <NuxtLink class="knopf mag-press" :to="localePath(arizonaMagazinePostPath(cover.slug))">
                  Artikel lesen <span class="pfeil" aria-hidden="true">→</span>
                </NuxtLink>
                <NuxtLink v-if="cover.kategorie" class="knopf knopf-hell mag-press" :to="localePath(cover.kategorie)">
                  Jetzt entdecken
                </NuxtLink>
              </div>
              <p v-if="cover.quelle" class="quelle">
                Thema aufgegriffen von
                <a :href="cover.quelle.link" rel="nofollow noopener" target="_blank">
                  {{ cover.quelle.name }}: „{{ cover.quelle.titel }}“</a
                >, {{ cover.quelle.datum }}
              </p>
            </div>
          </section>

          <section v-if="coverProducts.length" id="look" class="look mag-reveal">
            <div class="abschnitt-kopf">
              <div>
                <div class="kicker">Shop the Look</div>
                <h3 class="serif">Die Teile zur Titelgeschichte</h3>
              </div>
              <NuxtLink v-if="cover.kategorie" class="mehr" :to="localePath(cover.kategorie)">Alle ansehen</NuxtLink>
            </div>
            <div class="produkte">
              <ArizonaMagazineProduct
                v-for="product in coverProducts"
                :key="variationKey(product)"
                :product="product"
              />
            </div>
          </section>

          <section v-if="rest.length" id="beitraege" class="beitraege">
            <div class="abschnitt-kopf mag-reveal">
              <div>
                <div class="kicker">In dieser Ausgabe</div>
                <h3 class="serif">Alle Beiträge</h3>
              </div>
              <div v-if="news.length && tips.length" class="filter" role="group" aria-label="Beiträge filtern">
                <button
                  v-for="option in filterOptions"
                  :key="option.value"
                  type="button"
                  class="chip mag-press"
                  :class="{ 'is-aktiv': filter === option.value }"
                  :aria-pressed="filter === option.value"
                  @click="filter = option.value"
                >
                  {{ option.label }} <span class="anzahl">{{ option.count }}</span>
                </button>
              </div>
            </div>
            <div class="raster">
              <ArizonaMagazineCard
                v-for="post in shown"
                :key="post.slug"
                class="mag-reveal"
                :post="post"
                :products="productsOf(post)"
              />
            </div>
          </section>

          <section v-if="tips[0]" class="zitat mag-reveal">
            <span class="zitat-marke">Tipp der Woche</span>
            <p class="serif">„{{ tips[0].headline.replace(/[.!]$/, '') }}.“</p>
            <NuxtLink class="zitat-link mag-press" :to="localePath(arizonaMagazinePostPath(tips[0].slug))">
              {{ tips[0].titel.replace(/^Modetipp:\s*/, '') }} <span class="pfeil" aria-hidden="true">→</span>
            </NuxtLink>
          </section>

          <section v-if="shorts.length" id="kurz" class="kurz mag-reveal">
            <div class="abschnitt-kopf">
              <div>
                <div class="kicker">Aus der Modewelt</div>
                <h3 class="serif">Kurz gemeldet</h3>
              </div>
            </div>
            <ol>
              <li v-for="(short, index) in shorts" :key="short.link">
                <span class="nummer serif">{{ String(index + 1).padStart(2, '0') }}</span>
                <a :href="short.link" rel="nofollow noopener" target="_blank">
                  <span class="serif">{{ short.titel }}</span>
                  <small>{{ short.quelle }} · {{ shortDate(short.datum) }} <span aria-hidden="true">↗</span></small>
                </a>
              </li>
            </ol>
          </section>
        </template>

        <footer class="fuss">
          <span>© Arizona Shopping · Trends &amp; Tipps</span>
          <span>Bilder KI-bearbeitet mit Originalprodukten · Themen aufgegriffen aus den genannten Quellen</span>
        </footer>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { productGetters, type Product } from '@plentymarkets/shop-api';
import type { Locale } from '#i18n';
import {
  arizonaMagazineDate,
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
