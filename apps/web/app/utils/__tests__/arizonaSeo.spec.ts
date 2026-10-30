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

  it('drops the colour before cutting the name in the middle of a word', () => {
    expect(
      buildProductTitle('Kurzarmshirt Rundhalsausschnitt', 'Arizona Shopping', 65, {
        brand: 'Eight 2 Nine',
        color: 'Beige',
      }),
    ).toBe('Eight 2 Nine Kurzarmshirt Rundhalsausschnitt | Arizona Shopping');
  });

  it('keeps the colour when everything fits', () => {
    expect(buildProductTitle('Hose Regular Fit', 'Arizona Shopping', 65, { brand: 'Timezone', color: 'Beige' })).toBe(
      'Timezone Hose Regular Fit – Beige | Arizona Shopping',
    );
  });
});
