<template>
  <!-- Arizona: generous spacing around colour and size so they stand out -->
  <div v-if="attributes.length > 0" data-testid="product-attributes" class="my-6 space-y-6">
    <div v-for="(attribute, index) in attributes" :key="index">
      <Component
        :is="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
        v-if="componentsMapper[productAttributeGetters.getAttributeType(attribute)]"
        :attribute="attribute"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductAttributesProps, ComponentsMapper } from './types';
import AttributeBox from './AttributeBox/AttributeBox.vue';
import AttributeImage from './AttributeImage/AttributeImage.vue';
import { productAttributeGetters } from '@plentymarkets/shop-api';

// Arizona: sizes and lengths are picked from buttons instead of a dropdown, like on large fashion shops.
const componentsMapper: ComponentsMapper = {
  dropdown: AttributeBox,
  box: AttributeBox,
  image: AttributeImage,
};

const { attributes, setAttribute } = useProductAttributes();
const props = defineProps<ProductAttributesProps>();
const product = computed(() => props.product);
const route = useRoute();

const normalizedPath = route.path.endsWith('/') ? route.path.slice(0, -1) : route.path;
const lastSegment = normalizedPath.split('/').pop() ?? '';
const selectAttributes = ref(lastSegment.split('_').length > 2 || useCallisto().isEnabled);
setAttribute(product.value, selectAttributes.value);

watch(product, (newProduct) => {
  setAttribute(newProduct, true);
});
</script>
