import { breadcrumbGetters } from '@plentymarkets/shop-api';

/**
 * Arizona: title and meta description for category pages, generated from the category path.
 * The category meta data in plentyONE is shared with the old shop and largely empty or duplicated,
 * so the PWA builds its own unique values (German only; other languages keep the default behaviour).
 */
export const useArizonaCategoryMeta = () => {
  const { locale } = useI18n();
  const { data: productsCatalog } = useProducts();
  const { getSetting: getOgTitle } = useSiteSettings('ogTitle');
  const runtimeConfig = useRuntimeConfig().public;

  const label = computed(() => {
    if (locale.value !== 'de' || !productsCatalog.value?.category) return '';
    const path = breadcrumbGetters
      .mapFromCategoryBreadcrumbs(productsCatalog.value.breadcrumbs ?? [])
      .map((breadcrumb) => breadcrumb.name);
    return buildCategoryLabel(path);
  });

  const title = computed(() =>
    label.value ? buildCategoryTitle(label.value, getOgTitle() || String(runtimeConfig.ogTitle ?? '')) : '',
  );
  const description = computed(() => (label.value ? buildCategoryDescription(label.value) : ''));

  return { title, description };
};
