<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <div class="mag" data-testid="arizona-magazine">
      <div class="wrap">
        <div class="leiste">
          <span>Ausgabe {{ issue }}</span>
          <span>{{ today }}</span>
        </div>
        <header class="kopf">
          <h1 class="serif">Trends <em>&amp;</em> Tipps</h1>
          <p>Das Modemagazin von Arizona Shopping</p>
        </header>
        <nav>
          <a href="#titel">Titel</a>
          <a v-if="news.length" href="#news">News</a>
          <a v-if="tips.length" href="#tipps">Tipps</a>
          <a v-if="coverProducts.length" href="#look">Shop the Look</a>
        </nav>

        <p v-if="!cover" class="leer">Die nächste Ausgabe ist in Arbeit – schau bald wieder vorbei.</p>

        <template v-else>
          <section id="titel" class="titel">
            <figure>
              <NuxtLink :to="localePath(arizonaMagazinePostPath(cover.slug))">
                <img :src="cover.bild" :alt="cover.titel" fetchpriority="high" />
              </NuxtLink>
              <figcaption>Bild KI-bearbeitet, Originalprodukt</figcaption>
            </figure>
            <div>
              <div class="kicker">Titelgeschichte · {{ cover.art }}</div>
              <h2 class="serif">
                <NuxtLink :to="localePath(arizonaMagazinePostPath(cover.slug))">{{ cover.headline }}</NuxtLink>
              </h2>
              <p class="dek">{{ cover.titel }}</p>
              <p class="text">{{ cover.text }}</p>
              <p v-if="cover.quelle" class="quelle">
                Thema aufgegriffen von
                <a :href="cover.quelle.link" rel="nofollow noopener" target="_blank">
                  {{ cover.quelle.name }}: „{{ cover.quelle.titel }}“</a
                >, {{ cover.quelle.datum }}
              </p>
              <NuxtLink v-if="cover.kategorie" class="knopf" :to="localePath(cover.kategorie)">Jetzt entdecken</NuxtLink>
            </div>
          </section>

          <section v-if="coverProducts.length" id="look" class="look">
            <div class="kicker">Shop the Look</div>
            <h3 class="serif">Die Teile zur Titelgeschichte</h3>
            <div class="produkte">
              <ArizonaMagazineProduct v-for="product in coverProducts" :key="variationKey(product)" :product="product" />
            </div>
          </section>

          <template v-if="news.length || shorts.length">
            <div id="news" class="rubrik"><h3 class="serif">News</h3></div>
            <div class="raster breit">
              <div class="spalte">
                <ArizonaMagazineCard v-for="post in news" :key="post.slug" :post="post" :products="productsOf(post)" />
              </div>
              <aside v-if="shorts.length" class="kurz">
                <div class="kicker">Kurz gemeldet</div>
                <ul>
                  <li v-for="short in shorts.slice(0, 4)" :key="short.link">
                    <a :href="short.link" rel="nofollow noopener" target="_blank">{{ short.titel }}</a>
                    <span>{{ short.quelle }} · {{ shortDate(short.datum) }}</span>
                  </li>
                </ul>
              </aside>
            </div>
          </template>

          <section v-if="tips[0]" class="zitat">
            <p class="serif">„{{ tips[0].headline.replace(/[.!]$/, '') }}.“</p>
            <span>Tipp der Woche</span>
          </section>

          <template v-if="tips.length">
            <div id="tipps" class="rubrik"><h3 class="serif">Tipps</h3></div>
            <div class="raster">
              <ArizonaMagazineCard v-for="post in tips" :key="post.slug" :post="post" :products="productsOf(post)" />
              <aside v-if="shorts.length > 4" class="kurz">
                <div class="kicker">Kurz gemeldet</div>
                <ul>
                  <li v-for="short in shorts.slice(4)" :key="short.link">
                    <a :href="short.link" rel="nofollow noopener" target="_blank">{{ short.titel }}</a>
                    <span>{{ short.quelle }} · {{ shortDate(short.datum) }}</span>
                  </li>
                </ul>
              </aside>
            </div>
          </template>
        </template>

        <footer>
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
  arizonaMagazinePostPath,
  loadArizonaMagazineProducts,
  useArizonaMagazine,
} from '~/composables/useArizonaMagazine/useArizonaMagazine';
import type { ArizonaMagazinePost } from '~/composables/useArizonaMagazine/types';

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

const news = computed(() => posts.value.filter((post) => post.art === 'News' && post.slug !== cover.value?.slug));
const tips = computed(() => posts.value.filter((post) => post.art === 'Tipp' && post.slug !== cover.value?.slug));

const { data: products } = await useAsyncData('arizonaMagazineProducts', () =>
  loadArizonaMagazineProducts(posts.value),
);
const variationKey = (product: Product) => String(productGetters.getVariationId(product));
const productsOf = (post: ArizonaMagazinePost) =>
  post.produkte.map((entry) => products.value?.get(entry.variationId)).filter(Boolean) as Product[];
const coverProducts = computed(() => (cover.value ? productsOf(cover.value) : []));

// issue = calendar week of the magazine file
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
