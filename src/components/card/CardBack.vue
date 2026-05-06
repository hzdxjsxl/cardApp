<script setup lang="ts">
// 牌背是一段纯装饰 SVG。把它做成独立组件，未来想换皮就改这一处
</script>

<template>
  <div class="card-back" aria-hidden="true">
    <svg viewBox="0 0 180 288" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bgGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#3a2566" />
          <stop offset="100%" stop-color="#1a0f2e" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect width="180" height="288" fill="url(#bgGrad)" />
      <rect x="6" y="6" width="168" height="276" rx="10" fill="none" stroke="#d4af37" stroke-width="1.4" />
      <rect x="12" y="12" width="156" height="264" rx="8" fill="none" stroke="#d4af37" stroke-opacity="0.45" stroke-width="0.8" />

      <circle cx="90" cy="120" r="62" fill="url(#halo)" />

      <g stroke="#d4af37" fill="none" stroke-width="1">
        <circle cx="90" cy="120" r="34" stroke-opacity="0.85" />
        <circle cx="90" cy="120" r="22" stroke-opacity="0.55" />
        <path d="M90 86 L98 120 L90 154 L82 120 Z" stroke-opacity="0.9" />
        <path d="M56 120 L90 110 L124 120 L90 130 Z" stroke-opacity="0.7" />
      </g>

      <g fill="#d4af37" fill-opacity="0.85" font-family="serif" text-anchor="middle">
        <text x="90" y="226" font-size="14" letter-spacing="6">TAROT</text>
        <text x="90" y="248" font-size="9" letter-spacing="4" fill-opacity="0.6">DE LA NUIT</text>
      </g>

      <g stroke="#d4af37" stroke-opacity="0.4" stroke-width="0.6" fill="none">
        <path d="M16 30 Q90 12 164 30" />
        <path d="M16 258 Q90 276 164 258" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.card-back {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-card);
  overflow: hidden;
  background: var(--color-bg-mid);
  box-shadow: inset 0 0 0 1px rgba(212, 175, 55, 0.25);
}

.card-back svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
