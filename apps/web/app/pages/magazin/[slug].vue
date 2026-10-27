<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
    <div v-if="post" class="mag" data-testid="arizona-magazine-post">
      <div class="wrap">
        <header class="kopf klein">
          <NuxtLink :to="localePath('/magazin')" class="name serif">Trends <em>&amp;</em> Tipps</NuxtLink>
          <p>Das Modemagazin von Arizona Shopping</p>
        </header>

        <article class="beitrag">
          <figure>
            <img :src="post.bild" :alt="post.titel" fetchpriority="high" />
            <figcaption>Bild KI-bearbeitet, Originalprodukt</figcaption>
          </figure>
          <div>
            <div class="kicker">{{ post.art }} · {{ post.thema }} · {{ arizonaMagazineDate(post.datum) }}</div>
            <!-- the post is the page heading; the magazine name above is only decoration -->
            <h1 class="serif">{{ post.headline }}</h1>
            <p class="dek">{{ post.titel }}</p>
            <p class="text">{{ post.text }}</p>
            <p v-if="post.quelle" class="quelle">
              Thema aufgegriffen von
              <a :href="post.quelle.link" rel="nofollow noopener" target="_blank">
                {{ post.quelle.name }}: „{{ post.quelle.titel }}“</a
              >, {{ post.quelle.datum }}
            </p>
            <NuxtLink v-if="post.kategorie" class="knopf" :to="localePath(post.kategorie)">Jetzt entdecken</NuxtLink>
          </div>
        </article>

        <section v-if="postProducts.length" class="look">
          <div class="kicker">Shop the Look</div>
          <h2 class="serif" style="font-size: 28px; font-weight: 500; font-style: italic; margin: 6px 0 18px">
            Die Teile zum Artikel
          </h2>
          <div class="produkte">
            <ArizonaMagazineProduct
              v-for="product in postProducts"
              :key="productGetters.getVariationId(product)"
              :product="product"
            />
          </div>
        </section>

        <p style="margin-top: 32px">
          <NuxtLink class="mehr" :to="localePath('/magazin')">← Zurück zum Magazin</NuxtLink>
        </p>
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

const breadcrumbs = computed(() => [
  { name: t('common.labels.home'), link: localePath('/') },
  { name: 'Magazin', link: localePath('/magazin') },
  { name: post.value?.headline ?? '', link: localePath(arizonaMagazinePostPath(post.value?.slug ?? '')) },
]);
useArizonaStaticPageHead(post.value.titel, post.value.text);
useHead({ meta: [{ property: 'og:image', content: post.value.bild }] });
</script>

<style src="~/assets/magazine.css"></style>
