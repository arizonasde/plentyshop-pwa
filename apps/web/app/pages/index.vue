<template>
  <div>
    <!-- Arizona: Black Friday banner on top of the editor blocks, only during the Black Week -->
    <ArizonaBlackFridayHero />
    <!-- Arizona: the German home page is built in code; other languages and the shop editor keep the editor blocks -->
    <ArizonaHomepage v-if="showArizonaHomepage" />
    <EditableBlocks v-else :identifier="HOMEPAGE_IDENTIFIER" :type="'immutable'" />
    <!-- Arizona: one price note for all sliders on the home page -->
    <ArizonaVatHint class="max-w-screen-3xl mx-auto px-4 @md:px-10 mb-6 text-neutral-500" />
  </div>
</template>

<script lang="ts" setup>
import type { Locale } from '#i18n';
import ArizonaVatHint from '~/components/ArizonaVatHint/ArizonaVatHint.vue';
import ArizonaBlackFridayHero from '~/components/ArizonaBlackFridayHero/ArizonaBlackFridayHero.vue';
import ArizonaHomepage from '~/components/ArizonaHomepage/ArizonaHomepage.vue';

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

const { locale } = useI18n();
const { isEditMode } = useEditorState();
const showArizonaHomepage = computed(() => locale.value === 'de' && !isEditMode.value);

const { setPageMeta } = usePageMeta();

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
