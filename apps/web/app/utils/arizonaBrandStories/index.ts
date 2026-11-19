/**
 * Arizona: longer brand portraits for brand pages (/marken/<slug>) that get more than the short intro – history,
 * technology and the series we carry. Written in our own words from the manufacturer's website
 * (Luminox: de.luminox.com, pages „Geschichte“, „Luminox Light Technology“, „Technologie“, „Serie“; as of 19.11.2026).
 */
import type { ArizonaBrandStory } from './types';

const LUMINOX: ArizonaBrandStory = {
  claim: 'Uhren, die im Dunkeln leuchten – immer. Seit 1989.',
  facts: [
    { value: '1989', label: 'gegründet' },
    { value: 'bis 25 Jahre', label: 'Leuchtdauer ohne Aufladen*' },
    { value: 'seit 1992', label: 'Uhren für die U.S. Navy SEALs' },
    { value: 'Swiss Made', label: 'nach dem Gesetz von 2017' },
  ],
  sections: [
    {
      title: 'Vom Auftrag der Navy SEALs zur Kultmarke',
      paragraphs: [
        'Luminox wurde 1989 mit einem klaren Ziel gegründet: Sportuhren zu bauen, die man bei jedem Licht sofort ablesen kann. Den Durchbruch brachte 1992 eine Uhr, die Gründer Barry Cohen gemeinsam mit Nick North für die U.S. Navy SEALs entwickelte – für Einsätze bei Nacht und unter Wasser, bei denen jede Sekunde zählt. Wenig später trugen auch die US-Küstenwache, Polizei- und Spezialeinheiten anderer Länder Luminox. Seit 2016 ist die Zusammenarbeit mit den Navy SEALs offiziell lizenziert.',
        'Später kamen Lizenzmodelle mit Lockheed Martin dazu – etwa zur F-117 Nighthawk und zur P-38 Lightning –, außerdem Partnerschaften mit dem Abenteurer Bear Grylls und der isländischen Rettungsorganisation ICE-SAR. Seit 2020 gehört Luminox zur Schweizer Mondaine Group; alle Modelle erfüllen das 2017 verschärfte Swiss-Made-Gesetz.',
      ],
    },
    {
      title: 'Luminox Light Technology: Leuchten ohne Aufladen',
      paragraphs: [
        'Normale Leuchtfarbe muss erst Licht tanken und verblasst nach einigen Stunden. Luminox setzt stattdessen winzige, gasgefüllte Glasröhrchen (Tritium) ein, die aus sich selbst heraus leuchten – ohne Batterie, ohne Knopfdruck und ohne vorher Licht abzubekommen. Jedes Röhrchen wird von Hand auf Zeiger, Stundenmarken und je nach Modell auf die Lünette gesetzt.',
        'Nach Angaben von Luminox leuchten die Röhrchen bis zu 25 Jahre; zehn Jahre Leuchtkraft garantiert der Hersteller. Die Farben sind bewusst gewählt: Grün und Orange erkennt das Auge im Dunkeln am besten, deshalb kombinieren viele Modelle beide.',
      ],
    },
    {
      title: 'Gebaut für harte Einsätze',
      paragraphs: [
        'Viele Gehäuse bestehen aus CARBONOX, einem Kohlenstoff-Verbundmaterial, das laut Luminox deutlich leichter ist als Stahl und Titan. Die Weiterentwicklung CARBONOX+ enthält zusätzlich Kohlenstofffasern und ist noch fester. Daneben gibt es Modelle aus Edelstahl, einseitig drehbare Taucherlünetten, Chronographen und Automatikwerke – wasserdicht je nach Modell bis 300 Meter.',
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
  footnote: '* Angabe des Herstellers. Quelle für Geschichte und Technik: de.luminox.com.',
  comingSoon:
    'Die Luminox-Kollektion kommt in Kürze zu Arizona Shopping: 64 Modelle aus 25 Serien. Merk dir diese Seite – die Uhren erscheinen hier, sobald sie lieferbar sind.',
};

export const ARIZONA_BRAND_STORIES: Record<string, ArizonaBrandStory> = { luminox: LUMINOX };
