import { buildProductTitle } from '~/utils/arizonaSeo';

describe('buildProductTitle', () => {
  it('puts the brand in front when the name does not contain it', () => {
    expect(buildProductTitle('Hose Regular Fit', 'Arizona Shopping', 75, { brand: 'Timezone' })).toBe(
      'Timezone Hose Regular Fit | Arizona Shopping',
    );
  });

  it('does not repeat a brand that the name already starts with, regardless of case', () => {
    expect(buildProductTitle('Timezone Hose Regular Fit', 'Arizona Shopping', 75, { brand: 'Timezone' })).toBe(
      'Timezone Hose Regular Fit | Arizona Shopping',
    );
    expect(buildProductTitle('JACK & JONES Basic Sweatshirt', 'Arizona Shopping', 75, { brand: 'Jack & Jones' })).toBe(
      'JACK & JONES Basic Sweatshirt | Arizona Shopping',
    );
  });
});
