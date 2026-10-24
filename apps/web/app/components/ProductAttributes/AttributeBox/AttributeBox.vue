<template>
  <div>
    <p :id="labelId" class="leading-5 text-sm font-semibold text-neutral-900 mb-2">
      {{ productAttributeGetters.getAttributeName(attribute) }}
    </p>

    <div role="group" :aria-labelledby="labelId" class="w-full grid grid-cols-[repeat(auto-fill,minmax(5.75rem,1fr))] gap-2">
      <button
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        type="button"
        class="border min-h-11 border-neutral-300 bg-white text-neutral-900 cursor-pointer hover:border-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        :class="{
          'text-neutral-400 line-through': productAttributeGetters.isAttributeValueDisabled(item),
          '!border-neutral-900 ring-1 ring-neutral-900': value === productAttributeGetters.getAttributeValueId(item),
          '!ring-negative-700 !border-negative-700 ring-1': Boolean(errors['selectedValue']),
        }"
        :aria-pressed="value === productAttributeGetters.getAttributeValueId(item)"
        @click="doUpdateValue(productAttributeGetters.getAttributeValueId(item))"
      >
        <SfTooltip :label="getLabel(item)" strategy="absolute" :show-arrow="true" placement="top">
          <span class="typography-text-sm font-medium min-h-11 flex items-center justify-center px-2">
            {{ productAttributeGetters.getAttributeValueName(item) }}
          </span>
        </SfTooltip>
      </button>
    </div>
    <ErrorMessage as="span" name="selectedValue" class="flex text-negative-700 text-sm mt-2" />
  </div>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';
import type { AttributeSelectProps } from '../types';
import type { VariationMapProductAttributeValue } from '@plentymarkets/shop-api';
import { productAttributeGetters } from '@plentymarkets/shop-api';
import { object, number } from 'yup';
import { useForm, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';

const { updateValue, getValue } = useProductAttributes();
const { shouldUseFakeData } = useEditorState();
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const props = defineProps<AttributeSelectProps>();
const value = computed(() => getValue(props.attribute.attributeId));
const labelId = useId();

const getLabel = (item: VariationMapProductAttributeValue): string => {
  return productAttributeGetters.isAttributeValueDisabled(item) ? t('product.attributes.seeAvailableOptions') : '';
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
