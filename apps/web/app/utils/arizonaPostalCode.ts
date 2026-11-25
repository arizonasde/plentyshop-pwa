/**
 * Arizona: place names for a postal code, so the checkout can fill in the city by itself.
 * Data lies in public/_nuxt-plenty/plz/<ISO>/<first two characters>.json as {"10117": "Berlin|…"}
 * (GeoNames postal codes, CC BY 4.0). Only the small file for the typed prefix is loaded, nothing leaves the shop.
 */
export const ARIZONA_POSTAL_CODE_COUNTRIES = ['DE', 'AT', 'BE', 'FR', 'IT', 'NL', 'PL', 'ES'];

const MIN_LENGTH: Record<string, number> = { AT: 4, BE: 4, NL: 4 };

const files = new Map<string, Promise<Record<string, string>>>();

/** Normalises the typed postal code to the key used in the data files, or '' when it is not complete yet. */
export const normalizeArizonaPostalCode = (isoCode: string, postalCode: string): string => {
  const iso = isoCode.toUpperCase();
  let key = postalCode.trim().toUpperCase().replace(/\s+/g, '');
  if (iso === 'NL') key = key.slice(0, 4);
  if (iso === 'PL' && /^\d{5}$/.test(key)) key = `${key.slice(0, 2)}-${key.slice(2)}`;
  const minLength = MIN_LENGTH[iso] ?? 5;
  return key.replace('-', '').length >= minLength ? key : '';
};

export const loadArizonaPostalCodeCities = async (
  isoCode: string,
  postalCode: string,
  load: (url: string) => Promise<Record<string, string>> = (url) =>
    fetch(url).then((response) => (response.ok ? response.json() : {})),
): Promise<string[]> => {
  const iso = (isoCode || '').toUpperCase();
  if (!ARIZONA_POSTAL_CODE_COUNTRIES.includes(iso)) return [];
  const key = normalizeArizonaPostalCode(iso, postalCode || '');
  if (!key) return [];
  const url = `/_nuxt-plenty/plz/${iso}/${encodeURIComponent(key.slice(0, 2))}.json`;
  if (!files.has(url))
    files.set(
      url,
      load(url).catch(() => ({})),
    );
  const file = await files.get(url)!;
  return file[key] ? file[key].split('|') : [];
};
