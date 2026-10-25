export type ArizonaBackInStockProps = {
  itemId: number;
  /** Missing when plentyONE does not deliver the sold-out variation. */
  variationId?: number;
  variantName?: string;
  productName: string;
  sizeName: string;
};
