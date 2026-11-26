<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <div v-if="post" class="mag" data-testid="arizona-magazine-post">
      <div class="wrap">
        <header class="kopf-klein">
          <NuxtLink :to="localePath('/magazin')" class="zurueck mag-press">
            <span class="pfeil-links" aria-hidden="true">←</span> Magazin
          </NuxtLink>
          <NuxtLink :to="localePath('/magazin')" class="kopf-name serif">Trends <em>&amp;</em> Tipps</NuxtLink>
          <span class="kopf-datum">{{ arizonaMagazineDate(post.datum) }}</span>
        </header>

        <article class="artikel">
          <div class="artikel-kopf mag-rise">
            <div class="kicker">{{ post.art }} · {{ post.thema }}</div>
            <!-- the post is the page heading; the magazine name above is only decoration -->
            <h1 class="serif">{{ post.headline }}</h1>
            <p class="dek">{{ post.titel }}</p>
            <p class="meta">
              <span>{{ arizonaMagazineDate(post.datum) }}</span>
              <span>{{ readingTime }}</span>
              <span v-if="postProducts.length">{{ postProducts.length }} Teile zum Nachshoppen</span>
            </p>
          </div>

          <div class="artikel-raster">
            <figure class="artikel-bild mag-appear">
              <div class="bildrahmen">
                <img :src="post.bild" :alt="post.titel" fetchpriority="high" />
              </div>
              <figcaption>Bild KI-bearbeitet, Originalprodukt</figcaption>
            </figure>

            <div class="artikel-text mag-rise mag-rise-late">
              <p class="text">{{ post.text }}</p>
              <NuxtLink v-if="post.kategorie" class="knopf mag-press" :to="localePath(post.kategorie)">
                Jetzt entdecken <span class="pfeil" aria-hidden="true">→</span>
              </NuxtLink>
              <p v-if="post.quelle" class="quelle">
                Thema aufgegriffen von
                <a :href="post.quelle.link" rel="nofollow noopener" target="_blank">
                  {{ post.quelle.name }}: „{{ post.quelle.titel }}“</a
                >, {{ post.quelle.datum }}
              </p>

              <section v-if="postProducts.length" class="look look-seite">
                <div class="kicker">Shop the Look</div>
                <h2 class="serif">Die Teile zum Artikel</h2>
                <div class="produkte produkte-zwei">
                  <ArizonaMagazineProduct
                    v-for="product in postProducts"
                    :key="productGetters.getVariationId(product)"
                    :product="product"
                  />
                </div>
              </section>
            </div>
          </div>
        </article>

        <section v-if="more.length" class="beitraege mehr-beitraege">
          <div class="abschnitt-kopf mag-reveal">
            <div>
              <div class="kicker">Weiterlesen</div>
              <h3 class="serif">Mehr aus dem Magazin</h3>
            </div>
            <NuxtLink class="mehr" :to="localePath('/magazin')">Zur Übersicht</NuxtLink>
          </div>
          <div class="raster">
            <ArizonaMagazineCard v-for="entry in more" :key="entry.slug" class="mag-reveal" :post="entry" />
          </div>
        </section>

        <footer class="fuss">
          <span>© Arizona Shopping · Trends &amp; Tipps</span>
          <NuxtLink class="mehr" :to="localePath('/magazin')">← Zurück zum Magazin</NuxtLink>
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

// Arizona: a single magazine post with its own URL, so every post can rank on its own.
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  layout: false,
  pageType: 'static',
});

const route = useRoute();
const localePath = useLocalizedPath();
const { posts } = await useArizonaMagazine();
const post = computed(() => posts.value.find((entry) => entry.slug === String(route.params.slug)));
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Beitrag nicht gefunden' });
}

const { data: products } = await useAsyncData(`arizonaMagazineProducts-${route.params.slug}`, () =>
  loadArizonaMagazineProducts(post.value ? [post.value] : []),
);
const postProducts = computed(
  () =>
    (post.value?.produkte ?? []).map((entry) => products.value?.get(entry.variationId)).filter(Boolean) as Product[],
);

/** up to three other posts, the same kind first */
const more = computed(() => {
  const others = posts.value.filter((entry) => entry.slug !== post.value?.slug);
  return [
    ...others.filter((entry) => entry.art === post.value?.art),
    ...others.filter((entry) => entry.art !== post.value?.art),
  ].slice(0, 3);
});
const readingTime = computed(() => {
  const words = `${post.value?.titel ?? ''} ${post.value?.text ?? ''}`.split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} Min. Lesezeit`;
});

const breadcrumbs = computed(() => [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Magazin', link: localePath('/magazin') },
  { name: post.value?.headline ?? '', link: localePath(arizonaMagazinePostPath(post.value?.slug ?? '')) },
]);
useArizonaStaticPageHead(post.value.titel, post.value.text);
useHead({ meta: [{ property: 'og:image', content: post.value.bild }] });
</script>

<style src="~/assets/magazine.css"></style>
