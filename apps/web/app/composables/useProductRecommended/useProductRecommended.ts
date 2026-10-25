import type { FacetSearchCriteria, Product } from '@plentymarkets/shop-api';

/**
 * Composable for managing recommended products data
 * @param categoryId Product slug
 * @return UseProductRecommendedReturn
 * @example
 * ``` ts
 * const { data, loading, fetchProductRecommended } = useProductRecommended('1');
 * ```
 */
export const useProductRecommended: UseProductRecommendedReturn = (categoryId: string) => {
  const state = useState<UseProductRecommendedState>(`useProductRecommended-${categoryId}`, () => ({
    data: [],
    loading: false,
  }));

  /** Function for fetching product recommended data
   * @return FetchProductRecommended
   * @example
   * ``` ts
   * fetchProductRecommended('1');
   * ```
   * @param params
   */
  const fetchProductRecommended: FetchProductRecommended = async (params) => {
    state.value.loading = true;

    // Arizona: fixed list of variations, kept in the given order
    if (params.type === 'variations') {
      const ids = (params.variationIds ?? '')
        .split(',')
        .map((id) => Number(id.trim()))
        .filter((id) => id > 0);
      if (ids.length === 0) {
        state.value.loading = false;
        return state.value.data;
      }
      const { data, error } = await useAsyncData(`useProductRecommended-variations-${ids.join('-')}`, () =>
        useSdk().plentysystems.getProductsByIds({ variationIds: ids }),
      );
      useHandleError(error.value ?? null);
      const products = data.value?.data?.products ?? [];
      const position = (product: Product) => ids.indexOf(Number(product.variation?.id));
      state.value.data = products.length ? [...products].sort((a, b) => position(a) - position(b)) : state.value.data;
      state.value.loading = false;
      return state.value.data;
    }

    const common = {
      itemsPerPage: 20,
      sort: params.sort || 'sorting.price.avg_asc',
      type: params.type as FacetSearchCriteria['type'],
    };

    const payload =
      params.type === 'last_seen'
        ? { type: params.type as FacetSearchCriteria['type'] }
        : {
            ...common,
            itemId: params.itemId,
            crossSellingRelation: params.crossSellingRelation,
            categoryId: params.categoryId,
          };

    const idForKey = params.type === 'cross_selling' ? params.itemId : params.categoryId;

    const { data, error } = await useAsyncData(
      `useProductRecommended-${params.type}-${idForKey}-${params.crossSellingRelation}-${params.sort ?? ''}`,
      () => useSdk().plentysystems.getFacet(payload),
    );

    useHandleError(error.value ?? null);
    state.value.data = data?.value?.data?.products ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  return {
    fetchProductRecommended,
    ...toRefs(state.value),
  };
};
