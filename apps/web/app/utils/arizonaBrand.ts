import { productGetters, type Product } from '@plentymarkets/shop-api';

// Brand names written on purpose in a special way stay as they are (checked against the shop's brands).
const KEEP_AS_IS = new Set(['b.young', 'HaILYS', 'JDY']);
const SHORT_UPPERCASE = new Set(['jdy', 'xl', 'xxl', 'uk', 'usa']);
// Mixed spellings that should still follow the shop's spelling
const FIXED_SPELLING: Record<string, string> = { 'ONLY Carmakoma': 'Only Carmakoma' };

/**
 * Arizona: one way of writing brand names in the shop. Names delivered in capitals or in lower case
 * ("NOISY MAY", "mavi", "ONLY & SONS") become "Noisy May", "Mavi", "Only & Sons"; mixed spellings are kept.
 */
export const formatBrandName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed || KEEP_AS_IS.has(trimmed)) return trimmed;
  if (FIXED_SPELLING[trimmed]) return FIXED_SPELLING[trimmed];
  const isAllUpper = trimmed === trimmed.toUpperCase();
  const isAllLower = trimmed === trimmed.toLowerCase();
  if (!isAllUpper && !isAllLower) return trimmed;

  return trimmed
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((part) => {
      if (SHORT_UPPERCASE.has(part)) return part.toUpperCase();
      const index = part.search(/[a-zäöü]/);
      return index < 0 ? part : part.slice(0, index) + part.charAt(index).toUpperCase() + part.slice(index + 1);
    })
    .join('');
};

/** Brand of a product in the shop's spelling, empty when the product has none. */
export const getBrandName = (product: Product): string =>
  formatBrandName(productGetters.getManufacturer(product)?.externalName ?? '');

/**
 * Arizona: descriptive alternative text for product images instead of the file name,
 * e.g. "Noisy May Damen Kleid Lang Rundhals Langarm Regular Fit – Dunkelgrau, Bild 2".
 * A real alternative text maintained in plentyONE (not a file name) is kept.
 */
export const buildProductImageAlt = (product: Product, maintainedAlt: string, index: number): string => {
  if (maintainedAlt && !/\.(jpe?g|png|webp|gif)$/i.test(maintainedAlt)) return maintainedAlt;
  const color = getShoppingAttributeValue(product, 'color').replace(/-\d+$/, '');
  const name = [getBrandName(product), getDisplayName(product)].filter(Boolean).join(' ');
  return `${name}${color ? ` – ${color}` : ''}, Bild ${index + 1}`;
};
