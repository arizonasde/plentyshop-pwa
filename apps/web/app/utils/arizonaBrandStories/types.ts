/** Arizona: longer brand portrait on a brand page (see index.ts). */
export type ArizonaBrandStory = {
  /** One-line claim in the dark header */
  claim: string;
  facts: { value: string; label: string }[];
  sections: { title: string; paragraphs: string[] }[];
  seriesTitle: string;
  seriesIntro: string;
  seriesGroups: { title: string; text: string; series: { name: string; models: string; text: string }[] }[];
  /** Shown instead of the empty product grid while no item of the brand is available yet */
  comingSoon: string;
  footnote: string;
};
