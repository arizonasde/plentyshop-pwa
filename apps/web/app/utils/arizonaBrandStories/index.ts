/**
 * Arizona: longer brand portraits for brand pages (/marken/<slug>) that get more than the short intro – history,
 * technology and the series we carry. Written in our own words from the manufacturer's website
 * (Luminox: de.luminox.com, pages „Geschichte“, „Luminox Light Technology“, „Technologie“, „Serie“; as of 19.11.2026).
 */
import type { ArizonaBrandStory } from './types';

const IMG = '/_nuxt-plenty/images/marken/luminox';

const LUMINOX: ArizonaBrandStory = {
  claim: 'Entwickelt für die Navy SEALs. Gebaut in der Schweiz.',
  hero: {
    eyebrow: 'Navy SEALs · Swiss Made · seit 1989',
    title: 'Luminox',
    desktop: {
      src: `${IMG}/seil-quer-1400.webp`,
      width: 1398,
      height: 933,
      alt: 'Mann klettert am Seil, am Handgelenk die Luminox Navy SEAL Chronograph 3590',
    },
    badges: [
      { label: 'Seit 1992 für die U.S. Navy SEALs', icon: 'trident' },
      { label: 'Swiss Made', icon: 'swiss' },
    ],
  },
  facts: [
    { value: '1992', label: 'erste Uhr für die Navy SEALs' },
    { value: 'seit 2016', label: 'offizieller Lizenzpartner der Navy SEALs' },
    { value: 'Swiss Made', label: 'nach dem Gesetz von 2017' },
    { value: 'bis 25 Jahre', label: 'Leuchtdauer ohne Aufladen*' },
  ],
  pillars: [
    {
      id: 'navy-seals',
      icon: 'trident',
      kicker: 'U.S. Navy SEALs',
      title: 'Die Uhr der Navy SEALs',
      paragraphs: [
        'Anfang der 1990er suchten die U.S. Navy SEALs eine Uhr, die man bei Nachteinsätzen und unter Wasser jederzeit ablesen kann – ohne Knopfdruck und ohne Licht, das den Träger verrät. Gründer Barry Cohen entwickelte sie 1992 gemeinsam mit Nick North für die Spezialeinheit. Aus diesem Auftrag wurde die Navy SEAL Serie, mit der Luminox bekannt wurde.',
        'Seit 2016 ist Luminox offizieller Lizenzpartner der Navy SEALs. Auf dem Gehäuseboden vieler Navy-SEAL-Modelle sitzt das Abzeichen der Einheit mit Adler und Dreizack. Mit den NSF-Sondermodellen unterstützt Luminox außerdem die Navy SEAL Foundation, die sich um SEALs und ihre Familien kümmert.',
      ],
      points: [
        'Leicht, robust und bei jedem Licht ablesbar',
        'Wasserdicht je nach Modell bis 300 Meter',
        'Auch von Küstenwache, Polizei- und Spezialeinheiten getragen',
      ],
      image: {
        src: `${IMG}/dreizack-800.webp`,
        width: 800,
        height: 800,
        alt: 'Gehäuseboden einer Luminox Navy SEAL Uhr mit eingraviertem Navy-SEAL-Abzeichen',
      },
    },
    {
      id: 'swiss-made',
      icon: 'swiss',
      kicker: 'Swiss Made',
      title: 'Schweizer Uhrmacherei – nach strengen Regeln',
      paragraphs: [
        'Jede Luminox trägt „Swiss Made“ auf dem Zifferblatt. Seit 2017 ist das in der Schweiz streng geregelt: Mindestens 60 Prozent der Herstellungskosten müssen in der Schweiz anfallen, die technische Entwicklung und die Endkontrolle finden dort statt, und das Uhrwerk selbst muss schweizerisch sein.',
        'Seit 2020 gehört Luminox zur Schweizer Mondaine Group, die auch die offizielle Schweizer Bahnhofsuhr baut. Viele Modelle laufen mit Schweizer Quarzwerken, einige mit Schweizer Automatikwerken.',
      ],
      points: [
        'Schweizer Uhrwerke, Quarz oder Automatik',
        'Gehäuse aus CARBONOX, CARBONOX+ oder Edelstahl',
        'Handgesetzte Leuchtröhrchen auf Zeigern und Indizes',
      ],
      image: {
        src: `${IMG}/swiss-made-900.webp`,
        width: 900,
        height: 900,
        alt: 'Nahaufnahme des Zifferblatts der Luminox Navy SEAL Chronograph 3590 mit dem Schriftzug Swiss Made',
      },
    },
  ],
  feature: {
    kicker: 'Luminox Light Technology',
    title: 'Always visible: Leuchten ohne Aufladen',
    paragraphs: [
      'Normale Leuchtfarbe muss erst Licht tanken und verblasst nach einigen Stunden. Luminox setzt stattdessen winzige gasgefüllte Glasröhrchen (Tritium) ein, die von selbst leuchten – ohne Batterie, ohne Knopfdruck und ohne vorher Licht abzubekommen.',
      'Nach Angaben von Luminox leuchten die Röhrchen bis zu 25 Jahre. Grün und Orange erkennt das Auge im Dunkeln am besten, deshalb kombinieren viele Modelle beide Farben.',
    ],
    image: {
      src: `${IMG}/leuchten-900.webp`,
      width: 900,
      height: 900,
      alt: 'Luminox Navy SEAL Chronograph XS.3587 im Dunkeln mit grün und orange leuchtenden Zeigern und Indizes',
    },
  },
  sections: [
    {
      title: 'Gebaut für harte Einsätze',
      paragraphs: [
        'Viele Gehäuse bestehen aus CARBONOX, einem Kohlenstoff-Verbundmaterial, das laut Luminox deutlich leichter ist als Stahl und Titan. Die Weiterentwicklung CARBONOX+ enthält zusätzlich Kohlenstofffasern und ist noch fester. Daneben gibt es Modelle aus Edelstahl, einseitig drehbare Taucherlünetten, Chronographen und Automatikwerke.',
      ],
    },
    {
      title: 'Wasser, Luft und Land',
      paragraphs: [
        'Auf die Navy SEALs folgten weitere Partner: Lizenzmodelle mit Lockheed Martin, etwa zur P-38 Lightning, Uhren mit dem Abenteurer Bear Grylls und mit der isländischen Rettungsorganisation ICE-SAR.',
      ],
    },
  ],
  seriesTitle: 'Die Luminox-Serien bei Arizona Shopping',
  seriesIntro:
    'Luminox ordnet seine Uhren nach Einsatzgebiet: Wasser, Luft und Land. Diese Serien führen wir – insgesamt 64 Modelle in 25 Serien.',
  seriesGroups: [
    {
      title: 'Wasser',
      text: 'Taucher- und Wassersportuhren mit drehbarer Lünette',
      series: [
        {
          name: 'Navy SEAL',
          models: '3000, 3000 EVO, 3500, 3600, 4230, Steel 3250, Chronograph 3580, Foundation 3200',
          text: 'Die Uhr, mit der alles begann: leicht, robust und gut ablesbar – heute vom Klassiker bis zum Chronographen.',
        },
        {
          name: 'Master Carbon SEAL Automatic',
          models: '3860',
          text: 'Die Navy-SEAL-Idee mit Automatikwerk und Gehäuse aus CARBONOX+.',
        },
        {
          name: 'Pacific Diver',
          models: '3120, 3120M, Chrono 3140, Automatic 3100, Heritage 3100H',
          text: 'Taucheruhr im Edelstahlgehäuse – mit Quarzwerk, als Chronograph oder mit Automatik.',
        },
        {
          name: 'Leatherback SEA Turtle',
          models: '0300, Giant 0320',
          text: 'Leichte Uhr für Alltag und Wassersport, benannt nach der Lederschildkröte.',
        },
      ],
    },
    {
      title: 'Luft',
      text: 'Fliegeruhren, lizenziert von Lockheed Martin',
      series: [
        {
          name: 'P-38 Lightning GMT',
          models: '9520',
          text: 'Fliegeruhr mit zweiter Zeitzone (GMT), benannt nach dem legendären Jagdflugzeug.',
        },
      ],
    },
    {
      title: 'Land',
      text: 'Outdoor-, Field- und Survival-Uhren',
      series: [
        {
          name: 'Bear Grylls Survival',
          models: 'Land 3710, Master 3740',
          text: 'Gemeinsam mit dem Abenteurer Bear Grylls für Outdoor und Survival entwickelt.',
        },
        {
          name: 'ICE-SAR',
          models: '1080',
          text: 'Entstanden mit der isländischen Such- und Rettungsorganisation – für Kälte und lange Dunkelheit.',
        },
        {
          name: 'Atacama Field',
          models: '1960',
          text: 'Klassische Field-Uhr für Abenteuer an Land.',
        },
        {
          name: 'Dress Field',
          models: '2520',
          text: 'Die schlichtere Field-Uhr, die auch zum Hemd passt.',
        },
        {
          name: 'Mil-Spec',
          models: '3350',
          text: 'Angelehnt an die militärische Spezifikation MIL-PRF-46374G.',
        },
        {
          name: 'RECON NAV SPC',
          models: '8830',
          text: 'Aus der RECON-Linie, gemacht für die Orientierung im Gelände.',
        },
        {
          name: 'Sport Timer Automatic',
          models: '0920',
          text: 'Sportliche Automatikuhr aus der Sport-Timer-Linie.',
        },
      ],
    },
  ],
  footnote:
    '* Angabe des Herstellers. Quellen: de.luminox.com (Geschichte, Technik, Navy SEAL Foundation), Schweizer „Swiss made“-Verordnung für Uhren (SR 232.119). Bilder: Luminox.',
  comingSoon:
    'Die Luminox-Kollektion kommt in Kürze zu Arizona Shopping: 64 Modelle aus 25 Serien. Merk dir diese Seite – die Uhren erscheinen hier, sobald sie lieferbar sind.',
};

export const ARIZONA_BRAND_STORIES: Record<string, ArizonaBrandStory> = { luminox: LUMINOX };
