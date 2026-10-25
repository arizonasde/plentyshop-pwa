import { productGetters, type Product } from '@plentymarkets/shop-api';
import type { MerchantReturnPolicy, OfferShippingDetails } from 'schema-dts';

/**
 * Shop-specific SEO rules for arizona-shopping.de.
 * Shipping and return terms mirror the checkout: DHL to Germany for 4.90 EUR (no free-shipping threshold;
 * items cannot be ordered to other countries), 60 days return window.
 */

const SHIPPING_RATES: { countries: string[]; value: number }[] = [{ countries: ['DE'], value: 4.9 }];

const RETURN_DAYS = 60;

export const buildShippingDetails = (currency: string): OfferShippingDetails[] =>
  SHIPPING_RATES.map(({ countries, value }) => ({
    '@type': 'OfferShippingDetails',
    shippingRate: { '@type': 'MonetaryAmount', value, currency },
    shippingDestination: countries.map((addressCountry) => ({ '@type': 'DefinedRegion', addressCountry })),
    ...(countries.includes('DE') && {
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
      },
    }),
  }));

export const buildReturnPolicy = (): MerchantReturnPolicy => ({
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'DE',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: RETURN_DAYS,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
});

/**
 * Builds the document title: brand, product name and colour plus a short shop suffix,
 * e.g. "NOISY MAY Damen Kleid Lang Rundhals – Dunkelgrau | Arizona Shopping".
 * Drops a leading "[Paket]" marker; when too long only the name is shortened (at a word boundary),
 * so brand and colour stay visible within `maxLength`.
 */
export const buildProductTitle = (
  name: string,
  suffix: string,
  maxLength = 65,
  extras: { brand?: string; color?: string } = {},
): string => {
  const cleanName = name.replace(/^\s*\[paket\]\s*/i, '').trim();
  const brand = extras.brand?.trim() ?? '';
  const color = extras.color?.trim() ?? '';
  const head = brand && !cleanName.toLowerCase().includes(brand.toLowerCase()) ? `${brand} ` : '';
  const colorTail = color && !cleanName.toLowerCase().includes(color.toLowerCase()) ? ` – ${color}` : '';
  const tail = `${colorTail}${suffix ? ` | ${suffix}` : ''}`;
  if (head.length + cleanName.length + tail.length <= maxLength) return `${head}${cleanName}${tail}`;

  const room = Math.max(maxLength - head.length - tail.length - 1, 10);
  const cut = cleanName.slice(0, room);
  const lastSpace = cut.lastIndexOf(' ');
  const shortened = (lastSpace > room / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:–-]+$/, '');
  return `${head}${shortened}…${tail}`;
};

/**
 * Returns the variation that should carry the canonical URL for the current product:
 * the lowest variation id that shares the current variation's value of `groupAttributeId` (e.g. colour),
 * so all sizes of one colour point to a single URL. Returns `undefined` when no grouping applies.
 */
export const getCanonicalVariationId = (product: Product, groupAttributeId: number): number | undefined => {
  if (!groupAttributeId) return undefined;

  const variations = product.variationAttributeMap?.variations ?? [];
  const currentId = productGetters.getVariationId(product);
  const valueOf = (attributes?: { attributeId: number; attributeValueId: number }[]) =>
    attributes?.find((attribute) => attribute.attributeId === groupAttributeId)?.attributeValueId;

  const currentValue = valueOf(variations.find((variation) => variation.variationId === currentId)?.attributes);
  if (currentValue === undefined) return undefined;

  // Lowest id, not "first in stock": the canonical must not move when stock changes.
  const sameGroup = variations
    .filter((variation) => valueOf(variation.attributes) === currentValue)
    .map((variation) => variation.variationId);

  return sameGroup.length > 0 ? Math.min(...sameGroup) : undefined;
};

// Main categories read better with a fashion term in titles ("Herrenmode" instead of "Herren").
const MAIN_CATEGORY_LABELS: Record<string, string> = {
  damen: 'Damenmode',
  herren: 'Herrenmode',
  kinder: 'Kindermode',
  sport: 'Sportbekleidung',
  sale: 'Sale',
};

const tidyCategoryName = (name: string): string => {
  const trimmed = name.replace(/\s+/g, ' ').trim();
  // "SALE" -> "Sale"; short all-caps names (e.g. "XXL") stay untouched
  return trimmed.length > 3 && trimmed === trimmed.toUpperCase()
    ? trimmed.charAt(0) + trimmed.slice(1).toLowerCase()
    : trimmed;
};

/**
 * Builds a readable category label from the category path (main category first),
 * e.g. ["Herren"] -> "Herrenmode", ["Damen", "Jeans", "Slim Fit"] -> "Damen Jeans Slim Fit".
 * Deep paths keep only the main category and the leaf when the full label gets too long.
 */
export const buildCategoryLabel = (path: string[], maxLength = 32): string => {
  const names = path.map(tidyCategoryName).filter(Boolean);
  const [main, ...rest] = names;
  if (!main) return '';
  if (rest.length === 0) return MAIN_CATEGORY_LABELS[main.toLowerCase()] ?? main;

  const full = [main, ...rest.slice(-2)].join(' ');
  return full.length <= maxLength ? full : `${main} ${rest.at(-1)}`;
};

/**
 * Category title without the shop suffix (the title template appends it); the longest phrase that keeps the
 * complete title within `maxLength` wins.
 */
export const buildCategoryTitle = (label: string, suffix: string, maxLength = 65): string => {
  const tailLength = suffix ? ` | ${suffix}`.length : 0;
  const phrase = [' günstig online kaufen', ' günstig kaufen'].find(
    (candidate) => label.length + candidate.length + tailLength <= maxLength,
  );
  return `${label}${phrase ?? ''}`;
};

export const buildCategoryDescription = (label: string): string => {
  const shipping = SHIPPING_RATES[0]?.value.toFixed(2).replace('.', ',');
  return `${label} günstig bei Arizona Shopping kaufen. Versand mit DHL für ${shipping} €, Lieferung in 1–2 Werktagen, ${RETURN_DAYS} Tage Rückgaberecht.`;
};

/**
 * Value of the variation attribute that plentyONE maps to a Google Shopping attribute ("color", "size"),
 * e.g. "Dunkelgrau" or "S"; empty when the variation has none.
 */
export const getShoppingAttributeValue = (product: Product, key: 'color' | 'size'): string => {
  const entry = product.attributes?.find((attribute) => attribute.attribute?.googleShoppingAttribute === key);
  return entry?.value?.names?.name || entry?.value?.backendName || '';
};

/** Plain text for structured data: tags removed, entities decoded, whitespace collapsed, at most `maxLength` chars. */
export const toPlainText = (htmlText: string, maxLength = 5000): string =>
  htmlText
    .replace(/<(br|\/p|\/li|\/h\d)\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);

/**
 * Arizona: slims the category listing response before it is stored and sent to the browser.
 * Cards only use the first two images (main and hover image) and no long description, so the rest is dropped;
 * this roughly halves the HTML of a category page.
 */
export const trimListingProducts = <T extends { data?: { products?: Product[] } }>(response: T): T => {
  for (const product of response?.data?.products ?? []) {
    if (product.images) {
      if (product.images.all?.length > 2) product.images.all = product.images.all.slice(0, 2);
      if (product.images.variation?.length > 2) product.images.variation = product.images.variation.slice(0, 2);
    }
    if (product.texts?.description) product.texts.description = '';
  }
  return response;
};
