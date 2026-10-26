import { productGetters, type Product } from '@plentymarkets/shop-api';

/**
 * Arizona: every colour of an item is its own card. Groups a product list by item so each card can preview the
 * other colours of the same item.
 */
export const groupArizonaColorVariants = (products: Product[]) => {
  const groups = new Map<string, Product[]>();
  for (const product of products) {
    const itemId = String(productGetters.getItemId(product));
    groups.set(itemId, [...(groups.get(itemId) ?? []), product]);
  }
  return (product: Product): Product[] =>
    (groups.get(String(productGetters.getItemId(product))) ?? []).filter(
      (sibling) => productGetters.getVariationId(sibling) !== productGetters.getVariationId(product),
    );
};
