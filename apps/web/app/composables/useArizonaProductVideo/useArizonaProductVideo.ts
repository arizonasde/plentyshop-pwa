/**
 * Arizona: KI-Produktvideos aus der Datei, die produktvideo_index.py in den Webspace legt
 * ({ variationen: { "<variationId>": { video, poster } } }). Ohne Datei oder ohne Eintrag bleibt alles unsichtbar.
 */
const INDEX_URL = 'https://cdn02.plentyone.com/f05ilw2rfpls/frontend/produktvideos/index.json';

type VideoEntry = { video: string; poster?: string };

export const useArizonaProductVideo = () => {
  const index = useState<Record<string, VideoEntry> | null>('arizonaProductVideos', () => null);
  const loaded = useState('arizonaProductVideosLoaded', () => false);

  const load = async () => {
    if (!import.meta.client || loaded.value) return;
    loaded.value = true;
    try {
      const data = await $fetch<{ variationen?: Record<string, VideoEntry> }>(INDEX_URL, {
        query: { v: Math.floor(Date.now() / 600_000) },
      });
      index.value = data?.variationen ?? {};
    } catch {
      index.value = {};
    }
  };

  const videoFor = (variationId: number | string | undefined | null) =>
    variationId != null ? (index.value?.[String(variationId)] ?? null) : null;

  return { load, videoFor };
};
