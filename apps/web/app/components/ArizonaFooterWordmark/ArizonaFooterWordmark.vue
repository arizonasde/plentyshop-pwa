<template>
  <div
    ref="root"
    class="arizona-wordmark"
    :class="{ 'is-visible': visible, 'is-lit': lit }"
    aria-hidden="true"
    data-testid="arizona-footer-wordmark"
  >
    <span class="arizona-wordmark__layer arizona-wordmark__ghost">
      <span v-for="(letter, index) in LETTERS" :key="index" class="arizona-wordmark__letter" :style="delay(index)">
        {{ letter }}
      </span>
    </span>
    <span class="arizona-wordmark__layer arizona-wordmark__light">
      <span v-for="(letter, index) in LETTERS" :key="index" class="arizona-wordmark__letter" :style="delay(index)">
        {{ letter }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * Arizona: huge ARIZONAS lettering behind the footer. The letters rise out of the dark copyright bar once the footer
 * scrolls into view; with a mouse a soft light follows the pointer (smoothed, a little behind it) and lights up the
 * letters underneath. Purely decorative, no motion with "reduce motion".
 */
const LETTERS = 'ARIZONAS'.split('');
// non-uniform stagger feels more natural than equal steps
const DELAYS = [0, 45, 85, 120, 150, 185, 225, 270];
const delay = (index: number) => ({ '--arizona-wordmark-delay': `${DELAYS[index] ?? 0}ms` });

const root = ref<HTMLElement>();
const visible = ref(false);
const lit = ref(false);

let observer: IntersectionObserver | undefined;
let frame = 0;
let footer: HTMLElement | null = null;
const target = { x: 0, y: 0 };
const current = { x: 0, y: 0 };

const paint = () => {
  current.x += (target.x - current.x) * 0.14;
  current.y += (target.y - current.y) * 0.14;
  root.value?.style.setProperty('--arizona-wordmark-x', `${current.x.toFixed(1)}px`);
  root.value?.style.setProperty('--arizona-wordmark-y', `${current.y.toFixed(1)}px`);
  frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.5 ? requestAnimationFrame(paint) : 0;
};

const onMove = (event: PointerEvent) => {
  if (!root.value || event.pointerType !== 'mouse') return;
  const box = root.value.getBoundingClientRect();
  target.x = event.clientX - box.left;
  target.y = event.clientY - box.top;
  if (!lit.value) {
    // start the light where the pointer enters instead of flying in from a corner
    current.x = target.x;
    current.y = target.y;
    lit.value = true;
  }
  if (!frame) frame = requestAnimationFrame(paint);
};
const onLeave = () => {
  lit.value = false;
};

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    visible.value = true;
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          visible.value = true;
          observer?.disconnect();
        }
      },
      { rootMargin: '0px 0px -80px 0px' },
    );
    if (root.value) observer.observe(root.value);
  }

  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    footer = root.value?.parentElement ?? null;
    footer?.addEventListener('pointermove', onMove, { passive: true });
    footer?.addEventListener('pointerleave', onLeave);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  cancelAnimationFrame(frame);
  footer?.removeEventListener('pointermove', onMove);
  footer?.removeEventListener('pointerleave', onLeave);
});
</script>

<style scoped>
.arizona-wordmark {
  --arizona-wordmark-ease: cubic-bezier(0.23, 1, 0.32, 1);
  --arizona-wordmark-x: 50%;
  --arizona-wordmark-y: 50%;
  position: absolute;
  left: 50%;
  bottom: 60px;
  z-index: -1;
  pointer-events: none;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: clamp(4rem, 16.5vw, 19rem);
  font-weight: 700;
  font-style: italic;
  line-height: 0.8;
  letter-spacing: -0.06em;
  user-select: none;
}

.arizona-wordmark__layer {
  display: block;
}

.arizona-wordmark__ghost {
  color: rgb(0 0 0 / 0.055);
}

/* same letters on top, dark and only visible inside the soft light around the pointer */
.arizona-wordmark__light {
  position: absolute;
  inset: 0;
  opacity: 0;
  -webkit-mask-image: radial-gradient(
    circle 220px at var(--arizona-wordmark-x) var(--arizona-wordmark-y),
    #000 0%,
    rgb(0 0 0 / 0.35) 45%,
    transparent 100%
  );
  mask-image: radial-gradient(
    circle 220px at var(--arizona-wordmark-x) var(--arizona-wordmark-y),
    #000 0%,
    rgb(0 0 0 / 0.35) 45%,
    transparent 100%
  );
  transition: opacity 500ms ease;
}

.is-lit .arizona-wordmark__light {
  opacity: 1;
  transition-duration: 250ms;
}

/* letters rise out of the copyright bar once, one after the other */
.arizona-wordmark__letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(55%);
  transition:
    transform 1100ms var(--arizona-wordmark-ease) var(--arizona-wordmark-delay),
    opacity 700ms ease var(--arizona-wordmark-delay);
}

.arizona-wordmark__light .arizona-wordmark__letter {
  color: transparent;
  background-image: linear-gradient(180deg, rgb(0 0 0 / 0.6), rgb(0 0 0 / 0.2));
  -webkit-background-clip: text;
  background-clip: text;
}

.is-visible .arizona-wordmark__letter {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .arizona-wordmark__letter {
    transition: opacity 300ms ease;
    transform: none;
  }
}
</style>
