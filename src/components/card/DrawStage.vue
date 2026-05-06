<script setup lang="ts">
import { computed } from 'vue'
import type { DrawnCard, SpreadKind } from '@/types/tarot'
import TarotCard from './TarotCard.vue'

const props = defineProps<{
  spread: SpreadKind
  drawn: DrawnCard[]
  flipped: boolean[]
  /** 当前是否处于发牌阶段，控制入场动画 */
  dealing: boolean
  /** 是否允许翻牌（动画完成之前不允许，避免错位） */
  interactive: boolean
}>()

const emit = defineEmits<{ flip: [index: number] }>()

const slots = computed(() => {
  const total = props.spread === 'single' ? 1 : 3
  return Array.from({ length: total }, (_, i) => i)
})

const dealDelay = (i: number) => (props.dealing ? i * 160 : 0)

function onFlip(i: number) {
  emit('flip', i)
}
</script>

<template>
  <div class="stage" :class="`stage--${spread}`">
    <div
      v-for="(slot, i) in slots"
      :key="slot"
      class="stage__slot"
    >
      <span v-if="spread === 'three'" class="stage__label">
        {{ ['过去', '现在', '未来'][i] }}
      </span>
      <TarotCard
        :drawn="drawn[i] ?? null"
        :flipped="flipped[i] ?? false"
        :placeholder="!drawn[i]"
        :interactive="interactive"
        :dealing="dealing && !!drawn[i]"
        :deal-delay-ms="dealDelay(i)"
        @flip="onFlip(i)"
      />
    </div>
  </div>
</template>

<style scoped>
.stage {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(14px, 4vw, 48px);
  padding: clamp(20px, 4vw, 48px) 0;
  perspective: var(--card-perspective);
  flex-wrap: wrap;
}

.stage__slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.stage__label {
  font-size: var(--fz-xs);
  letter-spacing: 6px;
  color: var(--color-gold-soft);
}

@media (max-width: 540px) {
  .stage {
    gap: 12px;
  }
}
</style>
