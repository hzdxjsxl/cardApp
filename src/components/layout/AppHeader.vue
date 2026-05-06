<script setup lang="ts">
import { RouterLink } from 'vue-router'

const navItems = [
  { to: '/', label: '主页' },
  { to: '/single', label: '单张抽牌' },
  { to: '/three', label: '三牌阵' },
  { to: '/history', label: '历史记录' },
]
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="brand">
      <span class="brand__mark" aria-hidden="true">✦</span>
      <span class="brand__name">夜行卡牌</span>
      <span class="brand__sub">Tarot de la Nuit</span>
    </RouterLink>

    <nav class="nav" aria-label="主导航">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav__item"
        active-class="nav__item--active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px clamp(16px, 4vw, 48px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  backdrop-filter: blur(6px);
  background: rgba(11, 7, 25, 0.4);
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  color: inherit;
}

.brand__mark {
  font-size: 22px;
  color: var(--color-gold);
}

.brand__name {
  font-family: var(--font-serif);
  font-size: var(--fz-xl);
  letter-spacing: 4px;
}

.brand__sub {
  font-size: var(--fz-xs);
  color: var(--color-text-muted);
  letter-spacing: 2px;
}

.nav {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.6vw, 22px);
}

.nav__item {
  font-size: var(--fz-sm);
  color: var(--color-text-dim);
  padding: 6px 4px;
  border-bottom: 1px solid transparent;
  transition: color var(--dur-fast), border-color var(--dur-fast);
}

.nav__item:hover {
  color: var(--color-gold-soft);
}

.nav__item--active {
  color: var(--color-gold);
  border-color: var(--color-gold);
}

@media (max-width: 540px) {
  .brand__sub {
    display: none;
  }
  .nav {
    gap: 12px;
  }
  .nav__item {
    font-size: var(--fz-xs);
  }
}
</style>
