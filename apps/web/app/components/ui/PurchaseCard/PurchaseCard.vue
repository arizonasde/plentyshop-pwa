<template>
  <form
    :class="{ '@md:shadow-lg': configuration?.dropShadow, '@md:border @md:border-neutral-100': configuration?.borders }"
    :style="inlineStyle"
    class="@md:rounded-md"
    data-testid="purchase-card"
    @submit.prevent="handleAddToCart()"
  >
    <div class="relative">
      <div class="drift-zoom-image">
        <section class="@md:p-4">
          <template v-for="key in configuration?.fieldsOrder" :key="isTextBlock(key) ? key.uuid : key">
            <template v-if="isTextBlock(key) && key.visible">
              <div
                :class="{ 'ring-2 ring-blue-500 ring-offset-1 rounded': highlightedUuid === key.uuid }"
                :data-uuid="key.uuid"
                class="mb-2 font-normal typography-text-sm break-words no-preflight rte-prose rte-prose--render transition-all duration-300"
                v-html="renderTextBlock(key.content)"
              />
            </template>
            <template v-if="key === 'itemName' && configuration?.fields.itemName">
              <p
                v-if="brandName"
                class="typography-text-lg font-semibold text-neutral-900 uppercase tracking-wide"
                data-testid="product-brand"
              >
                <!-- Arizona: the brand links to its brand page when there is one -->
                <NuxtLink
                  v-if="brandPage"
                  :to="localePath(`/marken/${brandPage.slug}`)"
                  class="hover:underline underline-offset-4"
                >
                  {{ brandName }}
                </NuxtLink>
                <template v-else>{{ brandName }}</template>
              </p>
              <h1 class="font-normal typography-headline-5 text-neutral-700 break-word mb-2" data-testid="product-name">
                {{ getDisplayName(product) }}
              </h1>
            </template>
            <template v-if="key === 'variationNumber' && configuration?.fields.variationNumber">
              <p
                v-if="productGetters.getVariationNumber(product)"
                class="mb-2 typography-text-sm text-neutral-500"
                data-testid="product-variation-number"
              >
                {{ productGetters.getVariationNumber(product) }}
              </p>
            </template>
            <template v-if="key === 'price' && configuration?.fields.price">
              <div class="flex space-x-2">
                <Price :crossed-price="crossedPrice" :price="priceWithProperties" />
                <div
                  v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0 && showBundleComponents"
                  class="m-auto"
                >
                  <UiTag :size="'sm'" :variant="'secondary'">{{
                    t('product.bundleSavings', { percent: productBundleGetters.getBundleDiscount(product) })
                  }}</UiTag>
                </div>
              </div>
              <LowestPrice :product="product" />
              <BasePrice
                v-if="productGetters.showPricePerUnit(product)"
                :base-price="basePriceSingleValue"
                :unit-content="productGetters.getUnitContent(product)"
                :unit-name="productGetters.getUnitName(product)"
              />
            </template>
            <template v-if="key === 'tags' && configuration?.fields.tags">
              <UiBadges :product="product" :use-availability="false" :use-tags="true" class="mb-2" />
            </template>
            <template v-if="key === 'availability' && configuration?.fields.availability">
              <!-- Arizona: concrete delivery window instead of the availability from plentyONE -->
              <ArizonaDeliveryDate v-if="productGetters.isSalable(product)" class="mb-2" />
              <UiBadges v-else :product="product" :use-availability="true" :use-tags="false" class="mb-2" />
            </template>
            <template v-if="key === 'variationProperties' && configuration?.fields.variationProperties">
              <div class="mb-2 variation-properties">
                <VariationProperties :product="product" />
              </div>
            </template>
            <template v-if="key === 'starRating' && configuration?.fields.starRating">
              <div class="inline-flex items-center mb-2">
                <SfRating
                  :half-increment="true"
                  :max="5"
                  :value="reviewGetters.getAverageRating(reviewAverage, 'half')"
                  size="xs"
                />
                <SfCounter class="ml-1" size="xs">{{ reviewGetters.getTotalReviews(reviewAverage) }}</SfCounter>
                <UiButton
                  class="ml-2 text-xs text-neutral-500 cursor-pointer"
                  data-testid="show-reviews"
                  variant="tertiary"
                  @click="scrollToReviews"
                >
                  {{ t('product.showAllReviews') }}
                </UiButton>
              </div>
            </template>
            <template v-if="key === 'previewText' && configuration?.fields.previewText">
              <div
                v-if="productGetters.getShortDescription(product).length > 0"
                class="mb-2 font-normal typography-text-sm whitespace-pre-line break-words no-preflight"
                data-testid="product-description"
                v-html="productGetters.getShortDescription(product)"
              />
            </template>

            <!-- Arizona: the wishlist button sits next to "In den Warenkorb" (see the add to cart area) -->

            <template v-if="key === 'attributes' && configuration?.fields.attributes">
              <ProductAttributes :product="product" />
            </template>

            <template v-if="key === 'itemBundle'">
              <BundleOrderItems v-if="product.bundleComponents && showBundleComponents" :product="product" />
            </template>
            <template v-if="key === 'orderProperties' && configuration?.fields.orderProperties">
              <OrderProperties :product="product" />
            </template>
            <template v-if="key === 'graduatedPrices' && configuration?.fields.graduatedPrices">
              <GraduatedPriceList :count="quantitySelectorValue" :product="product" />
            </template>
            <template v-if="key === 'guaranteeLabel' && configuration?.fields.guaranteeLabel">
              <GuaranteeBlock :product="product" max-width="20rem" class="m-4" />
            </template>

            <template v-if="key === 'quantityAndAddToCart' && configuration?.fields.quantityAndAddToCart">
              <UnitContentSelect
                v-if="product && productGetters.possibleUnitCombination(product).length > 1"
                :product="product"
              />
              <div ref="addToCartAreaRef" class="mt-6">
                <div class="flex flex-col @md:flex-row flex-wrap gap-4">
                  <UiQuantitySelector
                    v-if="productGetters.isActiveVariationSalable(product)"
                    :min-value="productGetters.getMinimumOrderQuantity(product)"
                    :value="quantitySelectorValue"
                    class="min-w-[145px] flex-grow-0 flex-shrink-0 basis-0"
                    @change-quantity="changeQuantity"
                  />
                  <!-- Arizona: add to cart with a square heart button next to it, like on About You -->
                  <div class="flex flex-grow-[2] flex-shrink basis-auto gap-2">
                  <div
                    v-if="showNotifyMe && !productGetters.isActiveVariationSalable(product)"
                    class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
                  >
                    <NotifyMe :variation-id="Number(productGetters.getVariationId(product))" />
                  </div>
                  <SfTooltip
                    v-else
                    :label="isNotValidVariation || isSalableText"
                    class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap"
                    placement="top"
                    show-arrow
                  >
                    <UiButton
                      :disabled="loading || !productGetters.isSalable(product)"
                      class="w-full h-full min-h-14 !text-lg !font-bold tracking-wide"
                      data-testid="add-to-cart"
                      size="lg"
                      type="submit"
                    >
                      <template #prefix>
                        <div v-if="!loading" class="flex row items-center">
                          <SfIconShoppingCart size="sm" />
                          {{ t('common.actions.addToCart') }}
                        </div>
                        <div v-else>
                          <SfLoaderCircular size="sm" />
                        </div>
                      </template>
                    </UiButton>
                  </SfTooltip>
                  <WishlistButton
                    v-if="configuration?.fields.addToWishlist"
                    :product="product"
                    :quantity="quantitySelectorValue"
                    variant="secondary"
                    square
                    class="!m-0 !p-0 w-14 shrink-0 self-stretch h-auto min-h-14"
                    data-testid="purchase-card-wishlist"
                  />
                  </div>
                </div>

                <div class="mt-4 typography-text-xs flex gap-1">
                  <span>{{ t('common.labels.asterisk') }}</span>
                  <span>{{ showNetPrices ? t('product.priceExclVAT') : t('product.priceInclVAT') }}</span>
                  <i18n-t keypath="shipping.excludedLabel" scope="global">
                    <template #shipping>
                      <UiLink
                        :href="resolvePathTrailingSlash(localePath(paths.shipping))"
                        class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
                        target="_blank"
                      >
                        {{ t('common.labels.delivery') }}
                      </UiLink>
                    </template>
                  </i18n-t>
                </div>
                <ArizonaBestsellerHint :item-id="Number(productGetters.getItemId(product))" class="mt-5" />
                <ArizonaShippingCountdown class="mt-4" />
                <ArizonaServicePromises without-delivery class="mt-4" />
                <template v-if="showPayPalButtons">
                  <PayPalExpressButton
                    class="mt-4"
                    location="itemPage"
                    type="SingleItem"
                    @validation-callback="paypalHandleAddToCart"
                  />
                  <PayPalPayLaterBanner
                    :amount="priceWithProperties * quantitySelectorValue"
                    location="itemPage"
                    placement="product"
                  />
                </template>
              </div>
            </template>

            <template v-if="key === 'itemText' && configuration?.fields.itemText">
              <div
                v-if="productGetters.getDescription(product)"
                class="mb-4 font-normal typography-text-sm whitespace-pre-line break-words no-preflight"
                data-testid="product-description"
                v-html="productGetters.getDescription(product)"
              />
            </template>
            <template v-if="key === 'technicalData' && configuration?.fields.technicalData">
              <div
                v-if="productGetters.getTechnicalData(product)"
                class="mb-4 font-normal typography-text-sm whitespace-pre-line break-words no-preflight"
                data-testid="product-description"
                v-html="productGetters.getTechnicalData(product)"
              />
            </template>
          </template>
        </section>
      </div>
    </div>

    <!-- Arizona: on phones the add-to-cart button stays reachable above the bottom bar once it scrolled out of view -->
    <div
      v-if="showStickyAddToCart"
      class="fixed inset-x-0 bottom-[62px] z-sticky flex items-center gap-3 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] @md:hidden"
      data-testid="sticky-add-to-cart"
    >
      <div class="min-w-0 flex-1">
        <p v-if="brandName" class="truncate text-xs text-neutral-600">{{ brandName }}</p>
        <p class="font-semibold" :class="{ 'text-[#C8102E]': isReducedPrice }">{{ format(currentPrice) }}</p>
      </div>
      <UiButton
        :disabled="loading || !productGetters.isSalable(product)"
        class="flex-1 !rounded-full"
        size="lg"
        type="submit"
        data-testid="sticky-add-to-cart-button"
      >
        <SfLoaderCircular v-if="loading" size="sm" />
        <span v-else>{{ t('common.actions.addToCart') }}</span>
      </UiButton>
      <WishlistButton
        v-if="configuration?.fields.addToWishlist"
        :product="product"
        :quantity="quantitySelectorValue"
        variant="secondary"
        square
        class="!m-0 !p-0 size-12 shrink-0 !rounded-full"
        data-testid="sticky-wishlist"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { productGetters, reviewGetters, productBundleGetters } from '@plentymarkets/shop-api';
