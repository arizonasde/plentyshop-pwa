/**
 * Arizona: own title and meta description for static pages (legal texts, contact, shipping),
 * which otherwise all carry the title and description of the home page.
 */
export const useArizonaStaticPageHead = (title: string, description: string) => {
  useHead({ title });
  useSeoMeta({ description, ogTitle: title, ogDescription: description });
};
