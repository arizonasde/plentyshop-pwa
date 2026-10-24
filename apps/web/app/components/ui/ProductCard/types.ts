import type { Product } from '@plentymarkets/shop-api';
import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';

export type ProductCardProps = {
  product: Product;
  configuration?: ItemGridContent;
  index?: number;
  isFromWishlist?: boolean;
  isFromSlider?: boolean;
  lazy?: boolean;
  shouldLoadImage?: boolean;
  /** Other colours of the same item that are part of the current listing (Arizona colour preview). */
  colorVariants?: Product[];
};
