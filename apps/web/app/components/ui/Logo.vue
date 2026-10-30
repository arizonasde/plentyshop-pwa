<template>
  <picture>
    <template v-if="imageExtension === 'svg'">
      <NuxtImg
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        class="w-100 py-2"
        width="150"
        height="40"
        preload
      />
    </template>
    <template v-else>
      <img
        id="logo"
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        :width="imgWidth"
        :height="imgHeight"
        class="h-8 w-auto max-w-[200px] object-contain"
        preload
      />
    </template>
  </picture>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { getSetting: getHeaderLogo } = useSiteSettings('headerLogo');

const headerLogo = computed(() => getHeaderLogo());

const storeName = runtimeConfig.public.storename;

const imageExtension = computed(() => headerLogo.value.split('.').pop());
const logo = ref<HTMLImageElement | null>(null);
// Arizona: start with the size of our logo (200x32) so the server HTML reserves its space (no layout shift).
const imgWidth = ref<string>('200');
const imgHeight = ref<string>('32');
onMounted(() => {
  if (logo.value) {
    imgWidth.value = logo.value.clientWidth + '';
    imgHeight.value = logo.value.clientHeight + '';
  }
});
</script>
