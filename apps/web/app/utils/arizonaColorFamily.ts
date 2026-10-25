/**
 * Arizona: maps a colour name of a variation (e.g. "Dunkelgrau", "Schwarz-2", "middle-brown") to the colour family
 * of the shop's "Farbe" filter, so a slider can show items in the same or a similar colour.
 * The ids are the filter values of the colour facet in plentyONE.
 */
const COLOR_FAMILIES: { facetValueId: number; keywords: string[] }[] = [
  { facetValueId: 14, keywords: ['bunt', 'multi', 'mehrfarbig', 'print'] },
  { facetValueId: 2, keywords: ['schwarz', 'black'] },
  { facetValueId: 11, keywords: ['rosa', 'pink', 'violett', 'lila', 'flieder', 'purple', 'mauve', 'beere', 'magenta'] },
  { facetValueId: 1, keywords: ['rot', 'red', 'bordeaux', 'burgund', 'koralle', 'coral'] },
  { facetValueId: 9, keywords: ['türkis', 'tuerkis', 'petrol', 'aqua', 'turquoise'] },
  { facetValueId: 10, keywords: ['khaki', 'oliv', 'olive'] },
  { facetValueId: 7, keywords: ['grün', 'gruen', 'green', 'mint'] },
  { facetValueId: 8, keywords: ['blau', 'blue', 'navy', 'jeans', 'denim', 'indigo'] },
  { facetValueId: 12, keywords: ['braun', 'brown', 'cognac', 'mocca', 'mokka', 'schoko', 'taupe', 'kaffee', 'camel'] },
  { facetValueId: 6, keywords: ['beige', 'gelb', 'yellow', 'sand', 'senf', 'ocker', 'creme', 'ecru', 'nude', 'vanille'] },
  { facetValueId: 5, keywords: ['grau', 'grey', 'gray', 'silber', 'silver', 'anthrazit', 'melange'] },
  { facetValueId: 4, keywords: ['weiß', 'weiss', 'white', 'offwhite'] },
];

export const getColorFamilyFacetValueId = (colorName: string): number | undefined => {
  const name = colorName.toLowerCase();
  return COLOR_FAMILIES.find((family) => family.keywords.some((keyword) => name.includes(keyword)))?.facetValueId;
};
