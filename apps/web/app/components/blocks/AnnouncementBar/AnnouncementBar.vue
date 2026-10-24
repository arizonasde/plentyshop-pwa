<template>
  <div
    class="min-h-10 h-full w-full flex items-center px-4 @md:px-14 [&_.rte-prose]:text-sm @md:[&_.rte-prose]:text-base"
    :style="inlineStyle"
  >
    <TextContent data-testid="announcement-bar-text" :text="textContentProps" />
  </div>
</template>

<script setup lang="ts">
import type { AnnouncementBarProps } from './types';

const props = defineProps<AnnouncementBarProps>();

const inlineStyle = computed(() => {
  return { backgroundColor: props.content.backgroundColor || '#FFFFFF' };
});

const textContentProps = computed(() => ({
  htmlDescription: props.content.text,
  textAlignment: 'center' as const,
}));
</script>