import { SfCounter, SfRating, SfIconShoppingCart, SfLoaderCircular, SfTooltip } from '@storefront-ui/vue';
import type { PriceCardPadding, PriceCardTextBlockItem, PurchaseCardProps } from '~/components/ui/PurchaseCard/types';
import type { PayPalAddToCartCallback } from '#paypal/types';
const isTextBlock = (item: unknown): item is PriceCardTextBlockItem =>
  typeof item === 'object' && item !== null && (item as PriceCardTextBlockItem).type === 'textBlock';

const highlightedUuid = useState<string>('toc-highlighted-uuid', () => '');

const props = withDefaults(defineProps<PurchaseCardProps>(), {
  configuration: () => ({
    fields: {
      itemName: true,
      variationNumber: false,
      price: true,
      tags: true,
      availability: true,
      starRating: true,
      orderProperties: true,
      variationProperties: true,
      previewText: true,
      attributes: true,
      itemBundle: false,
      graduatedPrices: true,
      addToWishlist: true,
      quantityAndAddToCart: true,
      guaranteeLabel: true,
      itemText: false,
      technicalData: false,
    },
    fieldsOrder: [
      'itemName',
      'variationNumber',
      'price',
      'tags',
      'availability',
      'starRating',
      'variationProperties',
      'orderProperties',
      'previewText',
      'attributes',
      'itemBundle',
      'graduatedPrices',
      'addToWishlist',
      'guaranteeLabel',
      'quantityAndAddToCart',
      'itemText',
      'technicalData',
    ],
    fieldsDisabled: ['quantityAndAddToCart', 'price', 'itemBundle', 'attributes'],
    wishlistSize: 'small',

    dropShadow: true,
    borders: true,
    borderColor: '#EFF4F1',
    layout: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
      paddingLeft: 0,
      fullWidth: false,
    },
  }),
});

