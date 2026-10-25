/**
 * Arizona: stock of an item's variations from the stock files that `shop_bestand.py` puts into the webspace
 * (Lager 112, net stock capped at 3 = "more than 2"). The `v` parameter changes every 10 minutes so the CDN
 * delivers a fresh file. Returns undefined for a variation without data.
 */
const STOCK_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/arizona-bestand/';
const SHARDS = 100;

export const useArizonaStock = (itemId: MaybeRefOrGetter<number>) => {
  const stock = useState<Record<string, Record<string, number>>>('arizonaStock', () => ({}));

  const load = async () => {
    const id = toValue(itemId);
    if (!import.meta.client || !id || stock.value[id]) return;
    try {
      const version = Math.floor(Date.now() / 600_000);
      const shard = await $fetch<Record<string, Record<string, number>>>(`${STOCK_URL}${id % SHARDS}.json`, {
        query: { v: version },
      });
      stock.value = { ...stock.value, [id]: shard[id] ?? {} };
    } catch {
      // Without stock data the size selection simply shows no stock hints
    }
  };

  onMounted(load);
  watch(() => toValue(itemId), load);

  const getStock = (variationId: number | undefined) =>
    variationId ? stock.value[toValue(itemId)]?.[String(variationId)] : undefined;

  return { getStock };
};
