/**
 * Composable for setting the page title.
 * Used in layouts. Title can be changed in pages through the `useHead` composable.
 */
import { metaDefaults, openGraph } from '~/configuration/app.config';

export const usePageTitle = () => {
  const runtimeConfig = useRuntimeConfig().public;

  const { getSetting: getMetaTitle } = useSiteSettings('metaTitle');
  const { getSetting: getOgTitle } = useSiteSettings('ogTitle');

  const defaultTitle = computed(() => getMetaTitle() || runtimeConfig.metaTitle || metaDefaults.title);

  const titleSuffix = computed(() => getOgTitle() || runtimeConfig.ogTitle || openGraph.title);

  useHead({
    titleTemplate: (titleChunk) => {
      const title = titleChunk || defaultTitle.value;
      // Arizona: no second shop name when the title already contains it (e.g. the home page)
      if (titleSuffix.value && title.includes(titleSuffix.value)) return title;

      return `${title} | ${titleSuffix.value}`;
    },
  });
};
