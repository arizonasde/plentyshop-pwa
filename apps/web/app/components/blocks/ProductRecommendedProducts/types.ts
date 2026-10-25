export type CrossSellingRelationType = 'Accessory' | 'ReplacementPart' | 'Similar' | 'Bundle';

export type ProductRecommendedProductsProps = {
  name: string;
  type: string;
  content: ProductRecommendedProductsContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
  shouldLoad?: boolean;
};

export type ProductRecommendedProductsContent = {
  index?: number;
  cacheKey?: string;
  source: {
    // Arizona: 'variations' shows a fixed list of variations (e.g. the bestsellers of the last days)
    type: 'category' | 'cross_selling' | 'last_seen' | 'variations';
    categoryId: string;
    itemId: string;
    crossSellingRelation: CrossSellingRelationType;
    // Arizona: optional sort order, e.g. 'variation.createdAt_desc' for "new in" sliders (default: price ascending)
    sort?: string;
    // Arizona: comma-separated variation ids for type 'variations', shown in this order
    variationIds?: string;
  };
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    textAlignment?: 'left' | 'center' | 'right';
  };
  layout?: {
    fullWidth?: boolean;
  };
};
export type TextAlign = 'left' | 'center' | 'right';
export type SourceType = 'cross_selling' | 'category' | 'last_seen';
