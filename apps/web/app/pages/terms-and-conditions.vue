<template>
  <div class="w-full p-5">
    <h1 class="font-bold typography-headline-3 @md:typography-headline-2 mb-4">{{ t('legal.termsAndConditions') }}</h1>
    <div class="overflow-x-auto break-words no-preflight" v-html="getHTMLTexts()" />
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const { data, getLegalTexts } = useLegalInformation();
const { getRobots, setRobotForStaticPage } = useRobots();

definePageMeta({
  pageType: 'static',
});
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('legal.termsAndConditions'), icon);
useArizonaStaticPageHead(t('legal.termsAndConditions'), 'Allgemeine Geschäftsbedingungen von Arizona Shopping für Bestellungen im Online-Shop.');

await getLegalTexts({
  type: 'TermsConditions',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

await getRobots();
setRobotForStaticPage('TermsAndConditions');
</script>
