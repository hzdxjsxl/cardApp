<script setup lang="ts">
defineProps<{ visible: boolean; tip?: string }>()
</script>

<template>
  <transition name="mask">
    <div v-if="visible" class="mask" role="status" aria-live="polite">
      <div class="mask__spinner" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p v-if="tip" class="mask__tip">{{ tip }}</p>
    </div>
  </transition>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(11, 7, 25, 0.55);
  backdrop-filter: blur(4px);
  z-index: var(--z-mask);
}

.mask__spinner {
  display: flex;
  gap: 6px;
}

.mask__spinner span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-gold);
  animation: spinner 1.1s ease-in-out infinite;
}

.mask__spinner span:nth-child(2) {
  animation-delay: 0.15s;
}
.mask__spinner span:nth-child(3) {
  animation-delay: 0.3s;
}

.mask__tip {
  margin: 0;
  font-size: var(--fz-sm);
  color: var(--color-text-dim);
  letter-spacing: 2px;
}

@keyframes spinner {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.mask-enter-from,
.mask-leave-to {
  opacity: 0;
}
.mask-enter-active,
.mask-leave-active {
  transition: opacity var(--dur-base);
}
</style>
