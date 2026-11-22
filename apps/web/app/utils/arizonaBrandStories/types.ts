/** Arizona: an image on a brand page, served from public/_nuxt-plenty/images/marken/<slug>/ */
export type ArizonaBrandImage = { src: string; width: number; height: number; alt: string };

/** Arizona: longer brand portrait on a brand page (see index.ts). */
export type ArizonaBrandStory = {
  /** One-line claim in the dark header */
  claim: string;
  facts: { value: string; label: string }[];
  /** Optional photo header (landscape photo: on top on phones, on the right from md) instead of the plain dark header */
  hero?: {
    eyebrow: string;
    title: string;
    desktop: ArizonaBrandImage;
    badges: { label: string; icon: 'trident' | 'swiss' }[];
  };
  /** Optional large image-and-text blocks right below the header (what the brand stands for) */
  pillars?: {
    id: string;
    icon: 'trident' | 'swiss';
    kicker: string;
    title: string;
    paragraphs: string[];
    points: string[];
    image: ArizonaBrandImage;
  }[];
  /** Optional dark band about the brand's signature technology */
  feature?: { kicker: string; title: string; paragraphs: string[]; image: ArizonaBrandImage };
  sections: { title: string; paragraphs: string[] }[];
  seriesTitle: string;
  seriesIntro: string;
  seriesGroups: { title: string; text: string; series: { name: string; models: string; text: string }[] }[];
  /** Shown instead of the empty product grid while no item of the brand is available yet */
  comingSoon: string;
  footnote: string;
};
