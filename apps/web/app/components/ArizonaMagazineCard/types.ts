import type { Product } from '@plentymarkets/shop-api';
import type { ArizonaMagazinePost } from '~/composables/useArizonaMagazine/types';

export type ArizonaMagazineCardProps = {
  post: ArizonaMagazinePost;
  products: Product[];
};
