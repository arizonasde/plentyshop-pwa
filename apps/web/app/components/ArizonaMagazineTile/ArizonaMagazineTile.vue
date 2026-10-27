<template>
  <NuxtLink
    v-if="post"
    :to="localePath(arizonaMagazinePostPath(post.slug))"
    class="group/magazine relative flex h-full flex-col no-underline overflow-hidden rounded-lg bg-[#FAF7F2]"
    data-testid="arizona-magazine-tile"
  >
    <img
      :src="post.kachel"
      :alt="post.titel"
      loading="lazy"
      class="w-full aspect-[4/5] object-cover transition-opacity duration-300 group-hover/magazine:opacity-90"
    />
    <span class="flex flex-1 flex-col justify-center px-3 py-3 typography-text-sm">
      <span class="font-semibold uppercase tracking-[0.18em] text-[11px] text-[#C8102E]">Trends &amp; Tipps</span>
      <span class="font-semibold underline underline-offset-2">Zum Artikel →</span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import {
  arizonaMagazinePostPath,
  findArizonaMagazinePost,
  useArizonaMagazine,
} from '~/composables/useArizonaMagazine/useArizonaMagazine';

// Arizona: tile of the newest magazine post that belongs to the current category (or a parent of it).
const route = useRoute();
const localePath = useLocalizedPath();
const { posts } = await useArizonaMagazine();
const post = computed(() => findArizonaMagazinePost(posts.value, route.path));
</script>
