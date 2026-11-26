import type { Product } from '@plentymarkets/shop-api';
import type { ArizonaMagazinePost } from '~/composables/useArizonaMagazine/types';

export type ArizonaMagazineCardProps = {
  post: ArizonaMagazinePost;
  /** products of the post, shown as a count on the card */
  products?: Product[];
};
