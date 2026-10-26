import type { Product } from '@plentymarkets/shop-api';

/**
 * Arizona: plentyONE delivers empty seoSettings for shop no. 2, so brand, GTIN-13 and availability for the
 * structured data are read from the product itself. Mirrors the SEO settings of the shop editor:
 * brand/manufacturer = external manufacturer name, GTIN-13 = barcode "Hersteller_EAN" (19),
 * availability 1–2 InStock, 3–4 BackOrder, 5–10 OutOfStock.
 */
export const ARIZONA_GTIN13_BARCODE_ID = 19;

// The raw plentyONE product carries more fields than the Product type exposes.
const raw = (product: Product) =>
  product as Product & {
    barcodes?: { id?: number; code?: string }[];
    item?: { manufacturer?: { name?: string; externalName?: string } };
    variation?: { availabilityId?: number; availability?: { id?: number } };
  };

export const getArizonaBrand = (product: Product): string => {
  const manufacturer = raw(product).item?.manufacturer;
  return (manufacturer?.externalName || manufacturer?.name || '').trim();
};

export const getArizonaGtin13 = (product: Product): string => {
  const barcodes = raw(product).barcodes ?? [];
  const isGtin13 = (code?: string) => /^\d{13}$/.test(code ?? '');
  const preferred = barcodes.find((barcode) => barcode.id === ARIZONA_GTIN13_BARCODE_ID && isGtin13(barcode.code));
  return (preferred ?? barcodes.find((barcode) => isGtin13(barcode.code)))?.code ?? '';
};

export const getArizonaAvailability = (product: Product): string => {
  const variation = raw(product).variation;
  const id = Number(variation?.availabilityId ?? variation?.availability?.id ?? 0);
  if (id >= 1 && id <= 2) return 'https://schema.org/InStock';
  if (id >= 3 && id <= 4) return 'https://schema.org/BackOrder';
  if (id >= 5 && id <= 10) return 'https://schema.org/OutOfStock';
  return '';
};
