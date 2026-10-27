import { productGetters, type Product } from '@plentymarkets/shop-api';

/**
 * Arizona: "Angebote des Tages" from the file that tagesangebote.py puts into the webspace
 * ({ datum, ende, angebote: [{ itemId, variationId?, preis, statt, bereich?, unterkategorie? }] }). The deal prices themselves come from
 * plentyONE (sales price 53 "Webshop Tagesangebot", type specialOffer); the file only says which items are
 * today's deals and when the offer ends. Everything stays hidden when the file is missing, empty or expired.
 */
const DEALS_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-bestand/tagesangebote.json';

export const useArizonaDailyDeals = () => {
  const deals = useState<{
    ende: string;
    angebote: {
      itemId: number;
      variationId?: number;
      preis?: number;
      statt?: number;
      bereich?: string;
      unterkategorie?: string;
    }[];
  } | null>('arizonaDailyDeals', () => null);
  const loaded = useState('arizonaDailyDealsLoaded', () => false);
  const finished = useState('arizonaDailyDealsFinished', () => false);
  /** true once the deals file was read (or deals were set otherwise) */
  const ready = computed(() => Boolean(deals.value) || finished.value);

  const now = ref(Date.now());

  const load = async () => {
    // deals that are already set (e.g. for a preview) are kept
    if (!import.meta.client || loaded.value || deals.value) return;
    loaded.value = true;
    try {
      deals.value = await $fetch(DEALS_URL, { query: { v: Math.floor(Date.now() / 600_000) } });
    } catch {
      // no file today: nothing is shown
    } finally {
      finished.value = true;
    }
  };

  let timer: ReturnType<typeof setInterval> | undefined;
  onMounted(() => {
    load();
    timer = setInterval(() => (now.value = Date.now()), 1000);
  });
  onBeforeUnmount(() => clearInterval(timer));

  const endsAt = computed(() => (deals.value?.ende ? new Date(deals.value.ende).getTime() : 0));
  const active = computed(
    () => Boolean(deals.value?.angebote?.length) && endsAt.value > now.value && !Number.isNaN(endsAt.value),
  );
  const offers = computed(() => (active.value ? (deals.value?.angebote ?? []) : []));

  /** Remaining time as "05:12:33" */
  const remaining = computed(() => {
    const seconds = Math.max(0, Math.floor((endsAt.value - now.value) / 1000));
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  });

  const isDeal = (itemId: number | string) => offers.value.some((offer) => String(offer.itemId) === String(itemId));

  /** Highest discount of today's deals in percent (deal price against the regular price), rounded down */
  const maxDiscount = computed(() =>
    Math.max(
      0,
      ...offers.value.map((offer) =>
        offer.preis && offer.statt ? Math.floor((1 - offer.preis / offer.statt) * 100) : 0,
      ),
    ),
  );

  return { offers, active, ready, remaining, isDeal, maxDiscount };
};

/**
 * Loads the items of the given deals: by variation id in packages of 20, deals without a variation id one by one.
 * Items that are no longer available are skipped. Keeps the order of the deals file.
 */
export const loadArizonaDealProducts = async (offers: { itemId: number; variationId?: number }[]) => {
  const sdk = useSdk().plentysystems;
  const withVariation = offers.filter((offer) => offer.variationId).map((offer) => Number(offer.variationId));
  const packages: number[][] = [];
  for (let index = 0; index < withVariation.length; index += 20) packages.push(withVariation.slice(index, index + 20));

  const results = await Promise.all([
    ...packages.map(async (variationIds) => {
      try {
        const { data } = await sdk.getProductsByIds({ variationIds });
        return data?.products ?? [];
      } catch {
        return [];
      }
    }),
    ...offers
      .filter((offer) => !offer.variationId)
      .map(async (offer) => {
        try {
          const { data } = await sdk.getProduct({ id: String(offer.itemId) });
          return data ? [data as Product] : [];
        } catch {
          return [];
        }
      }),
  ]);

  const order = (product: Product) =>
    offers.findIndex((offer) => String(offer.itemId) === String(productGetters.getItemId(product)));
  return results.flat().sort((a, b) => order(a) - order(b));
};
