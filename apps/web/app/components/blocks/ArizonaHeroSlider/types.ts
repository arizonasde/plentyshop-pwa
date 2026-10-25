export type ArizonaHeroSliderProduct = {
  image: string;
  alt: string;
  link: string;
};

export type ArizonaHeroSliderSlide = {
  /** Small white pill, e.g. "AUS UNSEREN BELIEBTEN MARKEN" */
  pill: string;
  /** Upper-case line above the title, e.g. "ENTDECKE DIE KOLLEKTION" */
  eyebrow: string;
  title: string;
  link: string;
  image: { desktop: string; mobile: string; alt: string };
  products: ArizonaHeroSliderProduct[];
};

export type ArizonaHeroSliderProps = {
  name: string;
  type: string;
  content: {
    slides: ArizonaHeroSliderSlide[];
    /** Milliseconds between automatic slide changes */
    interval?: number;
  };
  configuration?: object;
  index?: number;
};
