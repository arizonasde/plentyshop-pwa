/**
 * Arizona: content of the German home page (components/ArizonaHomepage). The page is built in code since 11/2026;
 * other languages and the shop editor still show the editor blocks. Images live on the plentyONE CDN.
 */
const CDN = 'https://cdn02.plentyone.com/f05ilw2rfpls';
const item = (path: string) => `${CDN}/item/images/${path}`;
const stage = (name: string) => `${CDN}/frontend/arizona-startseite/${name}`;

/** Big stage tile, crossfading */
export const ARIZONA_HOME_SLIDES = [
  {
    kicker: 'Faera · Mützen',
    title: 'Winter\nMood',
    link: '/damenmode/accessoires/kopfbedeckungen/muetzen',
    cta: 'Mützen shoppen',
    image: {
      desktop: stage('arizona-slider-faera-muetzen-1400.webp'),
      mobile: stage('arizona-slider-faera-muetzen-800.webp'),
      alt: 'Frau mit brauner Faera Strickmütze mit Smiley auf einer Holzbank vor einem Café, daneben eine rosa Bommelmütze und eine bordeauxrote Mütze mit Herz',
    },
  },
  {
    kicker: 'Faera · Schals',
    title: 'Wrap\nit up',
    link: '/damenmode/accessoires/schals',
    cta: 'Schals shoppen',
    image: {
      desktop: stage('arizona-slider-faera-schals-1400.webp'),
      mobile: stage('arizona-slider-faera-schals-800.webp'),
      alt: 'Frau mit Faera Karoschal in Rosa und Grau und weißer Strickmütze in einer hellen Boutique, daneben Karoschals in weiteren Farben',
    },
  },
];

/** The two worlds next to the stage, with a cut-out product on a colour block */
export const ARIZONA_HOME_WORLDS = [
  {
    title: 'Damen',
    link: '/damenmode',
    color: '#FFE45C',
    image: item('8639/middle/D10608BC02644C-10200-V-3x4.jpg'),
    alt: 'Hoodie für Damen',
  },
  {
    title: 'Herren',
    link: '/herrenmode',
    color: '#B8F2D0',
    image: item('9280/middle/H50022AB44549A1-12400-V.jpg'),
    alt: 'Grüne Steppjacke für Herren',
  },
];

/** Category tiles: colour block + cut-out product (white backgrounds disappear via mix-blend-mode) */
export const ARIZONA_HOME_CATEGORIES = [
  { title: 'Winterjacken', sub: 'Damen', link: '/damenmode/jacken/winterjacken', color: '#D9CCFF', image: item('10065/middle/schearzfinalfront.jpg') },
  { title: 'Hoodies', sub: 'Damen', link: '/damenmode/shirts/hoodies', color: '#FFC8DD', image: item('8639/middle/D10608BC02644C-10200-V-3x4.jpg') },
  { title: 'Strick', sub: 'Damen', link: '/damenmode/shirts/strickpullover', color: '#FFD6C2', image: item('9241/middle/SELECTED-FEM-Springsummer-4793175-16097300.jpg') },
  { title: 'Jeans', sub: 'Damen', link: '/damenmode/jeans', color: '#CFE3FF', image: item('3681/middle/on--3268112--front.jpg') },
  { title: 'Kleider', sub: 'Damen', link: '/damenmode/kleider', color: '#FFF0A8', image: item('6917/middle/froo-3x4-3x4.jpg') },
  { title: 'Mützen', sub: 'Accessoires', link: '/damenmode/accessoires/kopfbedeckungen/muetzen', color: '#C6F0D8', image: item('8137/middle/Blau--1-.jpg') },
  { title: 'Jacken', sub: 'Herren', link: '/herrenmode/jacken-maentel', color: '#B8F2D0', image: item('9280/middle/H50022AB44549A1-12400-V.jpg') },
  { title: 'Hoodies', sub: 'Herren', link: '/herrenmode/oberteile/hoodies', color: '#E4E4E4', image: item('9374/middle/H10608BC21525A4NO-24000-V.jpg') },
  { title: 'Pullover', sub: 'Herren', link: '/herrenmode/oberteile/pullover', color: '#CFE3FF', image: item('9267/middle/50033-3x4-4-3x4.jpg') },
  { title: 'Jeans', sub: 'Herren', link: '/herrenmode/jeans', color: '#D9CCFF', image: item('5970/middle/JACKundJONES-Noos2023-2703036-12133074.jpg') },
  { title: 'Kinder', sub: 'Mode', link: '/kindermode', color: '#FFD6C2', image: item('9254/middle/braun2mainn.jpg') },
];

const jacket = (name: string) => ({
  desktop: stage(`arizona-jacken-sport-${name}-600.webp`),
  mobile: stage(`arizona-jacken-sport-${name}-400.webp`),
});

/** Season bento: winter jackets */
export const ARIZONA_HOME_JACKETS = [
  {
    label: 'Teddyjacke',
    alt: 'Sublevel Teddyjacke mit Kapuze in Creme – Damen',
    link: '/damenmode/jacken/winterjacken/teddyjacke-mit-knopfverschluss-langarm_9977',
    ...jacket('damen-1'),
  },
  {
    label: 'Steppjacke',
    alt: 'Sublevel Steppjacke mit Kapuze in Schwarz – Herren',
    link: '/herrenmode/jacken-maentel/jacken/winterjacke-mit-kapuze-warm-gefuettert_9985',
    ...jacket('herren-1'),
  },
  {
    label: 'Winterjacke',
    alt: 'Sublevel Winterjacke mit Stehkragen in Schwarz – Damen',
    link: '/damenmode/jacken/winterjacken/warme-winterjacke-stehkragen-und-reissverschluss_9978',
    ...jacket('damen-2'),
  },
  {
    label: 'Outdoorjacke',
    alt: 'Sublevel wattierte Outdoorjacke mit Kapuze in Grün – Herren',
    link: '/herrenmode/jacken-maentel/jacken/wattierte-outdoorjacke-mit-kapuze-und-mehreren-taschen_9280',
    ...jacket('herren-2'),
  },
];

/** Fallback list for "Gerade beliebt" while beliebt.json is empty or missing */
export const ARIZONA_HOME_POPULAR_FALLBACK =
  '222401,236966,203452,237105,210639,238567,237565,224538,224746,237335,236997,222990';

export const ARIZONA_HOME_TICKER = [
  'Gratis-Versand ab 99 €',
  'Lieferung in 1–3 Werktagen',
  '60 Tage kostenlose Rückgabe',
  'Kauf auf Rechnung',
  'PayPal · Klarna · Karte',
];
