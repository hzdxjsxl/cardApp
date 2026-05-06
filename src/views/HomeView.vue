<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useDeckStore } from '@/stores/deck'
import { useHistoryStore } from '@/stores/history'

const deck = useDeckStore()
const history = useHistoryStore()

const tip = computed(() => {
  if (!deck.loaded) return '正在准备牌库…'
  return `共 ${deck.total} 张牌已就位，过往记录 ${history.count} 条`
})
</script>

<template>
  <section class="home">
    <div class="home__hero">
      <p class="home__eyebrow">TAROT · 单页应用</p>
      <h1 class="home__title">
        在牌堆静默之处，<br />
        听见心里的回声
      </h1>
      <p class="home__desc">
        全凭直觉，与命运对一次坦率的话。<br />
        选一种牌阵开始，剩下的交给牌。
      </p>
      <p class="home__tip">{{ tip }}</p>

      <div class="home__cta">
        <RouterLink to="/single" class="btn">单张抽牌</RouterLink>
        <RouterLink to="/three" class="btn btn--ghost">三牌阵：过去 · 现在 · 未来</RouterLink>
      </div>
    </div>

    <div class="home__decor" aria-hidden="true">
      <span class="orb orb--a" />
      <span class="orb orb--b" />
      <span class="orb orb--c" />
    </div>
  </section>
</template>

<style scoped>
.home {
  position: relative;
  min-height: calc(100vh - 220px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: clamp(24px, 6vw, 80px) 0;
}

.home__hero {
  position: relative;
  max-width: 640px;
  z-index: 1;
}

.home__eyebrow {
  margin: 0 0 12px;
  letter-spacing: 6px;
  font-size: var(--fz-xs);
  color: var(--color-gold);
}

.home__title {
  margin: 0;
  font-size: var(--fz-3xl);
  line-height: 1.25;
  color: #fff;
  letter-spacing: 0.04em;
}

.home__desc {
  margin: 18px 0 6px;
  color: var(--color-text-dim);
  line-height: 1.8;
  font-size: var(--fz-base);
}

.home__tip {
  margin: 0 0 24px;
  color: var(--color-text-muted);
  font-size: var(--fz-sm);
  letter-spacing: 1px;
}

.home__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.home__decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.55;
}

.orb--a {
  width: 280px;
  height: 280px;
  right: 6%;
  top: 10%;
  background: radial-gradient(circle, #7e5bef, transparent 70%);
  animation: float 9s ease-in-out infinite;
}

.orb--b {
  width: 220px;
  height: 220px;
  right: 22%;
  bottom: 6%;
  background: radial-gradient(circle, #d96aa3, transparent 70%);
  animation: float 11s ease-in-out infinite reverse;
}

.orb--c {
  width: 180px;
  height: 180px;
  right: 40%;
  top: 50%;
  background: radial-gradient(circle, #d4af37, transparent 70%);
  opacity: 0.25;
  animation: float 13s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(-20px, -30px, 0);
  }
}

@media (max-width: 640px) {
  .orb {
    display: none;
  }
}
</style>
