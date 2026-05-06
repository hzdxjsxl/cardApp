<script setup lang="ts">
import { computed } from 'vue'
import type { DrawnCard } from '@/types/tarot'

const props = defineProps<{
  drawn: DrawnCard
  /** 三牌阵下用于显示「过去 / 现在 / 未来」 */
  positionLabel?: string
}>()

const isReversed = computed(() => props.drawn.orientation === 'reversed')

const meaning = computed(() =>
  isReversed.value ? props.drawn.card.reversedMeaning : props.drawn.card.uprightMeaning,
)
</script>

<template>
  <article class="meaning">
    <header class="meaning__head">
      <span v-if="positionLabel" class="meaning__pos">{{ positionLabel }}</span>
      <h3 class="meaning__name">
        {{ drawn.card.name }}
        <small>{{ drawn.card.nameEn }}</small>
      </h3>
      <span class="meaning__tag" :class="{ 'meaning__tag--rev': isReversed }">
        {{ isReversed ? '逆位' : '正位' }}
      </span>
    </header>

    <p class="meaning__text">{{ meaning }}</p>

    <ul class="meaning__keywords">
      <li v-for="kw in drawn.card.keywords" :key="kw">{{ kw }}</li>
    </ul>
  </article>
</template>

<style scoped>
.meaning {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
  border-radius: var(--radius-md);
  background: linear-gradient(160deg, rgba(58, 37, 102, 0.5), rgba(26, 15, 46, 0.5));
  border: 1px solid rgba(212, 175, 55, 0.15);
  backdrop-filter: blur(2px);
}

.meaning__head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.meaning__pos {
  font-size: var(--fz-xs);
  letter-spacing: 4px;
  color: var(--color-gold-soft);
  padding: 2px 10px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 999px;
}

.meaning__name {
  margin: 0;
  font-size: var(--fz-lg);
  color: #fff;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.meaning__name small {
  font-size: var(--fz-xs);
  color: var(--color-text-muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: normal;
}

.meaning__tag {
  margin-left: auto;
  padding: 2px 8px;
  font-size: var(--fz-xs);
  border-radius: 4px;
  background: rgba(126, 91, 239, 0.25);
  color: var(--color-purple-soft);
}

.meaning__tag--rev {
  background: rgba(217, 106, 163, 0.25);
  color: var(--color-rose);
}

.meaning__text {
  margin: 0;
  line-height: 1.7;
  color: var(--color-text);
  font-size: var(--fz-base);
}

.meaning__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.meaning__keywords li {
  padding: 2px 10px;
  font-size: var(--fz-xs);
  background: rgba(212, 175, 55, 0.1);
  color: var(--color-gold-soft);
  border-radius: 999px;
  letter-spacing: 1px;
}
</style>
