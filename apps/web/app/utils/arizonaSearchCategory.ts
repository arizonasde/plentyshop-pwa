import { categoryTreeGetters, type CategoryTreeItem, type FilterGroup } from '@plentymarkets/shop-api';

/**
 * Arizona: the plentyONE search links the words of a query with OR ("jeans blau" also finds every blue item) and
 * offers no AND operator. Filters (facets) however combine with AND. So the words of a query are turned into
 * filters and categories:
 * - colour, brand, size and product type words become filters ("jeans blau" → Jeans + Blau),
 * - gender and category words lead to the category ("jeans damen blau" → Damen › Jeans with filter Blau).
 * Ambiguous words ("jeans" exists for women, men and kids) stay in the search.
 */
const SYNONYMS: Record<string, string> = {
  frau: 'damen',
  frauen: 'damen',
  dame: 'damen',
  women: 'damen',
  damenmode: 'damen',
  mann: 'herren',
  maenner: 'herren',
  herr: 'herren',
  men: 'herren',
  herrenmode: 'herren',
  kind: 'kinder',
  kids: 'kinder',
  kindermode: 'kinder',
  junge: 'jungen',
};

export const normalizeArizonaSearch = (text: string) =>
  text
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((word) => SYNONYMS[word] ?? word);

// adjective endings count too ("rote" → Rot, "blaues" → Blau)
const wordMatches = (word: string, token: string) =>
  word === token ||
  ['e', 'er', 'es', 'en'].some((ending) => word === token + ending) ||
  (Math.min(word.length, token.length) >= 4 && (token.startsWith(word) || word.startsWith(token)));

export const findArizonaSearchCategory = (
  tree: CategoryTreeItem[],
  term: string | string[],
): CategoryTreeItem | undefined => {
  const words = Array.isArray(term) ? term : normalizeArizonaSearch(term);
  if (words.length === 0) return undefined;

  const matches: { node: CategoryTreeItem; depth: number }[] = [];
  const walk = (nodes: CategoryTreeItem[], tokens: string[], depth: number) => {
    for (const node of nodes) {
      const pathTokens = [...tokens, ...normalizeArizonaSearch(categoryTreeGetters.getName(node) ?? '')];
      if (words.every((word) => pathTokens.some((token) => wordMatches(word, token)))) {
        matches.push({ node, depth });
        continue; // a parent that matches already covers its children
      }
      walk(categoryTreeGetters.getItems(node) ?? [], pathTokens, depth + 1);
    }
  };
  walk(tree, [], 0);

  const shallowest = Math.min(...matches.map((match) => match.depth));
  const best = matches.filter((match) => match.depth === shallowest);
  return best.length === 1 ? best[0]?.node : undefined;
};

const PRODUCT_TYPE_FACET = 'kategorie';

/** Which filter values a query names, per word. Brands need all their words, sizes an exact match. */
const matchFacets = (words: string[], facets: FilterGroup[]) => {
  const matched: { id: string; words: string[]; productType: boolean }[] = [];
  for (const group of facets) {
    if (group.type === 'feedback' || group.type === 'price') continue;
    const groupName = normalizeArizonaSearch(group.name).join(' ');
    const isBrand = group.type === 'producer';
    const isSize = groupName === 'groesse';
    for (const value of group.values ?? []) {
      const tokens = normalizeArizonaSearch(String(value.name ?? ''));
      if (tokens.length === 0) continue;
      const hits = isBrand
        ? tokens.every((token) => words.includes(token))
          ? tokens
          : []
        : isSize
          ? words.filter((word) => word.length >= 2 && tokens.length === 1 && word === tokens[0])
          : words.filter((word) => tokens.some((token) => wordMatches(word, token)));
      if (hits.length > 0) {
        matched.push({ id: String(value.id), words: hits, productType: groupName === PRODUCT_TYPE_FACET });
      }
    }
  }
  return matched;
};

export const resolveArizonaSearch = (
  term: string,
  facets: FilterGroup[],
  tree: CategoryTreeItem[],
): { category?: CategoryTreeItem; facetIds: string[]; term: string } => {
  const words = normalizeArizonaSearch(term);
  const matched = matchFacets(words, facets);
  const attributeFilters = matched.filter((match) => !match.productType);
  const attributeWords = new Set(attributeFilters.flatMap((match) => match.words));

  // gender and category words (e.g. "damen jeans") lead to the category, colour/brand/size stay filters
  const categoryWords = words.filter((word) => !attributeWords.has(word));
  const category = categoryWords.length > 0 ? findArizonaSearchCategory(tree, categoryWords) : undefined;
  if (category) return { category, facetIds: attributeFilters.map((match) => match.id), term };

  // a single remaining word is searched as it is; with several, product types ("jeans") become filters too
  let rest = categoryWords;
  const facetIds = attributeFilters.map((match) => match.id);
  if (rest.length >= 2) {
    const productTypes = matched.filter((match) => match.productType && match.words.every((word) => rest.includes(word)));
    const remaining = rest.filter(
      (word) => word.length >= 2 && !productTypes.some((match) => match.words.includes(word)),
    );
    if (productTypes.length > 0 && remaining.length > 0) {
      facetIds.push(...productTypes.map((match) => match.id));
      rest = remaining;
    }
  }

  // the search field keeps the shopper's spelling of the words that are not filters
  const kept = term
    .split(/\s+/)
    .filter((word) => normalizeArizonaSearch(word).some((part) => rest.includes(part)))
    .join(' ');
  return { facetIds, term: kept || term };
};
