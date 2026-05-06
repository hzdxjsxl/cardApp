<script setup lang="ts">
import { onBeforeUnmount,ref } from 'vue'
import DrawStage from '@/components/card/DrawStage.vue'
import CardMeaning from '@/components/card/CardMeaning.vue'
import LoadingMask from '@/components/feedback/LoadingMask.vue'
import { useDraw } from '@/composables/useDraw'
import AuthModal from '@/components/login/loginModel.vue'
const showAuth = ref(false)
const handleAuthSuccess = (payload:any) => {
  showAuth.value = false
}
const authMo = ref<any>(null)
const opModal=()=>{
  showAuth.value = true
  authMo.value?.reloadForm()
}
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
  flipAll,
  reset,
} = useDraw('three')

const POSITION_LABELS = ['过去', '现在', '未来']

onBeforeUnmount(reset)
</script>

<template>
  <section class="three">
    <AuthModal ref="authMo" v-model:visible="showAuth" @success="handleAuthSuccess" />
    <header class="three__header">
      <h2>三牌阵</h2>
      <p>过去 · 现在 · 未来。从左至右依次解读。</p>
    </header>

    <DrawStage
      spread="three"
      :drawn="drawn"
      :flipped="flipped"
      :dealing="isDealing"
      :interactive="canInteract"
      @flip="flip"
    />

    <p class="three__phase" aria-live="polite">{{ phaseTip }}</p>

    <div class="three__actions">
      <button class="btn" :disabled="isBusy" @click="onDraw">
        {{ drawn.length === 0 ? '布阵' : '重抽' }}
      </button>
      <button
        v-if="drawn.length && !allRevealed"
        class="btn btn--ghost"
        :disabled="isBusy"
        @click="flipAll"
      >
        一次性翻开
      </button>
      <button v-if="drawn.length" class="btn btn--ghost" :disabled="isBusy" @click="reset">
        清空牌阵
      </button>
      <button v-if="allRevealed && drawn[0]" class="btn btn--ghost" :disabled="isBusy" @click="opModal">
        登录查看更多信息
      </button>
    </div>

    <transition name="fade">
      <div v-if="allRevealed" class="three__meanings">
        <CardMeaning
          v-for="(item, i) in drawn"
          :key="item.card.id + item.position"
          :drawn="item"
          :position-label="POSITION_LABELS[i]"
        />
      </div>
    </transition>

    <LoadingMask :visible="isBusy" tip="星象正在排列…" />
  </section>
</template>

<style scoped>
.three {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.three__header {
  text-align: center;
  margin-bottom: 8px;
}

.three__header h2 {
  font-size: var(--fz-2xl);
  letter-spacing: 4px;
}

.three__header p {
  margin: 6px 0 0;
  color: var(--color-text-dim);
}

.three__phase {
  min-height: 22px;
  font-size: var(--fz-sm);
  color: var(--color-gold-soft);
  letter-spacing: 2px;
  margin: 0;
}

.three__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.three__meanings {
  width: 100%;
  max-width: 920px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-enter-active {
  transition: opacity var(--dur-base), transform var(--dur-base);
}
</style>
