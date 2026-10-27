<template>
  <div>
    <EditableBlocks :identifier="HOMEPAGE_IDENTIFIER" :type="'immutable'" />
    <!-- Arizona: one price note for all sliders on the home page -->
    <ArizonaVatHint class="max-w-screen-3xl mx-auto px-4 @md:px-10 mb-6 text-neutral-500" />
  </div>
</template>

<script lang="ts" setup>
import type { Locale } from '#i18n';
import ArizonaVatHint from '~/components/ArizonaVatHint/ArizonaVatHint.vue';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
  isBlockified: true,
  type: 'immutable',
  identifier: HOMEPAGE_IDENTIFIER,
  middleware: ['newsletter-confirmation-client', 'notifyme-interactions-client'],
  cacheControl: getCacheControl(),
});

const { setPageMeta } = usePageMeta();

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
