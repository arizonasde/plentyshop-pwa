<template>
  <div class="w-full p-5">
    <h1 class="font-bold typography-headline-3 @md:typography-headline-2 mb-4">{{ t('legal.legalDisclosure') }}</h1>
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
const { setPageMeta } = usePageMeta();

const icon = 'page';
setPageMeta(t('legal.legalDisclosure'), icon);
useArizonaStaticPageHead(t('legal.legalDisclosure'), 'Impressum von Arizona Shopping (ARIZONAS GmbH, Worms): Anbieterkennung, Kontaktdaten und Registerangaben.');

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'LegalDisclosure',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

await getRobots();
setRobotForStaticPage('LegalDisclosure');
</script>
