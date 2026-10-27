<template>
  <div class="typography-text-xs flex gap-1" data-testid="arizona-vat-hint">
    <span>{{ t('common.labels.asterisk') }}</span>
    <span v-if="showNetPrices">{{ t('product.priceExclVAT') }}</span>
    <span v-else>{{ t('product.priceInclVAT') }}</span>
    <i18n-t keypath="shipping.excludedLabel" scope="global">
      <template #shipping>
        <UiLink
          :href="localePath(paths.shipping)"
          target="_blank"
          class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
        >
          {{ t('common.labels.delivery') }}
        </UiLink>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
// Arizona: price note (VAT + shipping), shared by the sliders and the home page
const { showNetPrices } = useCart();
const localePath = useLocalizedPath();
</script>
