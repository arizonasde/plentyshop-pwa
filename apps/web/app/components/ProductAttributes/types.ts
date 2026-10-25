import type { Product, VariationMapProductAttribute } from '@plentymarkets/shop-api';

export type ProductAttributesProps = {
  product: Product;
};

export type AttributeSelectProps = {
  attribute: VariationMapProductAttribute;
  product?: Product;
};

export interface ComponentsMapper {
  [key: string]: object;
}
