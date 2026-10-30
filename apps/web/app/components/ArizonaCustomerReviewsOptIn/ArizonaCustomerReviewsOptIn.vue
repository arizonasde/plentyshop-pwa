<template>
  <span hidden data-testid="google-customer-reviews-opt-in" />
</template>

<script setup lang="ts">
import { orderGetters, type Order } from '@plentymarkets/shop-api';
import { getArizonaCustomerReviewsOptIn, GOOGLE_MERCHANT_ID } from '~/utils/arizonaCustomerReviews';
import type { Gapi } from './types';

/**
 * Arizona: Google Customer Reviews survey opt-in on the order confirmation page (Merchant Center 9083127).
 * Google shows its own dialog in which the customer agrees to the survey email after delivery.
 * Rendered in the browser only, once per order.
 */
const { order } = defineProps<{ order: Order }>();
// Already loaded by ConfirmationPageContent.
const { data: countries } = useActiveShippingCountries();

onMounted(() => {
  if (orderGetters.isReturn(order)) return;
  const orderId = orderGetters.getId(order);
  const storageKey = `arizona-gcr-${orderId}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
  } catch {
    // Storage blocked: Google itself shows the dialog only once per order.
  }

  const options = getArizonaCustomerReviewsOptIn(order, countries.value);
  if (!options) return;

  const win = window as unknown as Window & { gapi?: Gapi; renderOptIn?: () => void };
  win.renderOptIn = () =>
    win.gapi?.load('surveyoptin', () => {
      win.gapi?.surveyoptin.render({ merchant_id: GOOGLE_MERCHANT_ID, ...options });
      try {
        sessionStorage.setItem(storageKey, '1');
      } catch {
        // see above
      }
    });

  if (win.gapi?.load) {
    win.renderOptIn();
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});
</script>
