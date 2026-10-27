import type { Product } from '@plentymarkets/shop-api';

export type ArizonaMagazineProductProps = {
  product: Product;
  /** "mini": image and price only (cards); otherwise brand, name and price (Shop the Look) */
  mini?: boolean;
};
