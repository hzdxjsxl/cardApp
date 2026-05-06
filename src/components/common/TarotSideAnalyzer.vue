<script setup lang="ts">
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <transition name="slide-fade">
    <aside v-if="visible" class="side-analyzer">
      <header class="side-analyzer__header">
        <h3 class="title">高维能量解读</h3>
        <button class="close-btn" @click="emit('close')" aria-label="关闭">×</button>
      </header>

      <div class="side-analyzer__content">
        <!-- 有解析内容时展示流式文本 -->
        <p v-if="text || isAnalyzing" class="analysis-text">
          {{ text }}
          <span v-show="isAnalyzing" class="cursor">_</span>
        </p>
        <!-- 还没有内容时展示占位提示 -->
        <div v-else class="skeleton-text">
          等待星象指引，正在连接阿卡夏记录...
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
/* 固定在右侧红框区域 */
.side-analyzer {
  position: absolute;
  top: 100px; /* 避开顶部导航栏，根据你的实际情况微调 */
  right: 5%; /* 靠右对齐 */
  width: 320px; /* 红框的宽度 */
  bottom: 40px; /* 距离底部留白 */

  /* 严格遵循你的暗黑+暗金UI色调 */
  background: rgba(20, 15, 30, 0.6);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  padding: 24px;
  box-shadow: -4px 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);

  display: flex;
  flex-direction: column;
  z-index: 100; /* 确保在卡牌之上 */
}

.side-analyzer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.title {
  font-size: var(--fz-lg, 18px);
  color: var(--color-gold-soft, #d4af37);
  letter-spacing: 2px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-dim, #9a92ac);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--color-gold-soft, #d4af37);
}

.side-analyzer__content {
  flex: 1;
  overflow-y: auto; /* 内容过多时允许滚动 */
  padding-right: 8px; /* 给滚动条留点位置 */
}

/* 滚动条样式定制，适配暗黑主题 */
.side-analyzer__content::-webkit-scrollbar {
  width: 4px;
}
.side-analyzer__content::-webkit-scrollbar-track {
  background: transparent;
}
.side-analyzer__content::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 4px;
}

.analysis-text {
  font-size: 15px;
  line-height: 1.8;
  letter-spacing: 1px;
  white-space: pre-wrap; /* 识别后端返回的换行符 */
  margin: 0;
}

.cursor {
  animation: blink 1s infinite;
  color: var(--color-gold-soft, #d4af37);
}

.skeleton-text {
  color: var(--color-text-dim, #9a92ac);
  font-style: italic;
  font-size: 14px;
  animation: pulse 2s infinite;
}

/* 右侧滑入动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
