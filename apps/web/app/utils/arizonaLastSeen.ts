/**
 * Arizona: recently viewed variations, kept in the visitor's browser (most recent first). The plentyONE list needs
 * a session cookie of the shop domain and stays empty without it, so the slider "Zuletzt angesehen" uses this list.
 */
const STORAGE_KEY = 'arizonaLastSeen';
const MAX_ENTRIES = 20;

export const readArizonaLastSeen = (): number[] => {
  if (!import.meta.client) return [];
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(ids) ? ids.map(Number).filter((id) => id > 0) : [];
  } catch {
    return [];
  }
};

export const addArizonaLastSeen = (variationId: number) => {
  if (!import.meta.client || !variationId) return;
  try {
    const ids = [variationId, ...readArizonaLastSeen().filter((id) => id !== variationId)].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked (e.g. private mode) – the slider then simply stays hidden
  }
};
