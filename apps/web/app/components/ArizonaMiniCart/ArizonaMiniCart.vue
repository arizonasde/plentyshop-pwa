<template>
  <Transition
    appear
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <section
      v-if="visible"
      role="status"
      aria-live="polite"
      class="fixed left-4 right-4 @md:left-auto @md:right-10 @md:w-[22rem] z-popover rounded-lg border-2 border-neutral-900 bg-white text-neutral-900 shadow-lg"
      :style="{ top: `${top}px` }"
      data-testid="arizona-mini-cart"
      @mouseenter="pause"
      @mouseleave="resume"
      @focusin="pause"
    >
      <h2 class="pt-4 pb-3 text-center font-semibold text-base">Warenkorb</h2>

      <div class="flex gap-3 px-4 pb-4">
        <NuxtLink :to="productLink" class="shrink-0 isolate rounded-md bg-[#F3F3F3]" @click="close">
          <NuxtImg
            :src="image"
            :alt="name"
            class="w-[4.5rem] h-24 object-contain mix-blend-multiply"
            width="72"
            height="96"
          />
        </NuxtLink>
        <div class="min-w-0 flex-1 text-sm">
          <p v-if="brand" class="text-neutral-600">{{ brand }}</p>
          <p class="truncate font-medium">{{ name }}</p>
          <p class="mt-1">{{ format(itemTotal) }}</p>
          <ul class="mt-1 text-neutral-600">
            <li v-for="attribute in attributes" :key="attribute.name">{{ attribute.label }}: {{ attribute.value }}</li>
            <li>{{ t('account.ordersAndReturns.orderDetails.quantity') }}: {{ itemQuantity }}</li>
          </ul>
        </div>
        <button
          type="button"
          class="self-start -mt-1 -mr-1 p-1 rounded hover:bg-[#F3F3F3]"
          :aria-label="t('common.navigation.closeDialog')"
          data-testid="arizona-mini-cart-close"
          @click="close"
        >
          <SfIconClose size="sm" />
        </button>
      </div>

      <div class="border-t border-neutral-200 px-4 pt-3 pb-4 text-sm">
        <div class="flex justify-between">
          <span>Versand</span>
          <span>{{ shipping }}</span>
        </div>
        <div class="flex justify-between mt-1 mb-3">
          <span>
            <b>Gesamtpreis</b> <span class="text-neutral-600">{{ showNetPrices ? 'zzgl. MwSt.' : 'inkl. MwSt.' }}</span>
          </span>
          <b>{{ format(totals.total) }}</b>
        </div>
        <UiButton size="lg" class="w-full !rounded-full" data-testid="arizona-mini-cart-button" @click="goToCart">
          Zum Warenkorb
        </UiButton>
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
import { cartGetters, productGetters } from '@plentymarkets/shop-api';
import type { ArizonaMiniCartProps } from './types';

/**
 * Arizona: small cart box under the header after "add to cart" (like large fashion shops).
 * Replaces the large quick checkout dialog; it closes by itself after a few seconds unless the pointer rests on it.
 */
const props = defineProps<ArizonaMiniCartProps>();

const VISIBLE_MS = 5000;
const AFTER_HOVER_MS = 2500;

const { format } = usePriceFormatter();
const localePath = useLocalizedPath();
const { data: cart, lastUpdatedCartItem, showNetPrices } = useCart();
const { closeQuickCheckout } = useQuickCheckout();
const { addModernImageExtension } = useModernImage();

const visible = ref(true);
const top = ref(16);
let timeout: ReturnType<typeof setTimeout> | undefined;

const item = computed(() => lastUpdatedCartItem.value);
const variation = computed(() => (item.value && cartGetters.getVariation(item.value)) || props.product);
const name = computed(() => getDisplayName(variation.value));
const brand = computed(() => productGetters.getManufacturer(variation.value)?.externalName ?? '');
const image = computed(() => addModernImageExtension(productGetters.getMiddleImage(variation.value)));
const attributes = computed(() => (item.value ? cartGetters.getItemAttributes(item.value) : []));
// quantity and price of this item in the whole cart, not only of the latest click
const itemQuantity = computed(() => (item.value ? cartGetters.getItemQty(item.value) : 0));
const itemTotal = computed(() => (item.value ? cartGetters.getCartItemPrice(item.value) * itemQuantity.value : 0));
const productLink = computed(() =>
  item.value ? localePath('/' + cartGetters.getProductPath(item.value, useCallisto().isEnabled)) : localePath(paths.cart),
);
const totals = computed(() => cartGetters.getTotals(cart.value));
const shipping = computed(() => {
  const amount = showNetPrices.value
    ? cartGetters.getShippingAmountNet(cart.value)
    : cartGetters.getShippingPrice(cart.value);
  return amount === 0 ? t('shipping.method.free') : format(Number(amount));
});

const close = () => {
  clearTimeout(timeout);
  visible.value = false;
  // let the leave transition finish before the box is unmounted
  setTimeout(closeQuickCheckout, 200);
};
const pause = () => clearTimeout(timeout);
const resume = () => {
  clearTimeout(timeout);
  timeout = setTimeout(close, AFTER_HOVER_MS);
};
const goToCart = () => {
  close();
  navigateTo(localePath(paths.cart));
};
const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close();
};

onMounted(() => {
  // hang the box right under the visible header row
  const header = document.querySelector('[data-testid="navbar-top-desktop"], [data-testid="navbar-top-mobile"]');
  const bottom = header?.getBoundingClientRect().bottom ?? 0;
  top.value = Math.max(Math.round(bottom) + 8, 16);
  timeout = setTimeout(close, VISIBLE_MS);
  document.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  clearTimeout(timeout);
  document.removeEventListener('keydown', onKeydown);
});
</script>