const { currentProduct } = useProducts();

const { data: productReviews } = useProductReviews(Number(productGetters.getItemId(currentProduct.value)));
const reviewAverage = computed(() => reviewGetters.getReviewCounts(productReviews.value));

const { getSetting } = useSiteSettings('dontSplitItemBundle');
const showBundleComponents = computed(() => {
  return getSetting() !== '1';
});

const { showNetPrices } = useCart();
const viewport = useViewport();
const { getCombination } = useProductAttributes();
const { getPropertiesForCart, getPropertiesPrice } = useProductOrderProperties();
const { validateAllFields, invalidFields, resetInvalidFields } = useValidatorAggregator('properties');
const {
  validateAllFields: validateAllFieldsAttributes,
  invalidFields: invalidAttributeFields,
  resetInvalidFields: resetAttributeFields,
} = useValidatorAggregator('attributes');
const { clear, send } = useNotification();
const { addToCart, loading } = useCart();
const quantitySelectorValue = ref(productGetters.getMinimumOrderQuantity(props?.product));
const { openQuickCheckout } = useQuickCheckout();
const { crossedPrice, price: currentPrice } = useProductPrice(props?.product);
const { format } = usePriceFormatter();
const isReducedPrice = computed(() => crossedPrice.value !== null && crossedPrice.value > currentPrice.value);

