<template>
  <div ref="rootRef" class="relative">
    <div class="mb-2 flex items-center justify-between gap-3">
      <p :id="labelId" class="leading-5 text-base font-bold text-neutral-900">
        {{ productAttributeGetters.getAttributeName(attribute) }}
      </p>
      <!-- Arizona: size guide next to the size selection -->
      <ArizonaSizeGuide v-if="isSizeAttribute" />
    </div>

    <!-- Arizona: size selection as a dropdown list with stock per size, like on Zalando -->
    <button
      type="button"
      class="flex w-full min-h-14 items-center justify-between gap-3 rounded-md border bg-white px-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      :class="
        errors['selectedValue']
          ? 'border-negative-700'
          : selectedOption
            ? 'border-neutral-900'
            : 'border-neutral-300'
      "
      :aria-expanded="open"
      :aria-labelledby="labelId"
      aria-haspopup="listbox"
      data-testid="size-select-trigger"
      @click="open = !open"
    >
      <span class="typography-text-base" :class="selectedOption ? 'font-semibold' : 'text-neutral-600'">
        {{ selectedOption ? selectedOption.name : 'Größe wählen' }}
      </span>
      <span class="flex items-center gap-3">
        <span v-if="selectedOption?.label" class="typography-text-sm" :class="selectedOption.labelClass">
          {{ selectedOption.label }}
        </span>
        <SfIconExpandMore class="transition-transform" :class="{ 'rotate-180': open }" aria-hidden="true" />
      </span>
    </button>

    <ul
      v-if="open"
      role="listbox"
      :aria-labelledby="labelId"
      class="absolute inset-x-0 z-dropdown mt-1 max-h-80 overflow-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
      data-testid="size-select-list"
    >
      <li
        v-for="option in options"
        :key="option.id"
        role="option"
        :aria-selected="option.id === value"
        :aria-disabled="option.soldOut"
        tabindex="0"
        class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-neutral-100"
        :class="{ 'bg-neutral-100 font-semibold': option.id === value }"
        :data-testid="option.soldOut ? 'size-option-sold-out' : 'size-option'"
        @click="choose(option)"
        @keydown.enter.prevent="choose(option)"
        @keydown.space.prevent="choose(option)"
      >
        <span :class="{ 'text-neutral-400 line-through': option.soldOut }">{{ option.name }}</span>
        <span v-if="option.soldOut" class="flex items-center gap-1.5 typography-text-sm text-neutral-700">
          Mich benachrichtigen
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </span>
        <span v-else-if="option.label" class="typography-text-sm" :class="option.labelClass">{{ option.label }}</span>
      </li>
    </ul>

    <p
      v-if="selectedOption?.lowStock && !open"
      class="mt-2 flex items-center gap-2 typography-text-sm font-semibold text-[#EA580C]"
      data-testid="low-stock-hint"
    >
      <span class="size-2 shrink-0 rounded-full bg-[#EA580C]" aria-hidden="true" />
      {{ selectedOption.label }}
    </p>
    <ArizonaBackInStock
      v-if="notifyOption"
      :key="notifyOption.id"
      :item-id="itemId"
      :variation-id="notifyOption.variationId"
      :size-name="notifyOption.name"
      :product-name="productName"
      :variant-name="variantName"
    />
    <ErrorMessage as="span" name="selectedValue" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { SfIconExpandMore } from '@storefront-ui/vue';
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import type { AttributeSelectProps } from '../types';
import type { VariationMapProductAttributeValue } from '@plentymarkets/shop-api';
import { productAttributeGetters, productGetters } from '@plentymarkets/shop-api';
import { object, number } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';

const { updateValue, getValue, combinations, attributeValues } = useProductAttributes();
const { shouldUseFakeData } = useEditorState();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const props = defineProps<AttributeSelectProps>();
const value = computed(() => getValue(props.attribute.attributeId));
const labelId = useId();

const rootRef = ref<HTMLElement>();
const open = ref(false);
const notifyId = ref<number>();
onClickOutside(rootRef, () => (open.value = false));
onKeyStroke('Escape', () => (open.value = false));

