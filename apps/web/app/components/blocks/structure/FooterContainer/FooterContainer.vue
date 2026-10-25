<template>
  <footer
    data-testid="footer"
    class="pt-10 @md:pt-14"
    :style="{
      backgroundColor: props.configuration?.colors?.background,
      color: props.configuration?.colors?.text,
    }"
  >
    <!-- Arizona: service highlights with icons above the footer columns -->
    <ArizonaFooterHighlights class="mb-10 @md:mb-14" />
    <div
      v-for="contentBlock in props.content"
      :key="contentBlock.meta.uuid"
      :class="{ 'px-4 @md:px-6 pb-6 @md:pb-10 max-w-screen-3xl mx-auto': contentBlock.name === 'MultiGrid' }"
    >
      <slot name="content" :content-block="contentBlock" />
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { FooterContainerProps } from '~/components/blocks/structure/FooterContainer/types';

const props = defineProps<FooterContainerProps>();
</script>

<style scoped>
:deep([data-testid='multi-grid-column']) {
  @apply break-words;
}

:deep([data-testid='multi-grid-column'] .rte-prose a) {
  @apply no-underline;
}

:deep([data-testid='multi-grid-column'] .rte-prose a:hover) {
  @apply underline;
}

/* Arizona: airier footer columns with a line icon in front of each heading (order: Rechtliches, Kundenservice,
   Bezahlen, Unsere Vorteile as set in the footer template) */
:deep([data-testid='multi-grid-column'] .rte-prose h2) {
  @apply flex items-center gap-2 mb-4;
}

:deep([data-testid='multi-grid-column'] .rte-prose h2::before) {
  content: '';
  @apply inline-block size-5 shrink-0 bg-current;
  mask: var(--arizona-footer-icon) center / contain no-repeat;
}

:deep([data-testid='multi-grid-column'] .rte-prose p) {
  @apply my-0 py-1.5 leading-relaxed;
}

:deep([data-testid='multi-grid-column']:nth-child(1)) {
  --arizona-footer-icon: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22black%22 stroke-width=%221.8%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z%22/%3E%3Cpath d=%22M14 2v6h6%22/%3E%3Cpath d=%22M16 13H8%22/%3E%3Cpath d=%22M16 17H8%22/%3E%3C/svg%3E");
}

:deep([data-testid='multi-grid-column']:nth-child(2)) {
  --arizona-footer-icon: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22black%22 stroke-width=%221.8%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M7.9 20A9 9 0 1 0 4 16.1L2 22z%22/%3E%3Cpath d=%22M8 12h.01%22/%3E%3Cpath d=%22M12 12h.01%22/%3E%3Cpath d=%22M16 12h.01%22/%3E%3C/svg%3E");
}

:deep([data-testid='multi-grid-column']:nth-child(3)) {
  --arizona-footer-icon: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22black%22 stroke-width=%221.8%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z%22/%3E%3Cpath d=%22M2 10h20%22/%3E%3Cpath d=%22M6 15h4%22/%3E%3C/svg%3E");
}

:deep([data-testid='multi-grid-column']:nth-child(4)) {
  --arizona-footer-icon: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22black%22 stroke-width=%221.8%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22M11.48 3.5a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.75a.53.53 0 0 1 .29.9l-3.73 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.21a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.17 9.99a.53.53 0 0 1 .3-.9l5.15-.75a2.12 2.12 0 0 0 1.6-1.16z%22/%3E%3C/svg%3E");
}
</style>
