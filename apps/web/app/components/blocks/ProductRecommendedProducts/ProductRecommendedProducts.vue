<template>
  <div ref="blockRef" v-bind="$attrs">
    <TextContent data-testid="recommended-block" class="pb-4" :text="props.content.text" :index="props.index" />
    <EditorAdmonitionWarning
      v-if="showLastSeenTrackingHint"
      class="m-4"
      data-testid="recommended-last-seen-tracking-hint"
      :title="getEditorTranslation('last-seen-hint-title')"
      :message="getEditorTranslation('last-seen-tracking-disabled-hint')"
    />
    <ProductSlider
      v-if="shouldShowSlider"
      :items="sliderProducts"
      :grid="isVariations && sliderProducts.length <= 4"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsProps } from './types';
import { categoryTreeGetters, productGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';

const props = withDefaults(defineProps<ProductRecommendedProductsProps>(), { shouldLoad: undefined });

const { locale } = useI18n();
const { data: categoryTree } = useCategoryTree();
const { currentProduct } = useProducts();
const { isEditMode } = useEditorState();
const { getBooleanSetting: isLastSeenTrackingEnabled } = useSiteSettings('enableLastSeenTracking');
const blockRef = ref<HTMLElement | null>(null);
const { isNearViewport } = useNearViewport(blockRef, {
  rootMargin: '200px 0px 200px 0px',
  once: true,
});
const itemId = computed(() =>
  Object.keys(currentProduct.value).length
    ? productGetters.getItemId(currentProduct.value)
    : props.content.source.itemId,
);

const firstCategoryId = categoryTree.value?.find((category) => category.type === 'item')?.id || '';
const categoryId = productGetters.getCategoryIds(currentProduct.value)[0] ?? '';

const shouldRenderAfterUpdate = ref(false);

const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.meta.uuid);
const { registerBlockVisibility } = useBlocksVisibility();

const isCategory = computed(() => props.content.source?.type === 'category');
const isProduct = computed(() => props.content.source?.type === 'cross_selling' && itemId.value);
const isLastSeen = computed(() => props.content.source?.type === 'last_seen');
const isSameColor = computed(() => props.content.source?.type === 'same_color' && !!sameColorFacet.value);
const isVariations = computed(() => props.content.source?.type === 'variations' && !!props.content.source?.variationIds);

const showLastSeenTrackingHint = computed(() => isLastSeen.value && isEditMode.value && !isLastSeenTrackingEnabled());

const shouldShowSlider = computed(
  () =>
    showLastSeenTrackingHint.value === false &&
    isNearViewport.value &&
    !!sliderProducts.value.length &&
    (shouldRender.value || shouldRenderAfterUpdate.value),
);

const shouldRender = computed(() => props.shouldLoad === undefined || props.shouldLoad === true);
const shouldFetch = computed(() => {
  return (
    isNearViewport.value &&
    shouldRender.value &&
    (isCategory.value || isProduct.value || isLastSeen.value || isVariations.value || isSameColor.value)
  );
});
// Arizona: colour family of the current product and its main category (e.g. Damen) for 'same_color'
const sameColorFacet = computed(() => {
  if (!Object.keys(currentProduct.value).length) return undefined;
  return getColorFamilyFacetValueId(getShoppingAttributeValue(currentProduct.value, 'color'));
});
// Category path of the current product, read from its URL (e.g. damenmode/kleider/…): [Damen, Kleider & Röcke, …]
const productCategoryPath = computed(() => {
  if (!Object.keys(currentProduct.value).length) return [];
  const segments = productGetters.getUrlPath(currentProduct.value).split('/');
  const path: CategoryTreeItem[] = [];
  let level = categoryTree.value ?? [];
  for (const segment of segments) {
    const node = level.find((category) => categoryTreeGetters.getSlug(category) === segment);
    if (!node) break;
    path.push(node);
    level = node.children ?? [];
  }
  return path;
});
const mainCategoryId = computed(() => String(productCategoryPath.value[0]?.id ?? categoryId ?? ''));
// "similar" items come from the second level (e.g. Kleider & Röcke) – the deepest category is often very small
const similarCategoryId = computed(() =>
  String(productCategoryPath.value[1]?.id ?? productCategoryPath.value[0]?.id ?? categoryId ?? ''),
);

const contentSource = computed(() => ({
  ...props.content.source,
  categoryId:
    props.content.source?.type === 'same_color'
      ? mainCategoryId.value
      : props.content.source?.categoryId ||
        (props.content.source?.type === 'category' && Object.keys(currentProduct.value).length
          ? similarCategoryId.value
          : (categoryId || firstCategoryId || '').toString()),
  itemId: itemId.value,
  ...(props.content.source?.type === 'same_color' && sameColorFacet.value && { facets: String(sameColorFacet.value) }),
}));

// Arizona: on a product page the product itself does not appear in its own sliders. Only there – the last viewed
// product stays in the state after leaving the page and must not be hidden elsewhere (e.g. on the home page).
const route = useRoute();
const isProductPage = computed(() => route.meta?.type === 'product');
const sliderProducts = computed(() =>
  (recommendedProducts.value ?? []).filter(
    (product) =>
      !isProductPage.value || !itemId.value || String(productGetters.getItemId(product)) !== String(itemId.value),
  ),
);

watch(
  shouldFetch,
  async (visible) => {
    if (visible) {
      const products = await fetchProductRecommended(contentSource.value);
      registerBlockVisibility(props.meta.uuid, (products?.length ?? 0) > 0);
      shouldRenderAfterUpdate.value = true;
    }
  },
  { immediate: true },
);

// Arizona: refresh "Zuletzt angesehen" when moving from one product page to the next
watch(itemId, async () => {
  if (!isLastSeen.value || !shouldFetch.value) return;
  const products = await fetchProductRecommended(contentSource.value);
  registerBlockVisibility(props.meta.uuid, (products?.length ?? 0) > 0);
});

watch(
  [
    () => props.content.source?.categoryId,
    () => props.content.source?.itemId,
    () => props.content.source?.type,
    () => props.content.source?.crossSellingRelation,
    () => props.content.source?.sort,
    () => props.content.source?.variationIds,
    () => locale.value,
  ],
  async () => {
    if (
      shouldFetch.value &&
      ((props.content.source?.itemId && props.content.source?.type === 'cross_selling') ||
        (props.content.source?.categoryId && props.content.source?.type === 'category') ||
        props.content.source?.type === 'last_seen' ||
        isVariations.value ||
        isSameColor.value)
    ) {
      const products = await fetchProductRecommended(contentSource.value);
      registerBlockVisibility(props.meta.uuid, (products?.length ?? 0) > 0);
    }
    shouldRenderAfterUpdate.value = true;
  },
);
</script>

<i18n lang="json">
{
  "en": {
    "last-seen-hint-title": "Last seen products",
    "last-seen-tracking-disabled-hint": "The \"Track last seen products\" setting is disabled. Enable it under General » Privacy so this block can show recommendations."
  },
  "de": {
    "last-seen-hint-title": "Last seen products",
    "last-seen-tracking-disabled-hint": "The \"Track last seen products\" setting is disabled. Enable it under General » Privacy so this block can show recommendations."
  }
}
</i18n>
