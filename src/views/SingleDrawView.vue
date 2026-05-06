<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import DrawStage from '@/components/card/DrawStage.vue'
import CardMeaning from '@/components/card/CardMeaning.vue'
import LoadingMask from '@/components/feedback/LoadingMask.vue'
import { useDraw } from '@/composables/useDraw'

const {
  drawn,
  flipped,
  isBusy,
  canInteract,
  isDealing,
  allRevealed,
  phaseTip,
  onDraw,
  flip,
  reset,
} = useDraw('single')

onBeforeUnmount(reset)
</script>

<template>
  <section class="single">
    <header class="single__header">
      <h2>单张抽牌</h2>
      <p>当下最直接的提示。点「抽一张」开始。</p>
    </header>

    <DrawStage
      spread="single"
      :drawn="drawn"
      :flipped="flipped"
      :dealing="isDealing"
      :interactive="canInteract"
      @flip="flip"
    />

    <p class="single__phase" aria-live="polite">{{ phaseTip }}</p>

    <div class="single__actions">
      <button class="btn" :disabled="isBusy" @click="onDraw">
        {{ drawn.length === 0 ? '抽一张' : '再抽一张' }}
      </button>
      <button v-if="drawn.length" class="btn btn--ghost" :disabled="isBusy" @click="reset">
        清空牌面
      </button>
    </div>

    <transition name="fade">
      <div v-if="allRevealed && drawn[0]" class="single__meaning">
        <CardMeaning :drawn="drawn[0]" />
      </div>
    </transition>

    <LoadingMask :visible="isBusy" tip="星象正在排列…" />
  </section>
</template>

<style scoped>
.single {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.single__header {
  text-align: center;
  margin-bottom: 8px;
}

.single__header h2 {
  font-size: var(--fz-2xl);
  letter-spacing: 4px;
}

.single__header p {
  margin: 6px 0 0;
  color: var(--color-text-dim);
}

.single__phase {
  min-height: 22px;
  font-size: var(--fz-sm);
  color: var(--color-gold-soft);
  letter-spacing: 2px;
  margin: 0;
}

.single__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.single__meaning {
  width: 100%;
  max-width: 560px;
  margin-top: 12px;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-enter-active {
  transition: opacity var(--dur-base), transform var(--dur-base);
}
</style>
