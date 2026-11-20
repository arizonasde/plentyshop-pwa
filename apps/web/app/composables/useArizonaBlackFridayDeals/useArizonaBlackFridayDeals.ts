/**
 * Arizona: "Black Friday Deals" – the most reduced items of the shop, chosen by bf_deals.py and put into the webspace
 * as { datum, mindest, angebote: [{ itemId, variationId, rabatt, bereich }] }, sorted by discount (highest first).
 * The prices themselves come from plentyONE as always; the file only says which items belong to the deals.
 * Empty during the rest of the year (see arizonaBlackFriday.ts) or when the file is missing.
 */
import type { ArizonaBlackFridayDeal } from './types';

const BF_DEALS_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-bestand/black-friday-deals.json';

export const useArizonaBlackFridayDeals = () => {
  const file = useState<{ mindest?: number; angebote: ArizonaBlackFridayDeal[] } | null>('arizonaBfDeals', () => null);
  const loaded = useState('arizonaBfDealsLoaded', () => false);
  const finished = useState('arizonaBfDealsFinished', () => false);
  const ready = computed(() => Boolean(file.value) || finished.value);

  const load = async () => {
    if (!import.meta.client || loaded.value || file.value) return;
    loaded.value = true;
    try {
      // a local copy can be used for a preview (dev only)
      const url = (import.meta.dev && useRuntimeConfig().public.arizonaBfDealsUrl) || BF_DEALS_URL;
      file.value = await $fetch(String(url), { query: { v: Math.floor(Date.now() / 600_000) } });
    } catch {
      // no file: the banner falls back to today's deals
    } finally {
      finished.value = true;
    }
  };
  onMounted(load);

  const deals = computed(() =>
    [...(file.value?.angebote ?? [])].sort((a, b) => (b.rabatt ?? 0) - (a.rabatt ?? 0)),
  );
  const maxDiscount = computed(() => deals.value[0]?.rabatt ?? 0);
  const minDiscount = computed(() => file.value?.mindest ?? deals.value.at(-1)?.rabatt ?? 0);

  return { deals, maxDiscount, minDiscount, ready };
};
