import { useProductRecommended } from '~/composables/useProductRecommended/useProductRecommended';

describe('useProductRecommended', () => {
  it('should return product recommended', async () => {
    const slug = 'athletic-mens-walking-sneakers';
    const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(slug);

    await fetchProductRecommended({ type: 'category', categoryId: '16' });

    expect(recommendedProducts.value).not.toBeUndefined();
  });

  it('should load last_seen products from the list in the browser, newest first', async () => {
    localStorage.setItem('arizonaLastSeen', JSON.stringify([5, 3]));
    const { fetchProductRecommended } = useProductRecommended('last-seen-block');
    const getProductsByIds = useSdk().plentysystems.getProductsByIds;

    await fetchProductRecommended({ type: 'last_seen', categoryId: '16', itemId: '42' });

    expect(vi.mocked(getProductsByIds).mock.calls.at(-1)?.[0]).toEqual({ variationIds: [5, 3] });
    localStorage.removeItem('arizonaLastSeen');
  });
});
