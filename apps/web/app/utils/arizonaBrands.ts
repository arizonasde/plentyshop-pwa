/**
 * Arizona: brands with their own landing page under /marken/<slug>.
 * `facetValueId` is the value of the brand filter ("Marke") in plentyONE; brands without that filter value (Faera) are
 * listed via `searchTerm` instead. Only brands with at least four items
 * in the shop are listed (as of 25.10.2026). The intros only state what is known about the brand or visible in
 * the assortment – no claims about materials, production or prices.
 */
export const ARIZONA_BRANDS: ({ slug: string; name: string; intro: string } & (
  | { facetValueId: number; searchTerm?: never }
  | { searchTerm: string; facetValueId?: never }
))[] = [
  {
    slug: 'sublevel',
    name: 'Sublevel',
    facetValueId: 50,
    intro:
      'Sublevel steht für lässige Alltagsmode für Damen und Herren: Hoodies, Teddy- und Winterjacken, Strick und bequeme Basics, die sich leicht kombinieren lassen.',
  },
  {
    slug: 'faera',
    name: 'Faera',
    searchTerm: 'Faera',
    intro:
      'Faera steht bei uns für Schals und Mützen für Damen: Dreieckstücher und Karoschals mit Fransen, leichte Tücher mit Print und gerippte Strickmützen – in vielen Farben.',
  },
  {
    slug: 'jack-and-jones',
    name: 'Jack & Jones',
    facetValueId: 91,
    intro:
      'Jack & Jones ist eine dänische Herrenmarke der Bestseller-Gruppe und bekannt für Jeans, Hemden, Sweatshirts und Jacken im lässigen Streetwear-Stil.',
  },
  {
    slug: 'name-it',
    name: 'Name It',
    facetValueId: 134,
    intro:
      'Name It ist die Kindermarke der dänischen Bestseller-Gruppe – farbenfrohe, alltagstaugliche Mode für Babys, Mädchen und Jungen.',
  },
  {
    slug: 'vila',
    name: 'Vila',
    facetValueId: 135,
    intro:
      'Vila ist eine dänische Damenmarke der Bestseller-Gruppe mit femininer, zeitloser Mode – von Blusen und Kleidern bis zu Strick und Mänteln.',
  },
  {
    slug: 'only-and-sons',
    name: 'Only & Sons',
    facetValueId: 123,
    intro:
      'Only & Sons ist die Herrenmarke von ONLY aus der dänischen Bestseller-Gruppe: Jeans, Chinos, Shirts und Jacken im modernen Casual-Look.',
  },
  {
    slug: 'blend',
    name: 'Blend',
    facetValueId: 128,
    intro: 'Blend ist eine dänische Herrenmarke mit Jeans, Sweatshirts, Hemden und Jacken für den entspannten Alltag.',
  },
  {
    slug: 'only',
    name: 'Only',
    facetValueId: 93,
    intro:
      'ONLY gehört zur dänischen Bestseller-Gruppe und ist bekannt für trendige Damenmode – besonders für Jeans, Strick, Kleider und Jacken.',
  },
  {
    slug: 'noisy-may',
    name: 'Noisy May',
    facetValueId: 102,
    intro:
      'Noisy May ist eine junge Damenmarke der dänischen Bestseller-Gruppe mit Jeans, Kleidern und Basics für einen lässigen, modernen Look.',
  },
  {
    slug: 'vero-moda',
    name: 'Vero Moda',
    facetValueId: 125,
    intro:
      'Vero Moda ist eine dänische Damenmarke der Bestseller-Gruppe – vielseitige Mode für Büro und Freizeit, von Blusen über Kleider bis zu Mänteln.',
  },
  {
    slug: 'jacqueline-de-yong',
    name: 'Jacqueline de Yong',
    facetValueId: 68,
    intro:
      'Jacqueline de Yong (JDY) gehört zur dänischen Bestseller-Gruppe und bietet unkomplizierte Damenmode mit gutem Preis-Leistungs-Verhältnis.',
  },
  {
    slug: 'casual-friday',
    name: 'Casual Friday',
    facetValueId: 132,
    intro: 'Casual Friday ist eine dänische Herrenmarke mit lässigen Hemden, Strick, Hosen und Jacken für Alltag und Wochenende.',
  },
  {
    slug: 'anely',
    name: 'Anely',
    facetValueId: 90,
    intro: 'Bei Anely findest du Schmuck und Accessoires wie Ketten, Ohrringe und Armbänder, die dein Outfit abrunden.',
  },
  {
    slug: 'tom-tailor',
    name: 'Tom Tailor',
    facetValueId: 136,
    intro:
      'Tom Tailor ist eine Modemarke aus Hamburg und steht für unkomplizierte Casual-Mode – bei uns vor allem Shirts, Hemden und Jeans.',
  },
  {
    slug: 'mavi',
    name: 'Mavi',
    facetValueId: 131,
    intro: 'Mavi ist eine Jeansmarke aus Istanbul und bekannt für gut sitzende Denims in vielen Passformen und Waschungen.',
  },
  {
    slug: 'arizonas',
    name: 'Arizonas',
    facetValueId: 56,
    intro: 'Unsere eigene Marke ARIZONAS: Hosen, Shirts und mehr für Damen und Herren zu besonders günstigen Preisen.',
  },
  {
    slug: 'only-carmakoma',
    name: 'Only Carmakoma',
    facetValueId: 120,
    intro:
      'Only Carmakoma ist die Curvy-Linie von ONLY aus der dänischen Bestseller-Gruppe – trendige Damenmode in großen Größen.',
  },
  {
    slug: 'selected-femme',
    name: 'Selected Femme',
    facetValueId: 104,
    intro:
      'Selected Femme gehört zur dänischen Bestseller-Gruppe und steht für klassisch-moderne Damenmode mit klaren Schnitten.',
  },
  {
    slug: 'urban-surface',
    name: 'Urban Surface',
    facetValueId: 75,
    intro: 'Urban Surface bietet lässige Mode wie Hemden, Shirts, Cargo-Hosen und Jeans-Shorts.',
  },
  {
    slug: 'max-men',
    name: 'Max Men',
    facetValueId: 81,
    intro: 'Max Men steht für sommerliche Herrenmode wie Shorts, Capri-Hosen und Poloshirts.',
  },
  {
    slug: 'hailys',
    name: 'HaILYS',
    facetValueId: 122,
    intro: 'HaILYS bietet junge Damenmode – von Shirts und Pullovern bis zu Strickkleidern.',
  },
  {
    slug: 'b-young',
    name: 'b.young',
    facetValueId: 138,
    intro: 'b.young ist eine dänische Damenmarke mit femininer, alltagstauglicher Mode für Büro und Freizeit.',
  },
  {
    slug: 'egomaxx',
    name: 'Egomaxx',
    facetValueId: 47,
    intro: 'Egomaxx bietet Jeans- und Cargo-Bermudas sowie bequeme Sweatshorts.',
  },
  {
    slug: 'forbest',
    name: 'Forbest',
    facetValueId: 54,
    intro: 'Forbest bietet bequeme Sport- und Cargo-Shorts zu günstigen Preisen.',
  },
  {
    slug: 'mamalicious',
    name: 'Mamalicious',
    facetValueId: 59,
    intro:
      'Mamalicious ist die Umstandsmode-Marke der dänischen Bestseller-Gruppe – bequeme, moderne Kleidung für die Schwangerschaft.',
  },
  {
    slug: 'stitch-and-soul',
    name: 'Stitch & Soul',
    facetValueId: 80,
    intro: 'Stitch & Soul bietet bequeme Damenmode wie gerippte Leggings und Bermuda-Shorts.',
  },
  {
    slug: 'enflame',
    name: 'Enflame',
    facetValueId: 101,
    intro: 'Enflame steht für Freizeitmode wie Jogginganzüge und Jeans sowie Accessoires.',
  },
  {
    slug: 'solid',
    name: '!Solid',
    facetValueId: 126,
    intro: '!Solid ist eine dänische Herrenmarke – bei uns vor allem mit Slim-Fit-Jeans und Chinos.',
  },
  {
    slug: 'nina-carter',
    name: 'Nina Carter',
    facetValueId: 71,
    intro: 'Nina Carter bietet Damen-Jeans wie Jeans-Shorts und Capri-Jeans.',
  },
  {
    slug: 'only-play',
    name: 'Only Play',
    facetValueId: 133,
    intro: 'Only Play ist die Sportlinie von ONLY aus der dänischen Bestseller-Gruppe – Sportbekleidung für Training und Freizeit.',
  },
];

export const findArizonaBrand = (slug: string) => ARIZONA_BRANDS.find((brand) => brand.slug === slug);

/** Brand page of a brand name as shown in the shop (e.g. "NOISY MAY" → /marken/noisy-may), if there is one. */
export const findArizonaBrandByName = (name: string) => {
  const normalized = formatBrandName(name).toLowerCase();
  return ARIZONA_BRANDS.find((brand) => brand.name.toLowerCase() === normalized);
};
