<template>
  <div v-if="logo && !failed" data-testid="brand-logo">
    <NuxtLink v-if="brandPage" :to="localePath(`/marken/${brandPage.slug}`)" class="inline-block">
      <img
        :src="logo"
        :alt="`Logo ${brandName}`"
        class="h-10 w-auto max-w-[10rem] object-contain object-left"
        loading="lazy"
        @error="failed = true"
      />
    </NuxtLink>
    <img
      v-else
      :src="logo"
      :alt="`Logo ${brandName}`"
      class="h-10 w-auto max-w-[10rem] object-contain object-left"
      loading="lazy"
      @error="failed = true"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Arizona: original logo of the product's manufacturer (logo field of the manufacturer in plentyONE), linked to the
 * brand page when there is one. Hidden when no logo is stored or the image cannot be loaded.
 */
const { currentProduct } = useProducts();
const localePath = useLocalizedPath();
const failed = ref(false);

const manufacturer = computed(
  () => (currentProduct.value?.item as { manufacturer?: { logo?: string; externalName?: string; name?: string } })
    ?.manufacturer,
);
const logo = computed(() => manufacturer.value?.logo?.trim() ?? '');
const brandName = computed(() => (Object.keys(currentProduct.value ?? {}).length ? getBrandName(currentProduct.value) : ''));
const brandPage = computed(() => (brandName.value ? findArizonaBrandByName(brandName.value) : undefined));

watch(logo, () => (failed.value = false));
</script>