// Arizona: the sticky bar shows on phones while the regular add-to-cart button is out of view
// the area sits inside the v-for over the card fields, so Vue fills the ref with an array
const addToCartAreaRef = ref<HTMLElement | HTMLElement[] | null>(null);
const addToCartAreaVisible = ref(true);
const showStickyAddToCart = computed(
  () =>
    viewport.isLessThan('md') &&
    !addToCartAreaVisible.value &&
    productGetters.isActiveVariationSalable(props.product),
);
onMounted(() => {
  const area = Array.isArray(addToCartAreaRef.value) ? addToCartAreaRef.value[0] : addToCartAreaRef.value;
  if (!area || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(([entry]) => {
    addToCartAreaVisible.value = Boolean(entry?.isIntersecting);
  });
  observer.observe(area);
  onBeforeUnmount(() => observer.disconnect());
});
const { reviewArea } = useProductReviews(Number(productGetters.getId(props?.product)));
const { getBooleanSetting: getNotifyMeSetting } = useSiteSettings('showNotifyMe');
const showNotifyMe = computed(() => getNotifyMeSetting());
const localePath = useLocalePath();
const router = useRouter();
const { resolvePathTrailingSlash } = useUrlTrailingSlash();

const renderTextBlock = (html: string): string =>
  replacePropertyPlaceholdersInHtml(
    localizeHtmlLinks(html, router, localePath, resolvePathTrailingSlash),
    props.product,
  );

const brandName = computed(() => getBrandName(props.product));
const brandPage = computed(() => (brandName.value ? findArizonaBrandByName(brandName.value) : undefined));


const inlineStyle = computed(() => {
  const layout = props?.configuration?.layout || ({} as PriceCardPadding);

  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
    borderColor: props?.configuration?.borderColor || 'transparent',
  };
});

