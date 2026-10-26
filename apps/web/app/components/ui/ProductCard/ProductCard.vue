<template>
  <div ref="cardRef" class="group/card flex flex-col" data-testid="product-card">
    <div class="relative overflow-hidden rounded-lg bg-[#F3F3F3]">
      <UiBadges
        :use-tags="useTagsOnCategoryPage"
        :class="['absolute', isFromWishlist ? 'mx-2' : 'm-2']"
        :product="product"
        :use-availability="isFromWishlist"
      />
      <!-- Arizona: countdown badge for today's deals -->
      <ArizonaDealCountdown
        :item-id="productGetters.getItemId(product)"
        class="pointer-events-none absolute bottom-2 left-2 z-raised"
      />

      <div ref="imageContainerRef" class="relative">
        <UiLink
          :tag="NuxtLink"
          :to="productPath"
          :aria-label="ariaLabelContent"
          class="relative group/image flex items-center justify-center"
          data-testid="product-card-link"
        >
          <div class="relative w-full aspect-[3/4] bg-[#F3F3F3] isolate">
            <div
              v-if="!mainImageLoaded"
              class="absolute inset-0 bg-[#F3F3F3] animate-pulse"
              aria-hidden="true"
            />

            <NuxtImg
              v-if="canLoadMainImage"
              ref="mainImageRef"
              :src="imageUrl"
              :alt="imageAlt"
              :title="imageTitle || null"
              :loading="priority || lazy === false ? 'eager' : 'lazy'"
              :fetchpriority="priority ? 'high' : 'auto'"
              :preload="priority"
              :width="getWidth()"
              :height="getHeight()"
              :class="[
                'object-contain mix-blend-multiply w-full h-full transition-opacity duration-300',
                mainImageLoaded ? 'opacity-100' : 'opacity-0',
                effectiveHoverImageUrl && hoverImageLoaded ? 'group-hover/image:opacity-0' : '',
              ]"
              data-testid="image-slot"
              @load="onMainImageLoad"
              @error="onMainImageError"
            />

            <NuxtImg
              v-if="canLoadHoverImage && effectiveHoverImageUrl"
              ref="hoverImageRef"
              :src="effectiveHoverImageUrl"
              :alt="imageAlt"
              :title="imageTitle || null"
              :loading="lazy === false ? 'eager' : 'lazy'"
              fetchpriority="auto"
              :preload="false"
              :width="getWidth()"
              :height="getHeight()"
              :class="[
                'absolute inset-0 object-contain mix-blend-multiply w-full h-full opacity-0 transition-opacity duration-300',
                hoverImageLoaded ? 'group-hover/image:opacity-100' : '',
              ]"
              data-testid="hover-image-slot"
              @load="onHoverImageLoad"
              @error="onHoverImageError"
            />
          </div>
        </UiLink>
      </div>

      <span
        v-if="discountPercent"
        class="absolute bottom-2 left-2 rounded bg-[#C8102E] px-2 py-0.5 typography-text-xs font-semibold text-white"
        data-testid="product-card-discount"
      >
        −{{ discountPercent }} %
      </span>

      <template v-if="configuration?.showWishlistButton">
        <slot name="wishlistButton">
          <WishlistButton square class="absolute top-0 right-0 mr-2 mt-2 bg-white/90 !rounded-full" :product="product" />
        </slot>
      </template>

      <!-- Colours on hover (devices with a mouse); touch devices get the compact row below the image -->
      <div
        v-if="colorOptions.length > 1"
        class="hidden [@media(hover:hover)]:group-hover/card:flex [@media(hover:hover)]:group-focus-within/card:flex absolute inset-x-0 bottom-0 z-raised flex-col gap-2 bg-white px-1 pt-2 pb-1"
        data-testid="product-card-colors-hover"
      >
        <p class="typography-text-xs text-neutral-700">In {{ colorOptions.length }} Farben erhältlich</p>
        <nav class="flex items-center gap-1.5" aria-label="Weitere Farben">
          <template v-for="option in visibleColorOptions" :key="option.key">
            <span
              v-if="option.current"
              class="w-12 aspect-[3/4] overflow-hidden rounded-md bg-[#F3F3F3] ring-1 ring-neutral-900 isolate"
              :title="option.name"
            >
              <NuxtImg
                :src="option.imageUrl"
                :alt="option.name"
                width="48"
                height="64"
                loading="lazy"
                class="w-full h-full object-contain mix-blend-multiply"
              />
            </span>
            <NuxtLink
              v-else
              :to="option.path"
              :title="option.name"
              class="w-12 aspect-[3/4] overflow-hidden rounded-md bg-[#F3F3F3] isolate hover:ring-1 hover:ring-neutral-500"
            >
              <NuxtImg
                :src="option.imageUrl"
                :alt="option.name"
                width="48"
                height="64"
                loading="lazy"
                class="w-full h-full object-contain mix-blend-multiply"
              />
            </NuxtLink>
          </template>
          <span v-if="hiddenColorCount" class="typography-text-xs text-neutral-600 ml-1">+{{ hiddenColorCount }}</span>
        </nav>
      </div>
    </div>

    <div
      class="pt-3 pb-4 px-0.5 typography-text-sm flex flex-col flex-auto"
      :class="{
        'items-center': configuration?.contentAlignment === 'center',
        'items-end': configuration?.contentAlignment === 'right',
        'items-start': configuration?.contentAlignment === 'left',
      }"
    >
      <nav
        v-if="colorOptions.length > 1"
        class="flex items-center gap-1 mb-2 [@media(hover:hover)]:hidden"
        aria-label="Weitere Farben"
        data-testid="product-card-colors"
      >
        <template v-for="option in visibleColorOptions" :key="option.key">
          <span
            v-if="option.current"
            class="w-8 aspect-[3/4] overflow-hidden rounded bg-[#F3F3F3] ring-1 ring-neutral-900 isolate"
            :title="option.name"
          >
            <NuxtImg
              :src="option.imageUrl"
              :alt="option.name"
              width="32"
              height="43"
              loading="lazy"
              class="w-full h-full object-contain mix-blend-multiply"
            />
          </span>
          <NuxtLink
            v-else
            :to="option.path"
            :title="option.name"
            class="w-8 aspect-[3/4] overflow-hidden rounded bg-[#F3F3F3] isolate hover:ring-1 hover:ring-neutral-400"
          >
            <NuxtImg
              :src="option.imageUrl"
              :alt="option.name"
              width="32"
              height="43"
              loading="lazy"
              class="w-full h-full object-contain mix-blend-multiply"
            />
          </NuxtLink>
        </template>
        <span v-if="hiddenColorCount" class="typography-text-xs text-neutral-600 ml-1">+{{ hiddenColorCount }}</span>
      </nav>

      <template v-for="key in fieldsOrder" :key="key">
        <template v-if="key === 'title' && configuration?.fields?.title">
          <UiLink
            :tag="NuxtLink"
            :to="productPath"
            class="no-underline !text-neutral-600 line-clamp-1"
            variant="secondary"
            data-testid="productcard-name"
          >
            {{ name }}
          </UiLink>
        </template>
        <template v-if="key === 'manufacturer' && configuration?.fields?.manufacturer">
          <!-- Arizona: the brand links to its brand page -->
          <NuxtLink
            v-if="manufacturer?.externalName"
            :to="localePath(arizonaBrandPath(manufacturer.externalName))"
            class="block typography-text-sm font-semibold text-neutral-900 truncate hover:underline underline-offset-4"
            data-testid="productcard-manufacturer"
          >
            {{ formatBrandName(manufacturer.externalName) }}
          </NuxtLink>
        </template>
        <template v-if="key === 'rating' && configuration?.fields?.rating">
          <div class="flex items-center pt-1 gap-1 mb-2">
            <SfRating size="xs" :half-increment="true" :value="rating ?? 0" :max="5" />
            <SfCounter size="xs">{{ ratingCount }}</SfCounter>
          </div>
        </template>
        <template v-if="key === 'previewText' && configuration?.fields?.previewText">
          <div
            v-if="shortDescription"
            class="block py-2 font-normal typography-text-xs text-neutral-700 text-justify whitespace-pre-line break-words"
          >
            <div class="line-clamp-3 no-preflight" v-html="shortDescription" />
          </div>
        </template>
        <template v-if="key === 'price' && configuration?.fields?.price">
          <LowestPrice :product="product" />
          <div v-if="showBasePrice" class="mb-2">
            <BasePriceInLine :base-price="basePrice" :unit-content="unitContent" :unit-name="unitName" />
          </div>
          <div class="flex flex-wrap items-baseline gap-x-2 mt-1">
            <span
              class="block pb-2 font-semibold typography-text-sm"
              :class="discountPercent ? 'text-[#C8102E]' : 'text-neutral-900'"
              data-testid="product-card-vertical-price"
            >
              <span v-if="showFromText" class="mr-1">{{ t('account.ordersAndReturns.orderDetails.priceFrom') }}</span>
              <span>{{ format(price) }}</span>
              <span>{{ t('common.labels.asterisk') }}</span>
            </span>
            <span
              v-if="crossedPrice && differentPrices(price, crossedPrice) && crossedPrice > price"
              class="typography-text-sm text-neutral-500 line-through pb-2"
            >
              {{ format(crossedPrice) }}
            </span>
          </div>
        </template>
        <template v-if="key === 'addToCart' && configuration?.fields?.addToCart">
          <UiButton
            v-if="canAddFromCategory"
            size="sm"
            class="min-w-[80px] w-fit"
            data-testid="add-to-basket-short"
            :disabled="loading"
            :variant="configuration?.addToCartStyle || 'primary'"
            @click="addWithLoader(Number(productGetters.getId(product)))"
          >
            <template v-if="!loading" #prefix>
              <SfIconShoppingCart size="sm" />
            </template>
            <SfLoaderCircular v-if="loading" class="flex justify-center items-center" size="sm" />
            <span v-else>{{ t('common.actions.add') }}</span>
          </UiButton>
          <UiButton
            v-else
            :variant="configuration?.addToCartStyle || 'primary'"
            type="button"
            :tag="NuxtLink"
            :to="productPath"
            size="sm"
            class="w-fit"
          >
            <span>{{ t('common.actions.showOptions') }}</span>
          </UiButton>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { productGetters, productImageGetters } from '@plentymarkets/shop-api';
