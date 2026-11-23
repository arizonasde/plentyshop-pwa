/**
 * Arizona: content of the German home page (components/ArizonaHomepage). The page is built in code since 23.11.2026;
 * other languages and the shop editor still show the editor blocks. Images live on the plentyONE CDN
 * (frontend/arizona-startseite), the same files the editor blocks used before.
 */
const CDN = 'https://cdn02.plentyone.com/f05ilw2rfpls';

export const ARIZONA_HOME_SLIDES = [
  {
    pill: 'Faera · Mützen',
    title: 'Warm eingepackt\nin den Winter',
    text: 'Strickmützen mit Bommel, Smiley oder Fleecefutter – in Farben, die gute Laune machen.',
    link: '/damenmode/accessoires/kopfbedeckungen/muetzen',
    cta: 'Mützen entdecken',
    image: {
      desktop: `${CDN}/frontend/arizona-startseite/arizona-slider-faera-muetzen-1400.webp`,
      mobile: `${CDN}/frontend/arizona-startseite/arizona-slider-faera-muetzen-800.webp`,
      alt: 'Frau mit brauner Faera Strickmütze mit Smiley auf einer Holzbank vor einem Café, daneben eine rosa Bommelmütze und eine bordeauxrote Mütze mit Herz',
    },
    products: [
      {
        alt: 'Faera Strickmütze mit Rippbündchen',
        image: `${CDN}/item/images/9405/middle/-14-0.jpg`,
        link: '/damenmode/accessoires/kopfbedeckungen/muetzen/gemusterte-strickmuetze-mit-rippbuendchen-dezenter-stickerei_9405_224538',
      },
      {
        alt: 'Faera Strickmütze mit Smiley',
        image: `${CDN}/item/images/9411/middle/11-0.jpg`,
        link: '/damenmode/accessoires/kopfbedeckungen/muetzen/strickmuetze-mit-smiley-stickerei_9411_225898',
      },
      {
        alt: 'Faera Beanie mit Bommel in Rosa',
        image: `${CDN}/item/images/8136/middle/Rosa--1-.jpg`,
        link: '/damenmode/accessoires/kopfbedeckungen/muetzen/warme-beanie-strickmuetze-mit-fleece-innenfutter-und-bommel_8136_203287',
      },
    ],
  },
  {
    pill: 'Faera · Schals',
    title: 'Karo, Print\nund ganz viel Kuschel',
    text: 'Karoschals mit Fransen, Dreieckstücher und weiche Colorblock-Schals für jeden Mantel.',
    link: '/damenmode/accessoires/schals',
    cta: 'Schals entdecken',
    image: {
      desktop: `${CDN}/frontend/arizona-startseite/arizona-slider-faera-schals-1400.webp`,
      mobile: `${CDN}/frontend/arizona-startseite/arizona-slider-faera-schals-800.webp`,
      alt: 'Frau mit Faera Karoschal in Rosa und Grau und weißer Strickmütze in einer hellen Boutique, daneben Karoschals in weiteren Farben',
    },
    products: [
      {
        alt: 'Faera Colorblock-Schal',
        image: `${CDN}/item/images/9429/middle/6-0.jpg`,
        link: '/damenmode/accessoires/schals/schal-colorblock-modern-warm-mehrfarbig_9429_224768',
      },
      {
        alt: 'Faera Dreieckstuch mit Animalprint',
        image: `${CDN}/item/images/10020/middle/810405-305.jpg`,
        link: '/damenmode/accessoires/schals/damen-schal-animalprint-dreieckstuch_10020_237516',
      },
      {
        alt: 'Faera Schal im Kaschmir-Look',
        image: `${CDN}/item/images/9408/middle/600-00.jpg`,
        link: '/damenmode/accessoires/schals/trendiger-kaschmir-schal-warmes-herbstaccessoire_9408_224510',
      },
    ],
  },
];

const jacket = (name: string) => ({
  desktop: `${CDN}/frontend/arizona-startseite/arizona-jacken-sport-${name}-600.webp`,
  mobile: `${CDN}/frontend/arizona-startseite/arizona-jacken-sport-${name}-400.webp`,
});

/** Season story: winter jackets, the four editor tiles from before */
export const ARIZONA_HOME_JACKETS = [
  {
    label: 'Teddyjacke · Damen',
    alt: 'Sublevel Teddyjacke mit Kapuze in Creme – Damen',
    link: '/damenmode/jacken/winterjacken/teddyjacke-mit-knopfverschluss-langarm_9977',
    ...jacket('damen-1'),
  },
  {
    label: 'Steppjacke · Herren',
    alt: 'Sublevel Steppjacke mit Kapuze in Schwarz – Herren',
    link: '/herrenmode/jacken-maentel/jacken/winterjacke-mit-kapuze-warm-gefuettert_9985',
    ...jacket('herren-1'),
  },
  {
    label: 'Winterjacke · Damen',
    alt: 'Sublevel Winterjacke mit Stehkragen in Schwarz – Damen',
    link: '/damenmode/jacken/winterjacken/warme-winterjacke-stehkragen-und-reissverschluss_9978',
    ...jacket('damen-2'),
  },
  {
    label: 'Outdoorjacke · Herren',
    alt: 'Sublevel wattierte Outdoorjacke mit Kapuze in Grün – Herren',
    link: '/herrenmode/jacken-maentel/jacken/wattierte-outdoorjacke-mit-kapuze-und-mehreren-taschen_9280',
    ...jacket('herren-2'),
  },
];

/** Fallback list for "Gerade besonders beliebt" while beliebt.json is empty or missing */
export const ARIZONA_HOME_POPULAR_FALLBACK =
  '222401,236966,203452,237105,210639,238567,237565,224538,224746,237335,236997,222990';

/** "Neu eingetroffen" tabs: main category id and link */
export const ARIZONA_HOME_NEW_IN = [
  { key: 'damen', label: 'Damen', categoryId: '44', link: '/damenmode' },
  { key: 'herren', label: 'Herren', categoryId: '16', link: '/herrenmode' },
] as const;
