<template>
  <div>
    <button
      type="button"
      class="flex items-center gap-1 typography-text-sm underline underline-offset-2 hover:text-neutral-600"
      data-testid="size-guide-open"
      @click="isOpen = true"
    >
      <svg
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0z"
        />
        <path d="m14.5 12.5 2-2" />
        <path d="m11.5 9.5 2-2" />
        <path d="m8.5 6.5 2-2" />
        <path d="m17.5 15.5 2-2" />
      </svg>
      Größentabelle
    </button>

    <UiModal v-model="isOpen" tag="section" class="w-full @md:w-[640px] m-0 p-6 max-h-screen overflow-y-auto">
      <header class="flex items-start justify-between gap-4">
        <h2 class="font-bold typography-headline-4">Welche Größe passt mir?</h2>
        <UiButton aria-label="Schließen" square variant="tertiary" @click="isOpen = false">
          <SfIconClose />
        </UiButton>
      </header>

      <div class="mt-4 flex gap-2" role="tablist" aria-label="Tabelle wählen">
        <button
          v-for="table in tables"
          :key="table.id"
          type="button"
          role="tab"
          :aria-selected="activeId === table.id"
          class="rounded-full border px-4 py-1.5 typography-text-sm"
          :class="activeId === table.id ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300'"
          @click="activeId = table.id"
        >
          {{ table.label }}
        </button>
      </div>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full typography-text-sm" data-testid="size-guide-table">
          <thead>
            <tr class="border-b border-neutral-300 text-left">
              <th v-for="column in activeTable.columns" :key="column" class="py-2 pr-4 font-semibold">{{ column }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in activeTable.rows" :key="row[0]" class="border-b border-neutral-100">
              <td v-for="(cell, i) in row" :key="i" class="py-2 pr-4" :class="{ 'font-semibold': i === 0 }">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="mt-6 font-semibold">So misst du richtig</h3>
      <ul class="mt-2 list-disc space-y-1 pl-5 typography-text-sm text-neutral-700">
        <li><strong>Brust:</strong> waagerecht an der stärksten Stelle unter den Armen messen.</li>
        <li><strong>Taille:</strong> an der schmalsten Stelle, etwas oberhalb des Bauchnabels.</li>
        <li v-if="activeId === 'damen'"><strong>Hüfte:</strong> an der stärksten Stelle des Pos.</li>
        <li><strong>Innenbein:</strong> vom Schritt bis zum Boden, ohne Schuhe.</li>
      </ul>
      <p class="mt-4 typography-text-xs text-neutral-500">
        Die Werte sind Richtwerte in Zentimetern. Je nach Marke und Schnitt kann die Passform abweichen – Hinweise zur
        Passform findest du in der Artikelbeschreibung. Liegst du zwischen zwei Größen, nimm bei engen Schnitten die
        größere. Unsicher? Schreib uns über das
        <NuxtLink :to="localePath(paths.contact)" class="underline" @click="isOpen = false">Kontaktformular</NuxtLink>
        oder ruf an: 06241 / 5003701.
      </p>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';

/**
 * Arizona: size guide next to the size selection – general size charts (in cm) for women and men. The table of the
 * department in the product URL (damenmode / herrenmode) is shown first.
 */
const localePath = useLocalizedPath();
const route = useRoute();
const isOpen = ref(false);

const tables = [
  {
    id: 'damen',
    label: 'Damen',
    columns: ['Größe', 'EU', 'Brust', 'Taille', 'Hüfte'],
    rows: [
      ['XS', '32–34', '78–84', '60–66', '86–92'],
      ['S', '36', '85–88', '67–70', '93–96'],
      ['M', '38–40', '89–96', '71–78', '97–104'],
      ['L', '42', '97–100', '79–82', '105–108'],
      ['XL', '44–46', '101–108', '83–90', '109–116'],
      ['XXL', '48', '109–112', '91–94', '117–120'],
    ],
  },
  {
    id: 'herren',
    label: 'Herren',
    columns: ['Größe', 'EU', 'Brust', 'Taille', 'Jeans-Weite'],
    rows: [
      ['S', '44–46', '88–94', '76–82', '29–30'],
      ['M', '48–50', '95–102', '83–90', '31–32'],
      ['L', '52–54', '103–110', '91–98', '33–34'],
      ['XL', '56–58', '111–118', '99–106', '36'],
      ['XXL', '60–62', '119–126', '107–114', '38'],
    ],
  },
];

const activeId = ref(route.path.includes('herrenmode') ? 'herren' : 'damen');
const activeTable = computed(() => tables.find((table) => table.id === activeId.value) ?? tables[0]!);
</script>