import { SfIconShoppingCart, SfLoaderCircular, SfRating, SfCounter } from '@storefront-ui/vue';
import type { ProductCardProps, ColorPreview } from '~/components/ui/ProductCard/types';
import type { ItemGridContent } from '~/components/blocks/ItemGrid/types';
import type { BasketItemOrderParamsProperty, Product, DoAddItemParams } from '@plentymarkets/shop-api';

const props = withDefaults(defineProps<ProductCardProps>(), {
  configuration: () => ({
    cardBorders: true,
    contentAlignment: 'left',
    fields: {
      title: true,
      rating: true,
      previewText: false,
      price: true,
      addToCart: true,
      manufacturer: false,
    },
    fieldsOrder: ['title', 'manufacturer', 'rating', 'previewText', 'price', 'addToCart'],
    showWishlistButton: false,
    showSecondImageOnHover: false,
    addToCartStyle: 'primary',
    itemsPerRowDesktop: 4,
    itemsPerRowTablet: 3,
    itemsPerRowMobile: 1,
    showItemCount: true,
    itemCountPosition: 'center',
    fieldsDisabled: [],
    paginationPosition: 'bottom',
    layout: {
      fullWidth: false,
    },
  }),
});

const product = computed(() => props.product);

const configuration = computed(() => props.configuration || ({} as ItemGridContent));

