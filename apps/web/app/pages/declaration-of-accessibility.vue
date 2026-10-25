<template>
  <div class="w-full p-5">
    <h1 class="font-bold typography-headline-3 @md:typography-headline-2 mb-4">{{ t('legal.declarationOfAccessibility') }}</h1>
    <div class="overflow-x-auto break-words no-preflight" v-html="getHTMLTexts()" />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const { data, getLegalTexts } = useLegalInformation();
const { setPageMeta } = usePageMeta();
const { getRobots, setRobotForStaticPage } = useRobots();

const icon = 'page';
setPageMeta(t('legal.declarationOfAccessibility'), icon);
useArizonaStaticPageHead(t('legal.declarationOfAccessibility'), 'Erklärung zur Barrierefreiheit des Online-Shops von Arizona Shopping.');

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'DeclarationOfAccessibility',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

await getRobots();
setRobotForStaticPage('DeclarationOfAccessibility');
</script>
