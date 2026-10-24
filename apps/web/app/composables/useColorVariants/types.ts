export type ColorOption = {
  valueId: number;
  name: string;
  imageUrl: string;
  variationId: number;
  path: string;
};

export type ColorState = Record<string, ColorOption[] | 'loading' | 'error'>;
