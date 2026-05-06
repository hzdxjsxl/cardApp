<script setup lang="ts">
import { computed } from 'vue'
import { useHistoryStore } from '@/stores/history'
import { useToast } from '@/composables/useToast'
import { formatDateTime } from '@/utils/format'

const history = useHistoryStore()
const toast = useToast()

const isEmpty = computed(() => history.records.length === 0)

function spreadLabel(kind: string) {
  return kind === 'three' ? '三牌阵' : '单张'
}

function onClear() {
  if (history.records.length === 0) return
  if (!confirm('确认清空全部历史记录？此操作不可恢复')) return
  history.clear()
  toast.success('历史记录已清空')
}

function onRemove(id: string) {
  history.remove(id)
  toast.info('已删除该条记录')
}
</script>

<template>
  <section class="history">
    <header class="history__head">
      <div>
        <h2>历史记录</h2>
        <p>本地保存最近 50 次抽牌，仅存于你的浏览器。</p>
      </div>
      <button v-if="!isEmpty" class="btn btn--ghost" @click="onClear">清空全部</button>
    </header>

    <div v-if="isEmpty" class="history__empty">
      <p>还没有任何抽牌记录。先去抽一张试试？</p>
    </div>

    <ul v-else class="history__list">
      <li v-for="rec in history.records" :key="rec.id" class="history__item">
        <header class="history__item-head">
          <span class="history__spread">{{ spreadLabel(rec.spread) }}</span>
          <time>{{ formatDateTime(rec.drawnAt) }}</time>
          <button class="history__remove" @click="onRemove(rec.id)">删除</button>
        </header>
        <div class="history__cards">
          <span
            v-for="(d, i) in rec.drawn"
            :key="rec.id + i"
            class="history__chip"
            :class="{ 'history__chip--rev': d.orientation === 'reversed' }"
          >
            <em>{{ d.card.name }}</em>
            <small>{{ d.orientation === 'reversed' ? '逆位' : '正位' }}</small>
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.history__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.history__head h2 {
  font-size: var(--fz-2xl);
  letter-spacing: 3px;
}

.history__head p {
  margin: 6px 0 0;
  color: var(--color-text-dim);
  font-size: var(--fz-sm);
}

.history__empty {
  padding: 60px 16px;
  text-align: center;
  color: var(--color-text-muted);
  border: 1px dashed rgba(212, 175, 55, 0.25);
  border-radius: var(--radius-md);
}

.history__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history__item {
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: linear-gradient(160deg, rgba(58, 37, 102, 0.45), rgba(26, 15, 46, 0.55));
  border: 1px solid rgba(212, 175, 55, 0.12);
}

.history__item-head {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--fz-sm);
  color: var(--color-text-dim);
}

.history__spread {
  padding: 2px 8px;
  background: rgba(126, 91, 239, 0.25);
  color: var(--color-purple-soft);
  border-radius: 4px;
  font-size: var(--fz-xs);
}

.history__remove {
  margin-left: auto;
  font-size: var(--fz-xs);
  color: var(--color-text-muted);
  padding: 2px 6px;
  border-radius: 4px;
  transition: color var(--dur-fast);
}

.history__remove:hover {
  color: var(--color-danger);
}

.history__cards {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.history__chip {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(212, 175, 55, 0.12);
  font-size: var(--fz-sm);
}

.history__chip em {
  font-style: normal;
  color: var(--color-text);
}

.history__chip small {
  color: var(--color-gold-soft);
  font-size: var(--fz-xs);
}

.history__chip--rev {
  background: rgba(217, 106, 163, 0.18);
}
.history__chip--rev small {
  color: var(--color-rose);
}
</style>
