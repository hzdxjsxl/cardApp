<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { state, dismiss } = useToast()
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack" role="region" aria-live="polite">
      <transition-group name="toast">
        <div
          v-for="item in state.items"
          :key="item.id"
          class="toast"
          :class="`toast--${item.variant}`"
          @click="dismiss(item.id)"
        >
          <span class="toast__dot" aria-hidden="true" />
          <span class="toast__text">{{ item.message }}</span>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: var(--z-toast);
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(26, 15, 46, 0.9);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: var(--fz-sm);
  box-shadow: 0 8px 24px -10px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  border: 1px solid rgba(212, 175, 55, 0.25);
}

.toast__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-purple-soft);
  flex: 0 0 auto;
}

.toast--success .toast__dot {
  background: var(--color-success);
}
.toast--warning .toast__dot {
  background: var(--color-warning);
}
.toast--error .toast__dot {
  background: var(--color-danger);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--dur-base), transform var(--dur-base);
}
</style>
