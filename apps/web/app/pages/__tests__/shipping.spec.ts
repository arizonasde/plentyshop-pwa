import { ARIZONA_SHIPPING_COUNTRIES, ARIZONA_FREE_SHIPPING_FROM, ARIZONA_SHIPPING_COST } from '~/utils/arizonaShipping';

describe('shipping cost overview', () => {
  it('lists every delivery country once', () => {
    const countries = ARIZONA_SHIPPING_COUNTRIES.map((row) => row.country);
    expect(countries).toEqual([
      'Deutschland',
      'Österreich',
      'Belgien',
      'Frankreich',
      'Italien',
      'Niederlande',
      'Polen',
      'Spanien',
    ]);
  });

  it('keeps Germany in line with the free shipping threshold', () => {
    expect(ARIZONA_SHIPPING_COUNTRIES[0]).toEqual({
      country: 'Deutschland',
      cost: ARIZONA_SHIPPING_COST,
      freeFrom: ARIZONA_FREE_SHIPPING_FROM,
    });
  });
});