const itemId = computed(() => props.product?.item.id ?? 0);
// Size guide only for real sizes, not for "One Size"
const isSizeAttribute = computed(
  () =>
    /größe/i.test(productAttributeGetters.getAttributeName(props.attribute)) &&
    productAttributeGetters
      .getAttributeValues(props.attribute)
      .some((item) => !/one ?size/i.test(productAttributeGetters.getAttributeValueName(item))),
);
const productName = computed(() => (props.product ? productGetters.getName(props.product) : ''));
/** Values of the other attributes (e.g. "Farbe: Beige-2") for the notification. */
const variantName = computed(() =>
  (props.product?.variationAttributeMap?.attributes ?? [])
    .filter((attribute) => attribute.attributeId !== props.attribute.attributeId)
    .map((attribute) => {
      const chosen = attribute.values.find((v) => v.attributeValueId === attributeValues.value[attribute.attributeId]);
      return chosen ? `${attribute.name}: ${chosen.name}` : '';
    })
    .filter(Boolean)
    .join(', '),
);
const { getStock } = useArizonaStock(itemId);

/** Variation for this value combined with the values chosen for the other attributes (e.g. the colour). */
const findVariation = (item: VariationMapProductAttributeValue) => {
  const wanted = { ...attributeValues.value, [props.attribute.attributeId]: item.attributeValueId };
  return combinations.value.find((combination) =>
    Object.entries(wanted).every(([attributeId, valueId]) =>
      combination.attributes?.some((a) => a.attributeId === Number(attributeId) && a.attributeValueId === valueId),
    ),
  );
};

const options = computed(() =>
  productAttributeGetters
    .getAttributeValues(props.attribute)
    .map((item) => {
      const variation = findVariation(item);
      const stock = getStock(variation?.variationId);
      // plentyONE leaves sold-out variations out of the variation map, so a size without a variation in the chosen
      // colour is shown as sold out
      const soldOut = !variation || variation.isSalable === false || stock === 0;
      const label = soldOut || stock === undefined ? '' : stock > 2 ? 'Verfügbar' : `Nur noch ${stock} auf Lager`;
      return {
        id: productAttributeGetters.getAttributeValueId(item),
        name: productAttributeGetters.getAttributeValueName(item),
        variationId: variation?.variationId,
        soldOut,
        label,
        // Arizona: fewer than 3 pieces in stock is shown in orange
        lowStock: stock !== undefined && stock > 0 && stock < 3,
        labelClass: stock !== undefined && stock < 3 ? 'text-[#EA580C] font-semibold' : 'text-positive-700',
      };
    }),
);

const selectedOption = computed(() => options.value.find((option) => option.id === value.value));
const notifyOption = computed(() => options.value.find((option) => option.id === notifyId.value && option.soldOut));

const choose = (option: (typeof options.value)[number]) => {
  open.value = false;
  if (option.soldOut) {
    notifyId.value = option.id;
    return;
  }
  notifyId.value = undefined;
  doUpdateValue(option.id);
};

const validationSchema = toTypedSchema(
  object({
    selectedValue: number().required(t('error.requiredField')),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

if (!shouldUseFakeData.value) {
  registerValidator(validate);
}

const [selectedValue] = defineField('selectedValue');

const doUpdateValue = (value: number) => {
  updateValue(props.attribute.attributeId, value);
  selectedValue.value = getValue(props.attribute.attributeId);
};

const setValue = (value: number | undefined) => {
  selectedValue.value = value;
};

watch(
  value,
  (newVal) => {
    if (newVal) {
      setValue(newVal);
    }
  },
  { immediate: true },
);

watch(
  () => meta.value,
  () => {
    if (shouldUseFakeData.value) return;

    registerInvalidFields(
      meta.value.valid,
      `prop-${productAttributeGetters.getAttributeId(props.attribute)}`,
      productAttributeGetters.getAttributeName(props.attribute),
    );
  },
);
</script>
