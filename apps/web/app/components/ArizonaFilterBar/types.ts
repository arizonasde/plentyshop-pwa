import type { FilterGroup } from '@plentymarkets/shop-api';

export type ArizonaFilterBarProps = {
  facets: FilterGroup[];
  /** Show the "Kategorie" facet (categories without subcategories, e.g. SALE) */
  showCategoryFacet?: boolean;
};
