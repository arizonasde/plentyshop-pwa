/** Arizona: an image on a brand page, served from public/_nuxt-plenty/images/marken/<slug>/ */
export type ArizonaBrandImage = { src: string; width: number; height: number; alt: string };

/** Arizona: longer brand portrait on a brand page (see index.ts). */
export type ArizonaBrandStory = {
  /** One-line claim in the dark header */
  claim: string;
  facts: { value: string; label: string }[];
  /**
   * Optional showcase header with a day/night comparison of the same watch (two pixel-identical photos,
   * the night one shows the self-luminous tubes). Brands with a showcase get the ArizonaBrandShowcase layout.
   */
  showcase?: {
    eyebrow: string;
    text: string;
    day: ArizonaBrandImage;
    night: ArizonaBrandImage;
    /** Same photos in a smaller width for phones */
    daySmall: string;
    nightSmall: string;
    caption: string;
    badges: { label: string; icon: 'trident' | 'swiss' }[];
  };
  /** Optional photo band with a short timeline (the brand's origin story) */
  mission?: { kicker: string; title: string; image: ArizonaBrandImage; steps: { year: string; text: string }[] };
  /** Optional large image-and-text blocks (what the brand stands for) */
  pillars?: {
    id: string;
    icon: 'trident' | 'swiss';
    kicker: string;
    title: string;
    paragraphs: string[];
    points: string[];
    image: ArizonaBrandImage;
  }[];
  /**
   * Optional street layout (Carlo Colucci): huge condensed name, a look builder with real items, culture chapter and
   * the products as „Der Drop“. Brands with this block get the ArizonaBrandStreet layout.
   */
  street?: ArizonaBrandStreet;
  /** Heading above the products and the unit used in the counter, e.g. „Die Uhren“ / Modell, Modelle */
  productsTitle?: string;
  productsUnit?: [string, string];
  sections: { title: string; paragraphs: string[] }[];
  seriesTitle?: string;
  seriesIntro?: string;
  seriesGroups?: { title: string; text: string; series: { name: string; models: string; text: string }[] }[];
  /** Shown instead of the empty product grid while no item of the brand is available yet */
  comingSoon: string;
  footnote: string;
};

/** Arizona: street brand layout (see ArizonaBrandStreet) */
export type ArizonaBrandStreet = {
  tagline: string;
  /** Looks for the look builder; each links to a real item (path without locale) and its variation for the wishlist */
  looks: { name: string; text: string; combo: string; image: ArizonaBrandImage; url: string; variationId: number }[];
  ticker: string[];
  culture: { kicker: string; title: string; text: string; moments: { year: string; text: string }[] };
  gallery: [ArizonaBrandImage, ArizonaBrandImage];
};
