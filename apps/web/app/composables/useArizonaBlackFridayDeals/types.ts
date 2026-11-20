/** Arizona: black-friday-extra.json (bf_extra.py), same form as the entries of tagesangebote.json */
export type ArizonaBlackFridayExtraFile = {
  datum?: string;
  angebote: { itemId: number; variationId?: number; preis?: number; statt?: number; bereich?: string }[];
};
