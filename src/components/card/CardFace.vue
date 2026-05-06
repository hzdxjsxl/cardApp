<script setup lang="ts">
import { computed } from 'vue'
import type { DrawnCard } from '@/types/tarot'

const props = defineProps<{ drawn: DrawnCard }>()

const isReversed = computed(() => props.drawn.orientation === 'reversed')
const orientationLabel = computed(() => (isReversed.value ? '逆位' : '正位'))

const hue = computed(() => {
  // 不同花色不同色调，做出"系列感"
  const card = props.drawn.card
  if (card.arcana === 'major') return { from: '#7e5bef', to: '#231346' }
  switch (card.suit) {
    case 'wands':
      return { from: '#c2410c', to: '#3b1208' }
    case 'cups':
      return { from: '#0ea5e9', to: '#0c2237' }
    case 'swords':
      return { from: '#94a3b8', to: '#1f2937' }
    case 'pentacles':
      return { from: '#65a30d', to: '#1a2e0f' }
    default:
      return { from: '#7e5bef', to: '#231346' }
  }
})
</script>

<template>
  <div class="face" :class="{ 'face--rev': isReversed }">
    <div
      class="face__inner"
      :style="{
        '--face-from': hue.from,
        '--face-to': hue.to,
      } as Record<string, string>"
    >
      <div class="face__corner face__corner--tl">
        <span>{{ drawn.card.number }}</span>
      </div>
      <div class="face__corner face__corner--br">
        <span>{{ drawn.card.number }}</span>
      </div>

      <div class="face__center">
        <div class="face__symbol" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" stroke-width="1.4" />
            <path
              d="M50 16 L58 50 L50 84 L42 50 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
            />
          </svg>
        </div>
        <div class="face__name">
          {{ drawn.card.name }}
          <span class="face__name-en">{{ drawn.card.nameEn }}</span>
        </div>
      </div>

      <div class="face__footer">
        <span class="face__tag">{{ orientationLabel }}</span>
        <span class="face__keywords">
          {{ drawn.card.keywords.slice(0, 3).join(' · ') }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.face {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-card);
  overflow: hidden;
  position: relative;
}

.face__inner {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(160deg, var(--face-from), var(--face-to));
  color: var(--color-gold-soft);
  box-shadow:
    inset 0 0 0 1px rgba(212, 175, 55, 0.6),
    inset 0 0 24px rgba(0, 0, 0, 0.35);
  transition: transform var(--dur-base) var(--ease-flip);
}

/* 逆位时整张牌物理倒置，这是塔罗的传统呈现；
   CardMeaning 组件负责在卡外正向显示牌名与释义，所以卡面的倒置不影响阅读。 */
.face--rev .face__inner {
  transform: rotate(180deg);
}

.face__corner {
  position: absolute;
  font-family: var(--font-serif);
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--color-gold);
}

.face__corner--tl {
  top: 8px;
  left: 12px;
}

.face__corner--br {
  bottom: 8px;
  right: 12px;
}

.face__center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.face__symbol {
  width: 64%;
  max-width: 130px;
  aspect-ratio: 1 / 1;
  color: var(--color-gold);
  filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.35));
}

.face__symbol svg {
  width: 100%;
  height: 100%;
}

.face__name {
  font-family: var(--font-serif);
  font-size: var(--fz-lg);
  color: #fff;
  line-height: 1.2;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.face__name-en {
  font-size: var(--fz-xs);
  color: var(--color-gold-soft);
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.face__footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: var(--fz-xs);
  color: rgba(255, 255, 255, 0.85);
}

.face__tag {
  padding: 2px 10px;
  border: 1px solid rgba(212, 175, 55, 0.5);
  border-radius: 999px;
  letter-spacing: 2px;
  font-size: 10px;
}

.face__keywords {
  font-size: var(--fz-xs);
  color: var(--color-gold-soft);
  letter-spacing: 1px;
}

@media (max-width: 640px) {
  .face__inner {
    padding: 10px 8px;
  }
  .face__name {
    font-size: var(--fz-base);
  }
}
</style>
