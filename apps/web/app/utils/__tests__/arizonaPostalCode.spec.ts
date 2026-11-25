import { describe, expect, it, vi } from 'vitest';
import { loadArizonaPostalCodeCities, normalizeArizonaPostalCode } from '~/utils/arizonaPostalCode';

describe('arizonaPostalCode', () => {
  it('normalises postal codes per country', () => {
    expect(normalizeArizonaPostalCode('DE', ' 10117 ')).toBe('10117');
    expect(normalizeArizonaPostalCode('DE', '1011')).toBe('');
    expect(normalizeArizonaPostalCode('NL', '1016 ab')).toBe('1016');
    expect(normalizeArizonaPostalCode('PL', '00007')).toBe('00-007');
    expect(normalizeArizonaPostalCode('AT', '1010')).toBe('1010');
  });

  it('loads only the file for the prefix and returns all places', async () => {
    const load = vi.fn().mockResolvedValue({ '01945': 'Tettau|Guteborn', '01968': 'Senftenberg' });
    expect(await loadArizonaPostalCodeCities('DE', '01945', load)).toEqual(['Tettau', 'Guteborn']);
    expect(await loadArizonaPostalCodeCities('DE', '01968', load)).toEqual(['Senftenberg']);
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith('/_nuxt-plenty/plz/DE/01.json');
  });

  it('returns nothing for unknown countries or incomplete codes', async () => {
    const load = vi.fn().mockResolvedValue({});
    expect(await loadArizonaPostalCodeCities('CH', '8001', load)).toEqual([]);
    expect(await loadArizonaPostalCodeCities('DE', '12', load)).toEqual([]);
    expect(load).not.toHaveBeenCalled();
  });
});
