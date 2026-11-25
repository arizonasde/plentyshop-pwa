<template>
  <NarrowContainer class="px-4 py-6 @md:py-10">
    <h1 class="font-bold typography-headline-3 @md:typography-headline-2 mb-2">Versandkosten</h1>
    <p class="text-neutral-600 mb-6">
      Wir versenden mit DHL in diese Länder. Die Versandkosten gelten je Bestellung und werden dir vor dem Kauf im
      Warenkorb angezeigt.
    </p>

    <div class="overflow-x-auto mb-8">
      <table class="w-full text-left border-collapse" data-testid="shipping-costs-table">
        <thead>
          <tr class="border-b-2 border-neutral-300">
            <th scope="col" class="py-2 pr-4 font-semibold">Lieferland</th>
            <th scope="col" class="py-2 pr-4 font-semibold">Versandkosten</th>
            <th scope="col" class="py-2 font-semibold">Versandkostenfrei</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in ARIZONA_SHIPPING_COUNTRIES" :key="row.country" class="border-b border-neutral-200">
            <th scope="row" class="py-3 pr-4 font-medium">{{ row.country }}</th>
            <td class="py-3 pr-4 whitespace-nowrap">{{ euro(row.cost) }}</td>
            <td class="py-3">{{ row.freeFrom ? `ab ${euro(row.freeFrom)} Bestellwert` : '–' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="font-semibold typography-headline-5 @md:typography-headline-4 mb-2">Lieferzeit</h2>
    <p class="text-neutral-700 mb-8">
      Innerhalb Deutschlands ist deine Bestellung in der Regel in 1–3 Werktagen bei dir. Den Versand übernimmt DHL.
    </p>

    <p class="text-neutral-700">
      Mehr zu Bestellung, Rückgabe und Zahlung findest du unter
      <NuxtLink :to="localePath('/service')" class="underline underline-offset-2">Service &amp; Hilfe</NuxtLink>.
      Noch Fragen? Schreib uns über das
      <NuxtLink :to="localePath(paths.contact)" class="underline underline-offset-2">Kontaktformular</NuxtLink>.
    </p>
  </NarrowContainer>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

/**
 * Arizona: shipping cost overview per delivery country (linked from the footer and from "zzgl. Versandkosten").
 * Rates come from ARIZONA_SHIPPING_COUNTRIES, which mirrors the shipping profiles in plentyONE.
 */
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
});

const localePath = useLocalizedPath();

const euro = (value: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

useArizonaStaticPageHead(
  'Versandkosten',
  'Versandkosten bei Arizona Shopping: Deutschland 4,90 €, ab 99 € kostenlos. Österreich, Belgien, Frankreich, Italien, Niederlande, Polen und Spanien 9,90 €. Versand mit DHL.',
);
</script>