const { addModernImageExtension } = useModernImage();
const { format } = usePriceFormatter();
const { openQuickCheckout } = useQuickCheckout();
const { addToCart } = useCart();
const { price, crossedPrice } = useProductPrice(product.value);
const { send } = useNotification();
const loading = ref(false);
const config = useRuntimeConfig();
const useTagsOnCategoryPage = config.public.useTagsOnCategoryPage;
const name = computed(
  () => getDisplayName(product.value) + productGetters.getGroupedAttributesString(product.value),
);
const manufacturer = computed(() => productGetters.getManufacturer(product.value));
const ratingCount = computed(() => productGetters.getTotalReviews(product.value));
const rating = computed(() => productGetters.getAverageRating(product.value, 'half'));
const shortDescription = computed(() => productGetters.getShortDescription(product.value) || '');
const autoOrderParams = computed(() => {
  return productGetters.hasOrderPropertiesRequiredAndPreselected(product.value)
    ? buildAutoBasketItemOrderParams(product.value)
    : undefined;
});
const canAddFromCategory = computed(
  () =>
    productGetters.canBeAddedToCartFromCategoryPage(product.value) ||
    productGetters.hasOrderPropertiesRequiredAndPreselected(product.value),
);
const showFromText = computed(() => productGetters.showFromText(product.value));

