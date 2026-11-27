import { prepareConfig } from '@vue-storefront/sdk';

/**
 * Arizona: request config that asks the plenty middleware to bypass its response cache.
 *
 * Background (27.11.2026): answers sent with the header `x-config-id` were frozen for days. Luminox product pages
 * showed the creation-day price and "not salable", category lists missed new articles and facet values. The header
 * `noCache` (the same one shop-core sends for `?noCache=1`) returns the current data. Used only for the product
 * detail call and the category/facet listing, so the rest of the shop keeps the cache.
 */
export const arizonaNoCacheConfig = () => prepareConfig({ headers: { noCache: '1' } });
