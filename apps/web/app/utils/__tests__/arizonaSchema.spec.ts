import { describe, expect, it } from 'vitest';
import type { Product } from '@plentymarkets/shop-api';
import { getArizonaAvailability, getArizonaBrand, getArizonaGtin13 } from '../arizonaSchema';

const product = (data: Record<string, unknown>) => data as unknown as Product;

describe('getArizonaGtin13', () => {
  it('prefers the manufacturer EAN (barcode 19)', () => {
    const barcodes = [
      { id: 1, code: '4059493646222' },
      { id: 19, code: '4066887273872' },
    ];
    expect(getArizonaGtin13(product({ barcodes }))).toBe('4066887273872');
  });

  it('falls back to the first 13-digit barcode', () => {
    expect(getArizonaGtin13(product({ barcodes: [{ id: 1, code: '4059493646222' }] }))).toBe('4059493646222');
  });

  it('ignores invalid codes', () => {
    expect(getArizonaGtin13(product({ barcodes: [{ id: 19, code: 'ABC' }] }))).toBe('');
  });
});

describe('getArizonaBrand', () => {
  it('uses the external manufacturer name', () => {
    expect(getArizonaBrand(product({ item: { manufacturer: { name: 'Amaci&Sons', externalName: 'HUMY' } } }))).toBe(
      'HUMY',
    );
  });
});

describe('getArizonaAvailability', () => {
  it('maps the availability ids', () => {
    expect(getArizonaAvailability(product({ variation: { availabilityId: 1 } }))).toBe('https://schema.org/InStock');
    expect(getArizonaAvailability(product({ variation: { availabilityId: 4 } }))).toBe('https://schema.org/BackOrder');
    expect(getArizonaAvailability(product({ variation: { availability: { id: 7 } } }))).toBe(
      'https://schema.org/OutOfStock',
    );
    expect(getArizonaAvailability(product({ variation: {} }))).toBe('');
  });
});