const cover = computed(() => productGetters.getCoverImage(product.value));
const secondCover = computed(() => productGetters.getSecondCoverImage(product.value));
const firstImage = computed(() => productImageGetters.getFirstImage(product.value));

const imageUrl = computed(() => addModernImageExtension(cover.value));
const effectiveHoverImageUrl = computed(() => {
  if (!configuration.value?.showSecondImageOnHover) return '';
  const src = addModernImageExtension(secondCover.value);
  return src || '';
});

const imageAlt = computed(() => productImageGetters.getImageAlternate(firstImage.value) || name.value || '');
const imageTitle = computed(() => productImageGetters.getImageName(firstImage.value) || '');

const imageWidth = computed(() => productGetters.getImageWidth(product.value) || 600);
const imageHeight = computed(() => productGetters.getImageHeight(product.value) || 600);

const basePrice = computed(() => productGetters.getDefaultBasePrice(product.value));
const unitContent = computed(() => productGetters.getUnitContent(product.value));
const unitName = computed(() => productGetters.getUnitName(product.value));
const showBasePrice = computed(() => productGetters.showPricePerUnit(product.value));

const variationId = computed(() => productGetters.getVariationId(product.value));

const isGlobalProductCategoryTemplate = computed(() => {
  const route = useRoute();
  const slugParam = route.params.slug;

  if (slugParam === undefined) {
    return false;
  }

  const slug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam;
  return `/${slug}` === paths.globalItemCategory;
});

const localePath = useLocalizedPath();

const productPath = computed(() => {
  if (isGlobalProductCategoryTemplate?.value) {
    return localePath(paths.globalItemDetails);
  }
  if (useCallisto().isEnabled) {
    const urlPath = productGetters.getUrlPath(product.value);
    return localePath(`${urlPath ? `/${urlPath}` : ''}/a-${productGetters.getItemId(product.value)}`);
  }
  const basePath = `/${productGetters.getUrlPath(product.value)}_${productGetters.getItemId(product.value)}`;
  const shouldAppendVariation = productGetters.shouldAppendVariationToLink(product.value);
  return localePath(shouldAppendVariation ? `${basePath}_${variationId.value}` : basePath);
});

const priority = computed(() => !props.isFromSlider && (props.index ?? 0) < 5);
const {
  imageContainerRef,
  mainImageRef,
  hoverImageRef,
  shouldLoadMainImage,
  shouldLoadHoverImage,
  mainImageLoaded,
  hoverImageLoaded,
  onMainImageLoad,
  onMainImageError,
  onHoverImageLoad,
  onHoverImageError,
} = useLazyProductImage({
  priority,
  hoverImageUrl: effectiveHoverImageUrl,
});

const externalImagePermission = computed(() => {
  if (!props.isFromSlider) return true;
  return props.shouldLoadImage ?? true;
});
const canLoadMainImage = computed(() => {
  if (!externalImagePermission.value) return false;

  if (props.isFromSlider) return true;

  return shouldLoadMainImage.value;
});

const canLoadHoverImage = computed(() => {
  if (!externalImagePermission.value || !effectiveHoverImageUrl.value) return false;

  if (props.isFromSlider) return true;

  return shouldLoadHoverImage.value;
});

const ariaLabelContent = computed(() => {
  return t('common.accessibility.viewDetails', { name: name.value ?? '' });
});

const getWidth = () => {
  if (imageWidth.value && imageWidth.value > 0 && imageUrl.value.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageWidth.value;
  }
  return '';
};

const getHeight = () => {
  if (imageHeight.value && imageHeight.value > 0 && imageUrl.value.includes(defaults.IMAGE_LINK_SUFIX)) {
    return imageHeight.value;
  }
  return '';
};

/**
 * Builds basket order parameters for products that have
 * required and preselected order properties.
 *
 * This helper extracts only order properties that are marked as required
 * and converts them into the structure expected by the basket API.
 *
 * It is intended to be used only when the product is already validated
 * by `hasOrderPropertiesRequiredAndPreselected`, meaning no user input
 * is needed before adding the product to the basket.
 *
 * @param product - The product from which order properties are extracted.
 * @returns An array of basket order parameter objects if required order
 *          properties exist, otherwise `undefined`.
 */
