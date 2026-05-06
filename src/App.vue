<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import ToastContainer from '@/components/feedback/ToastContainer.vue'
import { useDeckStore } from '@/stores/deck'
import { useToast } from '@/composables/useToast'

const deck = useDeckStore()
const toast = useToast()

onMounted(async () => {
  try {
    await deck.ensureLoaded()
  } catch {
    toast.error(deck.errorMsg || '牌库加载失败，请刷新页面')
  }
})
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <footer class="app-footer">
      <span>© {{ new Date().getFullYear() }} 夜行卡牌</span>
      <span>仅供娱乐，不构成任何决策建议</span>
    </footer>
    <ToastContainer />
  </div>
</template>

<style>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  padding: clamp(16px, 4vw, 48px);
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  padding: 18px clamp(16px, 4vw, 48px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--fz-xs);
  color: var(--color-text-muted);
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  flex-wrap: wrap;
  gap: 8px;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-enter-active,
.page-leave-active {
  transition: opacity var(--dur-base), transform var(--dur-base);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
