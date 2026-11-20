import {
  arizonaDealDiscount,
  sortArizonaDealsByDiscount,
  useArizonaDailyDeals,
} from '~/composables/useArizonaDailyDeals/useArizonaDailyDeals';
import type { ArizonaBlackFridayExtraFile } from './types';

/**
 * Arizona: the Black Friday deals = today's deals (tagesangebote.json) plus a small choice of strongly reduced items
 * (black-friday-extra.json from bf_extra.py, same form as the deals file). The prices come from plentyONE as always.
 * Without the extra file only today's deals are shown.
 */
const BF_EXTRA_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-bestand/black-friday-extra.json';

export const useArizonaBlackFridayDeals = () => {
  const { offers, ready: dailyReady } = useArizonaDailyDeals();
  const extra = useState<ArizonaBlackFridayExtraFile | null>('arizonaBfExtra', () => null);
  const loaded = useState('arizonaBfExtraLoaded', () => false);
  const finished = useState('arizonaBfExtraFinished', () => false);

  onMounted(async () => {
    if (loaded.value || extra.value) return;
    loaded.value = true;
    try {
      // a local copy can be used for a preview (dev only)
      const url = (import.meta.dev && useRuntimeConfig().public.arizonaBfExtraUrl) || BF_EXTRA_URL;
      extra.value = await $fetch(String(url), { query: { v: Math.floor(Date.now() / 600_000) } });
    } catch {
      // no extra file: only today's deals
    } finally {
      finished.value = true;
    }
  });

  const ready = computed(() => dailyReady.value && finished.value);
  const extraOffers = computed(() => {
    const daily = new Set(offers.value.map((offer) => String(offer.itemId)));
    return (extra.value?.angebote ?? []).filter((offer) => !daily.has(String(offer.itemId)));
  });

  /** all deals, highest discount first */
  const deals = computed(() => sortArizonaDealsByDiscount([...offers.value, ...extraOffers.value]));

  /** for the slider: strongly reduced items and today's deals in turn, each group highest discount first */
  const mixed = computed(() => {
    const a = sortArizonaDealsByDiscount(extraOffers.value);
    const b = sortArizonaDealsByDiscount(offers.value);
    return Array.from({ length: Math.max(a.length, b.length) }, (_, index) => [a[index], b[index]])
      .flat()
      .filter((offer) => offer !== undefined);
  });

  // rounded like the badge on the product card
  const maxDiscount = computed(() =>
    Math.max(0, ...deals.value.map((offer) => Math.round(arizonaDealDiscount(offer) * 100))),
  );

  return { deals, mixed, maxDiscount, ready };
};
