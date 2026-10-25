<template>
  <NarrowContainer class="px-4 py-6 @md:py-10">
    <h1 class="font-bold typography-headline-3 @md:typography-headline-2 mb-2">Service &amp; Hilfe</h1>
    <p class="text-neutral-600 mb-8">Die wichtigsten Antworten rund um Bestellung, Versand, Rückgabe und Zahlung.</p>

    <section v-for="group in faqGroups" :id="group.id" :key="group.id" class="mb-8 scroll-mt-24">
      <h2 class="font-semibold typography-headline-5 @md:typography-headline-4 mb-3">{{ group.title }}</h2>
      <details
        v-for="item in group.items"
        :key="item.question"
        class="group border-b border-neutral-200 py-3"
        data-testid="service-faq-item"
      >
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
          {{ item.question }}
          <SfIconExpandMore class="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <p class="mt-2 text-neutral-700">
          {{ item.answer }}
          <NuxtLink v-if="item.link" :to="localePath(item.link.to)" class="underline underline-offset-2">
            {{ item.link.label }}
          </NuxtLink>
        </p>
      </details>
    </section>

    <p class="text-neutral-700">
      Noch Fragen? Schreib uns über das
      <NuxtLink :to="localePath(paths.contact)" class="underline underline-offset-2">Kontaktformular</NuxtLink>.
    </p>
  </NarrowContainer>
</template>

<script setup lang="ts">
import { SfIconExpandMore } from '@storefront-ui/vue';

/**
 * Arizona: service and FAQ page. The answers mirror the shop's actual terms (DHL 4.90 EUR within Germany,
 * 1–3 working days, 60 days return, PayPal / SEPA / giropay) and are also published as FAQPage structured data.
 */
definePageMeta({
  pageType: 'static',
});

const localePath = useLocalizedPath();

const faqGroups = [
  {
    id: 'versand',
    title: 'Versand & Lieferung',
    items: [
      {
        question: 'Was kostet der Versand?',
        answer: 'Wir versenden mit DHL. Der Versand kostet 4,90 € pro Bestellung innerhalb Deutschlands.',
      },
      {
        question: 'Wie lange dauert die Lieferung?',
        answer: 'In der Regel ist deine Bestellung in 1–3 Werktagen bei dir.',
      },
      {
        question: 'Liefert ihr auch ins Ausland?',
        answer: 'Nein, wir liefern derzeit nur an Adressen in Deutschland.',
      },
    ],
  },
  {
    id: 'ruecksendung',
    title: 'Rückgabe & Widerruf',
    items: [
      {
        question: 'Wie lange kann ich Artikel zurückgeben?',
        answer: 'Du hast 60 Tage Zeit, Artikel an uns zurückzuschicken. Die Rücksendung ist für dich kostenlos.',
      },
      {
        question: 'Wie widerrufe ich meine Bestellung?',
        answer: 'Am einfachsten über unser Online-Formular:',
        link: { to: paths.cancellationForm, label: 'Vertrag widerrufen' },
      },
      {
        question: 'Wo finde ich die Widerrufsbelehrung?',
        answer: 'Alle Details stehen in unserer Widerrufsbelehrung:',
        link: { to: paths.cancellationRights, label: 'Widerrufsrecht' },
      },
    ],
  },
  {
    id: 'zahlung',
    title: 'Bezahlen',
    items: [
      {
        question: 'Welche Zahlungsarten gibt es?',
        answer: 'Du kannst mit PayPal, per SEPA-Lastschrift oder mit giropay bezahlen.',
      },
      {
        question: 'Brauche ich ein Kundenkonto?',
        answer: 'Nein, du kannst auch ohne Anmeldung als Gast bestellen.',
      },
    ],
  },
  {
    id: 'groessen',
    title: 'Größen & Passform',
    items: [
      {
        question: 'Welche Größe passt mir?',
        answer:
          'Auf jeder Artikelseite findest du die verfügbaren Größen und Angaben zur Passform. Bist du unsicher, hilft dir unser Kundenservice gern weiter.',
        link: { to: paths.contact, label: 'Kontakt' },
      },
    ],
  },
];

useArizonaStaticPageHead(
  'Service & Hilfe',
  'Antworten zu Versand (DHL, 4,90 €, 1–3 Werktage), 60 Tagen kostenloser Rückgabe, Zahlung mit PayPal, SEPA oder giropay und Größen.',
);

useHead({
  script: [
    {
      key: 'faq-structured-data',
      type: 'application/ld+json',
      innerHTML: safeSerializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqGroups.flatMap((group) =>
          group.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.link ? `${item.answer} ${item.link.label}` : item.answer },
          })),
        ),
      }),
    },
  ],
});
</script>
