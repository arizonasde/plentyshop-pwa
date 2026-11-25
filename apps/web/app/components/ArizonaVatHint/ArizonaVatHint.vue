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
    <span aria-hidden="true">·</span>
    <UiLink
      :href="localePath(paths.cancellationRights)"
      target="_blank"
      class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
      data-testid="arizona-returns-link"
    >
      {{ returnsLabel }}
    </UiLink>
  </div>
</template>

<script setup lang="ts">
// Arizona: price note (VAT + shipping), shared by the sliders and the home page
const { showNetPrices } = useCart();
const localePath = useLocalizedPath();
const { locale } = useI18n();

// Arizona: "Rückgabe" link to the cancellation rights, labelled per shop language
const RETURNS_LABELS: Record<string, string> = {
  de: 'Rückgabe',
  en: 'Returns',
  fr: 'Retours',
  it: 'Resi',
  es: 'Devoluciones',
  nl: 'Retourneren',
  pl: 'Zwroty',
};
const returnsLabel = computed(() => RETURNS_LABELS[locale.value] ?? RETURNS_LABELS.de);
</script>
