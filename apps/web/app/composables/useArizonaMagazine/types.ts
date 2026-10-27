export type ArizonaMagazineSource = { name: string; titel: string; link: string; datum: string };

export type ArizonaMagazinePost = {
  slug: string;
  art: 'News' | 'Tipp';
  thema: string;
  datum: string;
  headline: string;
  titel: string;
  text: string;
  quelle: ArizonaMagazineSource | null;
  bild: string;
  kachel: string;
  kategorie: string;
  produkte: { itemId: number; variationId: number }[];
};

export type ArizonaMagazineShort = { titel: string; link: string; quelle: string; datum: string };

export type ArizonaMagazine = { stand: string; beitraege: ArizonaMagazinePost[]; kurz: ArizonaMagazineShort[] };
