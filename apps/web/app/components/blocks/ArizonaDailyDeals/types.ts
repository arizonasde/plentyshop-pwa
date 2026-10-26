export type ArizonaDailyDealsProps = {
  name: string;
  type: string;
  content: {
    title?: string;
    text?: string;
    /** Number of deal cards (default 3) */
    maxItems?: number;
  };
  configuration?: object;
  index?: number;
};
