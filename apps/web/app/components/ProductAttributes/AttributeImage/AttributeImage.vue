<template>
  <div>
    <label
      :for="'attribute-' + productAttributeGetters.getAttributeId(attribute)"
      class="block leading-5 text-base text-neutral-900 mb-3"
    >
      <span class="font-semibold">{{ productAttributeGetters.getAttributeName(attribute) }}</span>
      <span v-if="value">: {{ selectedAttributeValueName }}</span>
    </label>
    <!-- Arizona: large photo tiles per colour, like on large fashion shops -->
    <div :id="'attribute-' + productAttributeGetters.getAttributeId(attribute)" class="w-full flex gap-2 flex-wrap">
      <SfTooltip
        v-for="item in productAttributeGetters.getAttributeValues(attribute)"
        :key="productAttributeGetters.getAttributeValueId(item)"
        :label="getLabel(item)"
        strategy="absolute"
        :show-arrow="true"
        placement="top"
      >
        <button
          type="button"
          class="isolate w-[6.75rem] h-[6.75rem] flex items-center justify-center rounded-md bg-[#F3F3F3] border border-transparent cursor-pointer hover:border-neutral-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          :class="{
            'opacity-40': productAttributeGetters.isAttributeValueDisabled(item),
            '!border-neutral-900': value === productAttributeGetters.getAttributeValueId(item),
            '!border-negative-700': Boolean(errors['selectedValue']),
          }"
          :aria-pressed="value === productAttributeGetters.getAttributeValueId(item)"
          :aria-label="productAttributeGetters.getAttributeValueName(item)"
          @click="doUpdateValue(item)"
        >
          <NuxtImg
            class="max-w-full max-h-full object-contain mix-blend-multiply py-1"
            :src="getImagePath(item)"
            :alt="productAttributeGetters.getAttributeValueName(item)"
            loading="lazy"
          />
        </button>
      </SfTooltip>
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
const { registerValidator, registerInvalidFields } = useValidatorAggregator('attributes');
const props = defineProps<AttributeSelectProps>();
const value = computed(() => getValue(props.attribute.attributeId));
const selectedAttributeValueName = ref<string>('');
const runtimeConfig = useRuntimeConfig();
const domain = runtimeConfig.public?.domain ?? '';

const getLabel = (item: VariationMapProductAttributeValue): string => {
  return productAttributeGetters.isAttributeValueDisabled(item)
    ? t('product.attributes.seeAvailableOptions')
    : productAttributeGetters.getAttributeValueName(item);
};

const getImagePath = (item: VariationMapProductAttributeValue): string => {
  // the larger tiles need the sharper "middle" size instead of plentyONE's small preview image
  const path = productAttributeGetters.getAttributeValueImageUrl(item).replace('/preview/', '/middle/');
  return path.startsWith('http') ? path : domain + path;
};

const validationSchema = toTypedSchema(
  object({
    selectedValue: number().required(t('error.requiredField')),
  }),
);

const { errors, defineField, validate, meta } = useForm({
  validationSchema: validationSchema,
});

registerValidator(validate);

const [selectedValue] = defineField('selectedValue');

const doUpdateValue = (attribute: VariationMapProductAttributeValue) => {
  updateValue(
    productAttributeGetters.getAttributeId(props.attribute),
    productAttributeGetters.getAttributeValueId(attribute),
  );
  selectedValue.value = getValue(props.attribute.attributeId);
  selectedAttributeValueName.value = productAttributeGetters.getAttributeValueName(attribute);
};

const setValue = (value: number | undefined) => {
  const getAttributeValue = productAttributeGetters.getAttributeValueById(props.attribute, value || -1);
  selectedValue.value = value;
  selectedAttributeValueName.value = getAttributeValue
    ? productAttributeGetters.getAttributeValueName(getAttributeValue)
    : '';
};

setValue(value.value);

watch(
  () => value.value,
  () => {
    setValue(value.value);
  },
);

watch(
  () => meta.value,
  () => {
    registerInvalidFields(
      meta.value.valid,
      `prop-${productAttributeGetters.getAttributeId(props.attribute)}`,
      productAttributeGetters.getAttributeName(props.attribute),
    );
  },
);
</script>
