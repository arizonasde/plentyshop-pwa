import { productGetters, type Product } from '@plentymarkets/shop-api';
import type { ArizonaMagazine, ArizonaMagazinePost } from './types';

/**
 * Arizona: the magazine "Trends & Tipps". magazin.py publishes the released posts to the webspace
 * ({ stand, beitraege: [...], kurz: [...] }, newest first); without the file the magazine stays hidden.
 */
const MAGAZINE_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-magazin/beitraege.json';

export const useArizonaMagazine = async () => {
  const { data } = await useAsyncData('arizonaMagazine', async () => {
    try {
      return await $fetch<ArizonaMagazine>(MAGAZINE_URL, { query: { v: Math.floor(Date.now() / 600_000) } });
    } catch {
      return null;
    }
  });
  const posts = computed(() => data.value?.beitraege ?? []);
  const shorts = computed(() => data.value?.kurz ?? []);
  /** The cover story is the newest news, otherwise the newest post */
  const cover = computed(() => posts.value.find((post) => post.art === 'News') ?? posts.value[0]);
  return { posts, shorts, cover };
};

/** The newest post whose category is the given category path or one of its parents */
export const findArizonaMagazinePost = (posts: ArizonaMagazinePost[], categoryPath: string) => {
  const path = `/${categoryPath.replace(/^\/+|\/+$/g, '')}/`;
  return posts.find((post) => post.kategorie && path.startsWith(post.kategorie));
};

/** Loads the products of the posts (the shown colour via variationId), keyed by variation id */
export const loadArizonaMagazineProducts = async (posts: ArizonaMagazinePost[]) => {
  const variationIds = [...new Set(posts.flatMap((post) => post.produkte.map((product) => product.variationId)))];
  const products = new Map<number, Product>();
  for (let index = 0; index < variationIds.length; index += 20) {
    try {
      const { data } = await useSdk().plentysystems.getProductsByIds({ variationIds: variationIds.slice(index, index + 20) });
      for (const product of data?.products ?? []) products.set(Number(productGetters.getVariationId(product)), product);
    } catch {
      // products that cannot be loaded are left out
    }
  }
  return products;
};

export const arizonaMagazinePostPath = (slug: string) => `/magazin/${slug}`;

export const arizonaMagazineDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
