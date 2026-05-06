<script setup lang="ts">
import { computed } from 'vue'
import type { DrawnCard } from '@/types/tarot'
import CardBack from './CardBack.vue'
import CardFace from './CardFace.vue'

const props = withDefaults(
  defineProps<{
    drawn?: DrawnCard | null
    flipped?: boolean
    interactive?: boolean
    /** 入场动画的延迟，便于做发牌错位 */
    dealDelayMs?: number
    /** 是否启用入场发牌动画 */
    dealing?: boolean
    /** 隐藏（占位）状态，未抽牌时使用 */
    placeholder?: boolean
  }>(),
  {
    drawn: null,
    flipped: false,
    interactive: true,
    dealDelayMs: 0,
    dealing: false,
    placeholder: false,
  },
)

const emit = defineEmits<{ flip: [] }>()

const ariaLabel = computed(() => {
  if (props.placeholder || !props.drawn) return '尚未抽出的卡牌'
  if (!props.flipped) return '未翻面的卡牌，按下可翻牌'
  const o = props.drawn.orientation === 'reversed' ? '逆位' : '正位'
  return `${props.drawn.card.name}（${o}）`
})

const isClickable = computed(
  () => props.interactive && !!props.drawn && !props.flipped && !props.placeholder,
)

function onActivate() {
  if (!isClickable.value) return
  emit('flip')
}

function onKey(e: KeyboardEvent) {
  if (!isClickable.value) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('flip')
  }
}

const dealStyle = computed(() => ({
  '--deal-delay': `${props.dealDelayMs}ms`,
}))
</script>

<template>
  <div
    class="tarot-card"
    :class="{
      'tarot-card--flipped': flipped,
      'tarot-card--clickable': isClickable,
      'tarot-card--placeholder': placeholder,
      'tarot-card--dealing': dealing,
    }"
    :style="dealStyle as Record<string, string>"
    role="button"
    :tabindex="isClickable ? 0 : -1"
    :aria-label="ariaLabel"
    :aria-pressed="flipped"
    @click="onActivate"
    @keydown="onKey"
  >
    <div class="tarot-card__inner">
      <div class="tarot-card__face tarot-card__face--back">
        <CardBack />
      </div>
      <div class="tarot-card__face tarot-card__face--front">
        <CardFace v-if="drawn" :drawn="drawn" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarot-card {
  width: var(--card-w);
  height: var(--card-h);
  perspective: var(--card-perspective);
  position: relative;
  outline: none;
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.45));
  transition: transform var(--dur-base) var(--ease-flip);
  will-change: transform;
}

.tarot-card--clickable {
  cursor: pointer;
}

.tarot-card--clickable:hover {
  transform: translateY(-6px);
}

.tarot-card:focus-visible .tarot-card__inner {
  box-shadow: var(--glow-gold);
  border-radius: var(--radius-card);
}

.tarot-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform var(--dur-flip) var(--ease-flip);
  will-change: transform;
}

.tarot-card--flipped .tarot-card__inner {
  transform: rotateY(180deg);
}

.tarot-card__face {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-card);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
}

.tarot-card__face--front {
  transform: rotateY(180deg);
}

.tarot-card--placeholder .tarot-card__face--back {
  opacity: 0.5;
  filter: grayscale(0.4);
}

/* 发牌入场：从顶部飞下并轻微抖动 */
.tarot-card--dealing {
  animation: deal-in var(--dur-deal) var(--ease-out-back) both;
  animation-delay: var(--deal-delay, 0ms);
}

@keyframes deal-in {
  0% {
    opacity: 0;
    transform: translateY(-180px) rotate(-8deg) scale(0.9);
  }
  60% {
    opacity: 1;
    transform: translateY(8px) rotate(2deg) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tarot-card,
  .tarot-card__inner,
  .tarot-card--dealing {
    transition: none;
    animation: none;
  }
}
</style>
