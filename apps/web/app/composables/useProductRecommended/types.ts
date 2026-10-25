import type { Product, FacetSearchCriteria } from '@plentymarkets/shop-api';

export interface UseProductRecommendedState {
  data: Product[];
  loading: boolean;
}

// Arizona: besides the facet sources, 'variations' loads a fixed, comma-separated list of variation ids
export type ProductRecommendedParams = Omit<FacetSearchCriteria, 'type'> & {
  type?: FacetSearchCriteria['type'] | 'variations';
  variationIds?: string;
};

export type FetchProductRecommended = (params: ProductRecommendedParams) => Promise<Product[]>;

export interface useProductRecommended {
  data: Readonly<Ref<UseProductRecommendedState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductRecommended: FetchProductRecommended;
}

export type UseProductRecommendedReturn = (categoryId: string) => useProductRecommended;
