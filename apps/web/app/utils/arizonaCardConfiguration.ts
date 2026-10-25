import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';

// Arizona: product cards outside the category grid (sliders, brand pages) look like the cards in the category
// listing – brand first, no rating or cart button, second image on hover, wishlist heart.
export const ARIZONA_CARD_CONFIGURATION: ItemGridContent = {
  cardBorders: false,
  contentAlignment: 'left',
  fields: { title: true, manufacturer: true, rating: false, previewText: false, price: true, addToCart: false },
  fieldsOrder: ['manufacturer', 'title', 'rating', 'previewText', 'price', 'addToCart'],
  fieldsDisabled: ['title'],
  showWishlistButton: true,
  showSecondImageOnHover: true,
  addToCartStyle: 'primary',
  itemsPerRowDesktop: 4,
  itemsPerRowTablet: 3,
  itemsPerRowMobile: 2,
  showItemCount: false,
  itemCountPosition: 'left',
  paginationPosition: 'bottom',
  layout: { fullWidth: false },
};
