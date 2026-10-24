import { productGetters, type Product } from '@plentymarkets/shop-api';
import type { ColorOption, ColorState } from './types';

const MAX_PARALLEL_REQUESTS = 3;
const queue: (() => Promise<void>)[] = [];
let running = 0;

const runQueue = () => {
  while (running < MAX_PARALLEL_REQUESTS && queue.length > 0) {
    const job = queue.shift();
    if (!job) break;
    running++;
    job().finally(() => {
      running--;
      runQueue();
    });
  }
};

/**
 * Builds one option per colour of an item from its variation attribute map:
 * the colour attribute's image and the lowest variation id of that colour as link target.
 */
const buildColorOptions = (product: Product, colorAttributeId: number, localePath: (path: string) => string) => {
  const map = product.variationAttributeMap;
  const colorAttribute = map?.attributes?.find((attribute) => attribute.attributeId === colorAttributeId);
  if (!map || !colorAttribute) return [];

  const urlPath = productGetters.getUrlPath(product);
  const itemId = productGetters.getItemId(product);

  return colorAttribute.values
    .map((value) => {
      const ofColor = map.variations.filter((variation) =>
        variation.attributes?.some(
          (attribute) => attribute.attributeId === colorAttributeId && attribute.attributeValueId === value.attributeValueId,
        ),
      );
      if (ofColor.length === 0) return null;

      // Link to a size that can be bought, if the colour has one.
      const salable = ofColor.filter((variation) => variation.isSalable);
      const variationId = Math.min(...(salable.length > 0 ? salable : ofColor).map((variation) => variation.variationId));
      return {
        valueId: value.attributeValueId,
        name: value.name,
        imageUrl: value.imageUrl,
        variationId,
        path: localePath(`/${urlPath}_${itemId}_${variationId}`),
      };
    })
    .filter((option): option is ColorOption => option !== null);
};

/**
 * Loads all colours of an item once (shared cache, at most three requests in parallel),
 * so listing cards can show every colour, not only the ones on the current page.
 */
export const useColorVariants = () => {
  const state = useState<ColorState>('arizonaColorVariants', () => ({}));
  const localePath = useLocalizedPath();
  const colorAttributeId = Number(useRuntimeConfig().public.canonicalGroupAttributeId || 2);

  const loadColors = (itemId: number | string) => {
    const key = String(itemId);
    if (!key || state.value[key]) return;
    state.value[key] = 'loading';

    queue.push(async () => {
      try {
        const { data } = await useSdk().plentysystems.getProduct({ id: key });
        state.value[key] = data ? buildColorOptions(data, colorAttributeId, localePath) : [];
      } catch {
        state.value[key] = 'error';
      }
    });
    runQueue();
  };

  const colorsOf = (itemId: number | string): ColorOption[] | null => {
    const entry = state.value[String(itemId)];
    return Array.isArray(entry) ? entry : null;
  };

  return { loadColors, colorsOf };
};
