/**
 * Arizona: "Angebote des Tages" from the file that tagesangebote.py puts into the webspace
 * ({ datum, ende, angebote: [{ itemId, variationId?, preis, statt }] }). The deal prices themselves come from
 * plentyONE (sales price 53 "Webshop Tagesangebot", type specialOffer); the file only says which items are
 * today's deals and when the offer ends. Everything stays hidden when the file is missing, empty or expired.
 */
const DEALS_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-bestand/tagesangebote.json';

export const useArizonaDailyDeals = () => {
  const deals = useState<{ ende: string; angebote: { itemId: number; variationId?: number }[] } | null>(
    'arizonaDailyDeals',
    () => null,
  );
  const loaded = useState('arizonaDailyDealsLoaded', () => false);
  const now = ref(Date.now());

  const load = async () => {
    if (!import.meta.client || loaded.value) return;
    loaded.value = true;
    try {
      deals.value = await $fetch(DEALS_URL, { query: { v: Math.floor(Date.now() / 600_000) } });
    } catch {
      deals.value = null;
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

  return { offers, active, remaining, isDeal };
};
