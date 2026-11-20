<template>
  <!--
    Arizona: a far-away thunderstorm behind the dark Black Friday banner. Two thin, branched lightning bolts flicker
    up now and then and light the sky faintly – barely visible, purely decorative. No movement with reduced motion.
  -->
  <div class="arizona-storm pointer-events-none absolute inset-0" aria-hidden="true">
    <span class="arizona-storm__sky arizona-storm__sky--a" />
    <span class="arizona-storm__sky arizona-storm__sky--b" />
    <svg class="absolute inset-0 h-full w-full" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter :id="glowId" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g class="arizona-storm__bolt arizona-storm__bolt--a" :filter="`url(#${glowId})`">
        <path class="arizona-storm__main" :d="BOLT_A.main" />
        <path v-for="(branch, index) in BOLT_A.branches" :key="index" class="arizona-storm__branch" :d="branch" />
      </g>
      <g
        class="arizona-storm__bolt arizona-storm__bolt--b"
        :filter="`url(#${glowId})`"
        transform="translate(140 40) scale(0.75)"
      >
        <path class="arizona-storm__main" :d="BOLT_B.main" />
        <path v-for="(branch, index) in BOLT_B.branches" :key="index" class="arizona-storm__branch" :d="branch" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
const glowId = `arizona-storm-glow-${useId()}`;

// jagged paths with side branches (generated once, fixed so server and browser render the same)
const BOLT_A = {
  main: 'M690 -10 L679 1 L666 16 L661 29 L660 38 L657 46 L644 55 L652 67 L643 76 L654 90 L650 104 L636 122 L629 139 L617 148 L625 159 L626 169 L621 183 L608 197 L599 205 L595 220 L597 231 L590 244 L594 260 L595 270 L604 284 L597 299 L585 317 L591 329 L590 338',
  branches: [
    'M650 104 L647 112 L651 122 L648 130 L645 139 L650 150 L654 161 L645 168 L642 179 L640 186',
    'M625 159 L629 170 L616 176 L608 188 L604 195 L605 204 L602 214 L593 224 L596 233',
    'M652 67 L645 78 L647 85 L642 92 L640 101 L639 108 L641 117 L645 123 L647 130 L649 139 L642 146 L643 153 L633 162',
  ],
};
const BOLT_B = {
  main: 'M250 -10 L264 7 L253 24 L252 38 L242 51 L242 61 L242 72 L231 80 L230 95 L237 108 L226 120 L230 135 L234 150 L231 168 L228 183 L234 197 L223 208 L230 221 L230 235 L222 249 L218 259 L211 275 L200 284 L195 293 L205 306 L202 318 L198 329 L200 344',
  branches: [
    'M230 95 L218 106 L207 116 L209 123 L206 130 L194 139 L186 146 L180 152 L172 164 L175 171 L166 179 L169 191',
    'M237 108 L247 115 L244 122 L246 128 L254 134 L264 142 L270 149 L280 155 L280 161 L283 172 L296 182 L304 194',
  ],
};
</script>

<style scoped>
.arizona-storm__main,
.arizona-storm__branch {
  fill: none;
  stroke: #dfe6ff;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.arizona-storm__main {
  stroke-width: 1.6;
}
.arizona-storm__branch {
  stroke-width: 0.8;
  opacity: 0.7;
}

.arizona-storm__bolt,
.arizona-storm__sky {
  opacity: 0;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* faint light in the clouds around each strike */
.arizona-storm__sky {
  position: absolute;
  inset: 0;
}
.arizona-storm__sky--a {
  background: radial-gradient(ellipse 45% 70% at 64% 20%, rgb(190 205 255 / 0.1), transparent 70%);
  animation-name: arizona-storm-sky;
  animation-duration: 13s;
}
.arizona-storm__sky--b {
  background: radial-gradient(ellipse 40% 60% at 32% 15%, rgb(190 205 255 / 0.08), transparent 70%);
  animation-name: arizona-storm-sky;
  animation-duration: 19s;
  animation-delay: -6s;
}

.arizona-storm__bolt--a {
  animation-name: arizona-storm-strike;
  animation-duration: 13s;
}
.arizona-storm__bolt--b {
  animation-name: arizona-storm-strike-weak;
  animation-duration: 19s;
  animation-delay: -6s;
}

/* a real strike flickers: flash, almost dark, second flash, slow fade – then a long pause */
@keyframes arizona-storm-strike {
  0%,
  70% {
    opacity: 0;
  }
  70.4% {
    opacity: 0.32;
  }
  71% {
    opacity: 0.05;
  }
  71.6% {
    opacity: 0.26;
  }
  73.5% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes arizona-storm-strike-weak {
  0%,
  70% {
    opacity: 0;
  }
  70.4% {
    opacity: 0.2;
  }
  71% {
    opacity: 0.03;
  }
  71.5% {
    opacity: 0.16;
  }
  73% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
@keyframes arizona-storm-sky {
  0%,
  70% {
    opacity: 0;
  }
  70.4% {
    opacity: 1;
  }
  71% {
    opacity: 0.2;
  }
  71.6% {
    opacity: 0.8;
  }
  75% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .arizona-storm__bolt,
  .arizona-storm__sky {
    animation: none;
  }
}
</style>
