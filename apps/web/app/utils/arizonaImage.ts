const ITEM_MIDDLE_IMAGE = /^(.+\/item\/images\/\d+\/)middle(\/[^/]+)$/;

/**
 * Arizona: srcset for a plentyONE item image of the size "middle" (about 485x700) that adds the "preview" size
 * (about 138x200) of the same image. Small tiles such as the products in the home page slider then load the
 * preview image instead of the much larger middle image. Returns undefined for all other URLs.
 */
export const getArizonaItemImageSrcset = (url: string): string | undefined => {
  const match = url.match(ITEM_MIDDLE_IMAGE);
  if (!match) return undefined;
  return `${match[1]}preview${match[2]} 138w, ${url} 485w`;
};
