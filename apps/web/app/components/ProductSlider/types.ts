import type { Product } from '@plentymarkets/shop-api';

export type ProductSliderProps = {
  items?: Product[];
  wrapperClass?: string | Record<string, unknown> | unknown[];
  // Arizona: show the products as a full-width grid (e.g. four bestsellers) instead of a scrolling row
  grid?: boolean;
};
