<template>
  <fieldset class="@md:mx-4 my-6" data-testid="checkout-payment">
    <legend class="text-neutral-900 text-lg font-bold mb-4">{{ t('checkout.payment.heading') }}</legend>
    <div
      v-if="paymentMethods?.list && paymentMethods.list.length > 0"
      class="rounded-md border border-neutral-200 divide-y divide-neutral-200 overflow-hidden"
    >
      <label v-for="paymentMethod in sortedPaymentMethods" :key="paymentMethod.id" class="relative block">
        <input
          type="radio"
          name="payment_method"
          class="peer sr-only"
          :value="paymentMethod.id"
          :data-testid="`payment-method-${paymentMethod.id}`"
          :checked="isPaymentMethodChecked(paymentMethod)"
          :disabled="isPaymentMethodDisabled(paymentMethod)"
          @click.prevent="handlePaymentMethodChange(paymentMethod)"
        />
        <span
          :class="{
            'peer-focus:bg-primary-50': !paymentProviderGetters.isPaymentMethodExcluded(
              selectedShippingMethod,
              paymentMethod.id,
            ),
          }"
          class="flex items-center gap-4 min-h-[64px] px-4 py-3 cursor-pointer hover:bg-neutral-50 peer-checked:bg-primary-50 peer-disabled:opacity-50 peer-disabled:bg-neutral-100 peer-disabled:cursor-not-allowed peer-disabled:[&_img]:grayscale"
        >
          <span
            class="shrink-0 size-5 rounded-full border-2 flex items-center justify-center"
            :class="isPaymentMethodChecked(paymentMethod) ? 'border-primary-500' : 'border-neutral-400'"
            aria-hidden="true"
          >
            <span v-if="isPaymentMethodChecked(paymentMethod)" class="size-2.5 rounded-full bg-primary-500" />
          </span>
          <span class="shrink-0 w-20 h-10 flex items-center justify-center rounded border border-neutral-200 bg-white">
            <SfIconCreditCard v-if="paymentMethod.id === -1" />
            <NuxtImg
              v-else
              :src="getArizonaPaymentDisplay(paymentMethod).logo"
              :alt="getArizonaPaymentDisplay(paymentMethod).title"
              class="max-h-8 max-w-[72px] object-contain"
              loading="lazy"
            />
          </span>
          <span class="flex flex-col">
            <span class="font-bold text-neutral-900">
              {{ paymentMethod.id === -1 ? t('checkout.payment.creditCard') : getArizonaPaymentDisplay(paymentMethod).title }}
            </span>
            <span v-if="getArizonaPaymentDisplay(paymentMethod).description" class="typography-text-sm text-neutral-600">
              {{ getArizonaPaymentDisplay(paymentMethod).description }}
            </span>
          </span>
        </span>
      </label>
    </div>
    <div
      v-else
      class="flex items-start bg-warning-100 shadow-md pr-2 pl-4 ring-1 ring-warning-200 typography-text-sm @md:typography-text-base py-1 rounded-md"
      data-testid="no-payment-method-available"
    >
      <SfIconWarning class="mt-2 mr-2 text-warning-700 shrink-0" />
      <div class="py-2 mr-2">
        <p>{{ t('checkout.payment.noMethodsAvailable') }}</p>
      </div>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { paymentProviderGetters, type PaymentMethod } from '@plentymarkets/shop-api';
import { SfIconCreditCard, SfIconWarning } from '@storefront-ui/vue';
import type { CheckoutPaymentEmits, CheckoutPaymentProps } from '~/components/CheckoutPayment/types';
import { getArizonaPaymentDisplay, sortArizonaPaymentMethods } from '~/utils/arizonaPayment';

const { disabled = false } = defineProps<CheckoutPaymentProps>();
const emit = defineEmits<CheckoutPaymentEmits>();

const { send } = useNotification();
const { data: cart } = useCart();
const { selectedMethod: selectedShippingMethod } = useCartShippingMethods();
const { fetchPaymentMethods } = usePaymentMethods();
const { paymentMethods } = useCheckoutPagePaymentAndShipping();
const sortedPaymentMethods = computed(() => sortArizonaPaymentMethods(paymentMethods.value?.list ?? []));
const { on } = usePlentyEvent();

const isPaymentMethodChecked = (paymentMethod: PaymentMethod): boolean =>
  !paymentProviderGetters.isPaymentMethodExcluded(selectedShippingMethod.value, paymentMethod.id) &&
  paymentMethod.id === cart.value.methodOfPaymentId;

const isPaymentMethodDisabled = (paymentMethod: PaymentMethod): boolean =>
  !paymentMethod.isSelectable ||
  disabled ||
  paymentProviderGetters.isPaymentMethodExcluded(selectedShippingMethod.value, paymentMethod.id);

const emitActivePaymentUpdate = (paymentMethod: PaymentMethod) => {
  if (!selectedShippingMethod.value || !paymentMethod.isSelectable || disabled) return;
  emit('update:activePayment', paymentMethod.id);
};

const handlePaymentMethodChange = (paymentMethod: PaymentMethod) => {
  paymentProviderGetters.isPaymentMethodExcluded(selectedShippingMethod.value, paymentMethod.id)
    ? send({ message: t('billing.methodChanged'), type: 'warning' })
    : emitActivePaymentUpdate(paymentMethod);
};

on('frontend:paypalAPMsLoaded', async () => {
  await fetchPaymentMethods();
});
</script>
