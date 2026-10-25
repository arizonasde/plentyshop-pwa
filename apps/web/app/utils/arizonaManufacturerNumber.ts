import type { Product, VariationProperty } from '@plentymarkets/shop-api';
import { productGetters, productPropertyGetters } from '@plentymarkets/shop-api';

/**
 * Arizona: the manufacturer number is a variation property ("Herstellernummer"). It is shown in the "Artikeldetails"
 * instead of next to the buy button.
 */
export const isArizonaManufacturerNumber = (property: VariationProperty) =>
  /herstellernummer/i.test(productPropertyGetters.getPropertyName(property) ?? '');

export const getArizonaManufacturerNumber = (product: Product | undefined) => {
  if (!product || !Object.keys(product).length) return '';
  const property = productGetters
    .getPropertyGroups(product)
    .flatMap((group) => group.properties ?? [])
    .find(isArizonaManufacturerNumber);
  return property ? String(productPropertyGetters.getPropertyValue(property) ?? '').trim() : '';
};