onMounted(() => {
  resetInvalidFields();
  resetAttributeFields();
});

onBeforeRouteLeave(() => {
  if (invalidFields.value.length > 0 || invalidAttributeFields.value.length > 0) clear();
  resetInvalidFields();
  resetAttributeFields();
});

const priceWithProperties = computed(
  () =>
    (productGetters.getSpecialOffer(props?.product) ||
      productGetters.getGraduatedPriceByQuantity(props?.product, quantitySelectorValue.value)?.unitPrice.value ||
      productGetters.getPrice(props?.product) ||
      0) + getPropertiesPrice(props?.product),
);

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props?.product, quantitySelectorValue.value)?.basePrice ??
    productGetters.getDefaultBasePrice(props?.product),
);

const handleValidationErrors = (): boolean => {
  send({
    message: [
      t('error.missingOrWrongProperties'),
      '',
      ...invalidAttributeFields.value.map((field) => field.name),
      ...invalidFields.value.map((field) => field.name),
      '',
      t('error.pleaseFillOutAllFields'),
    ],
    type: 'negative',
  });

  return false;
};

const handleAddToCart = async (quickCheckout = true) => {
  await validateAllFieldsAttributes();
  await validateAllFields();

  if (invalidFields.value.length > 0 || invalidAttributeFields.value.length > 0) {
    return handleValidationErrors();
  }

  if (!getCombination()) {
    send({ message: t('product.attributes.notValidVariation'), type: 'negative' });
    return false;
  }

  const addedToCart = await addToCart({
    productId: Number(productGetters.getId(props?.product)),
    quantity: Number(quantitySelectorValue.value),
    basketItemOrderParams: getPropertiesForCart(),
  });

  if (addedToCart) {
    quickCheckout
      ? openQuickCheckout(props?.product, quantitySelectorValue.value)
      : send({ message: t('cart.itemAdded'), type: 'positive' });

    if (getSetting() === '0') {
      send({ message: t('error.notificationsItemBundleSplitted'), type: 'warning' });
    }
  }

  return addedToCart;
};

const paypalHandleAddToCart = async (callback: PayPalAddToCartCallback) => {
  const added = await handleAddToCart(false);

  callback(added);
};

const changeQuantity = (quantity: string) => {
  quantitySelectorValue.value = Number(quantity);
};

const isReviewsAccordionOpen = () => {
  const customerReviewsAccordionDetailsElement = document.querySelector('#customerReviewsAccordion')
    ?.firstChild as HTMLDetailsElement;

  return customerReviewsAccordionDetailsElement.open;
};

const openReviewsAccordion = () => {
  const customerReviewsClickElement = document.querySelector('#customerReviewsClick') as HTMLElement;
  customerReviewsClickElement?.click();
};

const isSalableText = computed(() => (productGetters.isSalable(props?.product) ? '' : t('product.notAvailable')));
const isNotValidVariation = computed(() => (getCombination() ? '' : t('product.attributes.notValidVariation')));
const showPayPalButtons = computed(() => Boolean(getCombination()) && productGetters.isSalable(props?.product));

const scrollToReviews = () => {
  if (!isReviewsAccordionOpen()) {
    openReviewsAccordion();
  }

  if (reviewArea.value) {
    reviewArea.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>