const buildAutoBasketItemOrderParams = (product: Product): BasketItemOrderParamsProperty[] | undefined =>
  product.properties
    ?.filter((p) => p?.property?.isOderProperty && p.property.isRequired)
    .map((p) => {
      const pr = p.property;

      return {
        property: {
          id: p.propertyId ?? pr.id,
          names: { name: pr.names?.name ?? '' },
          valueType: pr.valueType,
          value: '1',
        },
      };
    }) || undefined;

const addWithLoader = async (productId: number, quickCheckout = true) => {
  loading.value = true;
  try {
    const isRequiredAndPreselected = productGetters.hasOrderPropertiesRequiredAndPreselected(product.value);
    const params = isRequiredAndPreselected ? autoOrderParams.value : undefined;

    if (isRequiredAndPreselected && !params) {
      await navigateTo(productPath.value);
      return;
    }

    const addToCartObject: DoAddItemParams = {
      productId,
      quantity: 1,
      ...(params ? { basketItemOrderParams: params } : {}),
    };

    await addToCart(addToCartObject);

    if (quickCheckout) openQuickCheckout(product.value, 1);
    else send({ message: t('cart.itemAdded'), type: 'positive' });
  } finally {
    loading.value = false;
  }
};
const differentPrices = (price: number, crossedPrice: number) => {
  return crossedPrice ? Math.round(price * 100) / 100 !== Math.round(crossedPrice * 100) / 100 : false;
};

const discountPercent = computed(() => {
  const current = price.value;
  const crossed = crossedPrice.value;
  if (!current || !crossed || crossed <= current || !differentPrices(current, crossed)) return 0;
  return Math.round((1 - current / crossed) * 100);
});

// Colour preview: current colour first, then up to three more, the rest as "+N".
// Shows the colours found in the listing right away and swaps in all colours of the item once the card was visible.
const MAX_COLOR_PREVIEWS = 4;
const cardRef = ref<HTMLElement | null>(null);
const { loadColors, colorsOf } = useColorVariants();
const itemId = computed(() => productGetters.getItemId(product.value));
const currentColorName = computed(() => product.value.groupedAttributes?.[0]?.value ?? '');

const colorOptions = computed<ColorPreview[]>(() => {
  const loaded = colorsOf(itemId.value);
  const options: ColorPreview[] =
    loaded && loaded.length > 0
      ? loaded.map((option) => ({
          key: String(option.valueId),
          name: option.name,
          imageUrl: option.imageUrl,
          path: option.path,
          current: option.name === currentColorName.value,
        }))
      : [product.value, ...(props.colorVariants ?? [])].map((variant, index) => ({
          key: String(productGetters.getVariationId(variant)),
          name: variant.groupedAttributes?.[0]?.value ?? getDisplayName(variant),
          imageUrl: productGetters.getCoverImagePreview(variant),
          path: localePath(
            `/${productGetters.getUrlPath(variant)}_${productGetters.getItemId(variant)}_${productGetters.getVariationId(variant)}`,
          ),
          current: index === 0,
        }));
  return [...options.filter((option) => option.current), ...options.filter((option) => !option.current)];
});
const visibleColorOptions = computed(() => colorOptions.value.slice(0, MAX_COLOR_PREVIEWS));
const hiddenColorCount = computed(() => Math.max(colorOptions.value.length - MAX_COLOR_PREVIEWS, 0));

onMounted(() => {
  if (props.isFromWishlist || !cardRef.value || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadColors(itemId.value);
        observer.disconnect();
      }
    },
    { rootMargin: '200px' },
  );
  observer.observe(cardRef.value);
  onBeforeUnmount(() => observer.disconnect());
});

// Brand first, then name – the order shoppers scan fashion listings in.
const fieldsOrder = computed(() => {
  const order = [...(configuration.value?.fieldsOrder ?? [])];
  const brandIndex = order.indexOf('manufacturer');
  const titleIndex = order.indexOf('title');
  if (titleIndex !== -1 && brandIndex > titleIndex) {
    order.splice(brandIndex, 1);
    order.splice(titleIndex, 0, 'manufacturer');
  }
  return order;
});

const NuxtLink = resolveComponent('NuxtLink');
</script>
