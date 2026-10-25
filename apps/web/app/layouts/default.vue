<template>
  <div>
    <UiHeaderBlocks />

    <NarrowContainer v-if="breadcrumbs?.length" class="px-4 pt-3 pb-1">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <Cookiebar />
    <PreviewMode />
    <UiFooterBlocks />
    <LazyArizonaMiniCart v-if="isOpen" :key="miniCartKey" :product="product" />
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
// Arizona: a small cart box replaces the quick checkout dialog; a new key restarts it on every add to cart.
const { lastUpdatedCartItem } = useCart();
const miniCartKey = computed(() => `${lastUpdatedCartItem.value?.id ?? 0}-${lastUpdatedCartItem.value?.quantity ?? 0}`);
setLogoMeta();
</script>
