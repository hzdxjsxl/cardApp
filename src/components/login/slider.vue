<template>
  <div
    class="slider-container"
    :class="{ 'is-unlocked': isUnlocked }"
    ref="trackRef"
  >
    <div class="slider-bg" :style="{ width: dragDistance + 'px' }"></div>
    <div class="slider-text">
      {{ isUnlocked ? '灵力共鸣成功' : '请按住滑块，拖动到最右侧' }}
    </div>
    <div
      class="slider-block"
      :style="{ transform: `translateX(${dragDistance}px)` }"
      @mousedown="handleDragStart"
      @touchstart.passive="handleDragStart"
    >
      <span v-if="!isUnlocked" class="arrow">>></span>
      <span v-else class="check">✔</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
const emit = defineEmits(['success'])

const trackRef = ref(null)
const isUnlocked = ref(false)
const dragDistance = ref(0)
let isDragging = false
let startX = 0

const handleDragStart = (e) => {
  if (isUnlocked.value) return
  isDragging = true
  startX = e.clientX || e.touches[0].clientX

  // 绑定全局事件防止鼠标拖出容器外失效
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove, { passive: false })
  document.addEventListener('touchend', handleDragEnd)
}

const handleDragMove = (e) => {
  if (!isDragging) return
  // 阻止移动端的默认滚动
  if (e.type === 'touchmove') e.preventDefault()

  const currentX = e.clientX || e.touches[0].clientX
  let moveX = currentX - startX

  // 减去滑块自身的宽度(约40px)和边框余量
  const maxDistance = trackRef.value.offsetWidth - 42

  if (moveX < 0) moveX = 0
  if (moveX >= maxDistance) {
    moveX = maxDistance
    unlockSuccess()
  }

  dragDistance.value = moveX
}

const handleDragEnd = () => {
  isDragging = false
  cleanupEvents()

  if (!isUnlocked.value) {
    // 没滑到终点，添加回弹动画
    trackRef.value.classList.add('is-animating')
    dragDistance.value = 0
    setTimeout(() => {
      if (trackRef.value) trackRef.value.classList.remove('is-animating')
    }, 300)
  }
}

const unlockSuccess = () => {
  isUnlocked.value = true
  isDragging = false
  cleanupEvents()
  emit('success') // 抛出成功事件
}

const cleanupEvents = () => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
}

// 暴露重置方法给父组件
const reset = () => {
  isUnlocked.value = false
  dragDistance.value = 0
}
defineExpose({ reset })

onBeforeUnmount(() => {
  cleanupEvents()
})
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  user-select: none;
}

/* 回弹动画 */
.slider-container.is-animating .slider-block,
.slider-container.is-animating .slider-bg {
  transition: all 0.3s ease;
}

.slider-bg {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.5));
  width: 0;
}

.slider-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  line-height: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  letter-spacing: 1px;
  z-index: 1;
}

.is-unlocked .slider-text {
  color: #D4AF37; /* 成功后文字变金 */
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
}

.slider-block {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 40px;
  height: 36px;
  background: #2A203B;
  border: 1px solid rgba(139, 92, 246, 0.5);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  z-index: 2;
  color: rgba(255, 255, 255, 0.8);
}

.slider-block:active {
  cursor: grabbing;
}

.is-unlocked .slider-block {
  border-color: #D4AF37;
  color: #D4AF37;
}

.arrow {
  font-family: monospace;
  font-weight: bold;
}
</style>
