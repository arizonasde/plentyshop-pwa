import { productGetters, type Product } from '@plentymarkets/shop-api';
import type { MerchantReturnPolicy, OfferShippingDetails } from 'schema-dts';

/**
 * Shop-specific SEO rules for arizona-shopping.de.
 * Shipping and return terms mirror the live shop (free shipping and returns in DE, 60 days return window).
 */

const SHIPPING_RATES: { countries: string[]; value: number }[] = [
  { countries: ['DE'], value: 0 },
  { countries: ['AT', 'NL', 'FR', 'IT', 'ES'], value: 7.9 },
  { countries: ['CH'], value: 17.9 },
];

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
 * Builds the document title from the product name and a short shop suffix.
 * Drops a leading "[Paket]" marker and shortens the name at a word boundary so the title stays within `maxLength`.
 */
export const buildProductTitle = (name: string, suffix: string, maxLength = 65): string => {
  const cleanName = name.replace(/^\s*\[paket\]\s*/i, '').trim();
  const tail = suffix ? ` | ${suffix}` : '';
  if (cleanName.length + tail.length <= maxLength) return `${cleanName}${tail}`;

  const room = Math.max(maxLength - tail.length - 1, 10);
  const cut = cleanName.slice(0, room);
  const lastSpace = cut.lastIndexOf(' ');
  const shortened = (lastSpace > room / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:–-]+$/, '');
  return `${shortened}…${tail}`;
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
