/**
 * Arizona: facts that `shop_bestseller.py` puts into the webspace once a day – items sold at least 5 times in the
 * last 7 days ({itemId: pieces}) and the rating summary of the Trustami profile. Loaded once per visit in the
 * browser; the `v` parameter changes every hour so the CDN delivers a fresh file.
 */
const FACTS_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-bestand/';

export const useArizonaShopFacts = () => {
  const bestseller = useState<Record<string, number> | null>('arizonaBestseller', () => null);
  const rating = useState<{ note: number; anzahl: number; positiv: number | null; link: string } | null>(
    'arizonaRating',
    () => null,
  );
  const loading = useState('arizonaShopFactsLoading', () => false);

  const load = async () => {
    if (!import.meta.client || loading.value || (bestseller.value && rating.value)) return;
    loading.value = true;
    const query = { v: Math.floor(Date.now() / 3_600_000) };
    const [sold, trust] = await Promise.allSettled([
      $fetch<Record<string, number>>(`${FACTS_URL}bestseller.json`, { query }),
      $fetch<{ note: number; anzahl: number; positiv: number | null; link: string }>(`${FACTS_URL}vertrauen.json`, {
        query,
      }),
    ]);
    if (sold.status === 'fulfilled') bestseller.value = sold.value;
    if (trust.status === 'fulfilled') rating.value = trust.value;
    loading.value = false;
  };

  onMounted(load);

  return { bestseller, rating };
};
