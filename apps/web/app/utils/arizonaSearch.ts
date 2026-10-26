import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';

/** Arizona: product cards on the search page use the same settings as the ItemGrid of the category template. */
export const ARIZONA_SEARCH_CARD: ItemGridContent = {
  addToCartStyle: 'primary',
  cardBorders: false,
  contentAlignment: 'left',
  fields: { addToCart: false, manufacturer: true, previewText: false, price: true, rating: false, title: true },
  fieldsDisabled: ['title'],
  fieldsOrder: ['manufacturer', 'title', 'rating', 'previewText', 'price', 'addToCart'],
  itemCountPosition: 'left',
  itemsPerRowDesktop: 5,
  itemsPerRowMobile: 2,
  itemsPerRowTablet: 3,
  paginationPosition: 'bottom',
  showItemCount: true,
  showSecondImageOnHover: true,
  showWishlistButton: true,
  layout: {},
};
