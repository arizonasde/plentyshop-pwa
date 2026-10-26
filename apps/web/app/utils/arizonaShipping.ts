/**
 * Arizona shipping terms, mirroring shipping profile "DHL Paket DE" (18) in plentyONE:
 * 4.90 EUR per order within Germany, free from 99 EUR item value. Other countries keep their own rates.
 */
export const ARIZONA_SHIPPING_COST = 4.9;
export const ARIZONA_FREE_SHIPPING_FROM = 99;
export const ARIZONA_FREE_SHIPPING_COUNTRY_ID = 1;

export const getArizonaFreeShippingProgress = (itemSum: number) => {
  const sum = Math.max(0, Number(itemSum) || 0);
  const remaining = Math.max(0, Math.round((ARIZONA_FREE_SHIPPING_FROM - sum) * 100) / 100);
  return {
    remaining,
    percent: Math.min(100, Math.round((sum / ARIZONA_FREE_SHIPPING_FROM) * 100)),
    reached: remaining === 0,
  };
};
