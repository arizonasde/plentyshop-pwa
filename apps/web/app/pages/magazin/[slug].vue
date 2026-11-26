<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <div v-if="post" class="mag" data-testid="arizona-magazine-post">
      <!-- hero: blurred picture as backdrop, headline centred, sharp picture below -->
      <section class="held held-artikel">
        <img class="held-hintergrund" :src="post.bild" alt="" aria-hidden="true" />
        <div class="wrap">
          <div class="marke-zeile">
            <NuxtLink :to="localePath('/magazin')" class="zurueck mag-press">
              <span class="pfeil-links" aria-hidden="true">←</span> Trends &amp; Tipps
            </NuxtLink>
            <span class="ausgabe">{{ arizonaMagazineDate(post.datum) }}</span>
          </div>
          <div class="artikel-kopf mag-rise">
            <span class="pille pille-akzent">{{ post.art }} · {{ post.thema }}</span>
            <!-- the post is the page heading -->
            <h1 class="anzeige">{{ post.headline }}</h1>
            <p class="lead">{{ post.titel }}</p>
            <div class="meta">
              <span class="pille pille-glas">{{ readingTime }}</span>
              <span v-if="postProducts.length" class="pille pille-glas">{{ postProducts.length }} Teile im Look</span>
            </div>
          </div>
          <figure class="artikel-bild mag-appear">
            <img :src="post.bild" :alt="post.titel" fetchpriority="high" />
            <figcaption>Bild KI-bearbeitet, Originalprodukt</figcaption>
          </figure>
        </div>
      </section>

      <article class="wrap lesespalte mag-reveal">
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
      </article>

      <section v-if="postProducts.length" class="band">
        <div class="wrap">
          <div class="kopfzeile mag-reveal">
            <div>
              <span class="ueber">Shop the Look</span>
              <h2 class="anzeige">Die Teile zum Artikel</h2>
            </div>
            <NuxtLink v-if="post.kategorie" class="textlink" :to="localePath(post.kategorie)">
              Alles ansehen <span class="pfeil" aria-hidden="true">→</span>
            </NuxtLink>
          </div>
          <div class="leiste-wisch">
            <ArizonaMagazineProduct
              v-for="product in postProducts"
              :key="productGetters.getVariationId(product)"
              :product="product"
            />
          </div>
        </div>
      </section>

      <section v-if="more.length" class="wrap abschnitt">
        <div class="kopfzeile mag-reveal">
          <div>
            <span class="ueber">Weiterlesen</span>
            <h2 class="anzeige">Mehr aus dem Magazin</h2>
          </div>
          <NuxtLink class="textlink" :to="localePath('/magazin')">
            Zur Übersicht <span class="pfeil" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div class="bento bento-drei">
          <ArizonaMagazineCard v-for="entry in more" :key="entry.slug" class="mag-reveal" :post="entry" />
        </div>
      </section>

      <footer class="wrap fuss">
        <span>© Arizona Shopping · Trends &amp; Tipps</span>
        <NuxtLink class="textlink" :to="localePath('/magazin')">← Zurück zum Magazin</NuxtLink>
      </footer>
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
