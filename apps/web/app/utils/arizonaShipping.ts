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

/**
 * Shipping costs per delivery country for the /shipping overview, read from the shipping profiles in plentyONE on
 * 25.11.2026 (18 "DHL Paket DE", 34 "DHL Kleinpaket", 20 "DHL Shipping International": regions 102, 106, 108 at 9.90 EUR,
 * no free-shipping threshold) and checked against the live cart. Update together with the profiles.
 */
export const ARIZONA_SHIPPING_COUNTRIES: { country: string; cost: number; freeFrom: number | null }[] = [
  { country: 'Deutschland', cost: ARIZONA_SHIPPING_COST, freeFrom: ARIZONA_FREE_SHIPPING_FROM },
  { country: 'Österreich', cost: 9.9, freeFrom: null },
  { country: 'Belgien', cost: 9.9, freeFrom: null },
  { country: 'Frankreich', cost: 9.9, freeFrom: null },
  { country: 'Italien', cost: 9.9, freeFrom: null },
  { country: 'Niederlande', cost: 9.9, freeFrom: null },
  { country: 'Polen', cost: 9.9, freeFrom: null },
  { country: 'Spanien', cost: 9.9, freeFrom: null },
];
