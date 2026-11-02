/**
 * Arizona: shop title and meta description for the other shop languages. The values in the shop settings
 * (metaTitle/metaDescription) exist only once and are German, so every language would show the German home title.
 * Returns empty strings for German, so the settings stay in charge there.
 */
const SHOP_META: Record<string, { title: string; description: string }> = {
  en: {
    title: 'Arizona Shopping – Fashion for women and men',
    description: 'Fashion for women and men from ONLY, Jack & Jones, Vero Moda, Tom Tailor and Mavi.',
  },
  fr: {
    title: 'Arizona Shopping – Mode pour femmes et hommes',
    description: 'Mode pour femmes et hommes de ONLY, Jack & Jones, Vero Moda, Tom Tailor et Mavi.',
  },
  it: {
    title: 'Arizona Shopping – Moda donna e uomo',
    description: 'Moda donna e uomo di ONLY, Jack & Jones, Vero Moda, Tom Tailor e Mavi.',
  },
  es: {
    title: 'Arizona Shopping – Moda para mujer y hombre',
    description: 'Moda para mujer y hombre de ONLY, Jack & Jones, Vero Moda, Tom Tailor y Mavi.',
  },
  nl: {
    title: 'Arizona Shopping – Mode voor dames en heren',
    description: 'Mode voor dames en heren van ONLY, Jack & Jones, Vero Moda, Tom Tailor en Mavi.',
  },
  pl: {
    title: 'Arizona Shopping – Moda damska i męska',
    description: 'Moda damska i męska marek ONLY, Jack & Jones, Vero Moda, Tom Tailor i Mavi.',
  },
};

export const useArizonaShopMeta = () => {
  const { locale } = useI18n();

  const title = computed(() => SHOP_META[locale.value]?.title ?? '');
  const description = computed(() => SHOP_META[locale.value]?.description ?? '');

  return { title, description };
};
