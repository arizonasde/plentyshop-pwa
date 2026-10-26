import { categoryTreeGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';

/**
 * Arizona: the plentyONE search links the words of a query with OR ("jeans damen" also finds dresses and
 * cardigans) and offers no AND or category filter. When every word of the query names a category path
 * (e.g. Damen › Jeans), the search leads to that category instead. Ambiguous queries ("jeans" exists for women,
 * men and kids) keep the normal search.
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
  maedchen: 'maedchen',
};

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((word) => SYNONYMS[word] ?? word);

const wordMatches = (word: string, token: string) =>
  word === token || (Math.min(word.length, token.length) >= 4 && (token.startsWith(word) || word.startsWith(token)));

export const findArizonaSearchCategory = (
  tree: CategoryTreeItem[],
  term: string,
): CategoryTreeItem | undefined => {
  const words = normalize(term);
  if (words.length === 0) return undefined;

  const matches: { node: CategoryTreeItem; depth: number }[] = [];
  const walk = (nodes: CategoryTreeItem[], tokens: string[], depth: number) => {
    for (const node of nodes) {
      const pathTokens = [...tokens, ...normalize(categoryTreeGetters.getName(node) ?? '')];
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
