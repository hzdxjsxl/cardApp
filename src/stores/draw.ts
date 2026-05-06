import { defineStore } from 'pinia'
import type { DrawnCard, SpreadKind, TarotCard } from '@/types/tarot'
import { drawCardsRemote } from '@/api/tarot'
import { useDeckStore } from './deck'
import { useHistoryStore } from './history'

/** 抽牌阶段；动画状态机由它驱动 */
export type DrawPhase = 'idle' | 'shuffling' | 'dealing' | 'revealable' | 'revealed'

interface DrawState {
  spread: SpreadKind
  phase: DrawPhase
  drawn: DrawnCard[]
  flipped: boolean[]
  errorMsg: string
}

const REVERSED_RATE = 0.3 // 30% 概率出现逆位，避免审美单调

const POSITIONS_THREE: DrawnCard['position'][] = ['past', 'present', 'future']

function attachOrientation(cards: TarotCard[], spread: SpreadKind): DrawnCard[] {
  return cards.map((card, idx) => {
    const orientation = Math.random() < REVERSED_RATE ? 'reversed' : 'upright'
    const position: DrawnCard['position'] =
      spread === 'single' ? 'single' : POSITIONS_THREE[idx] ?? 'present'
    return { card, orientation, position }
  })
}

export const useDrawStore = defineStore('draw', {
  state: (): DrawState => ({
    spread: 'single',
    phase: 'idle',
    drawn: [],
    flipped: [],
    errorMsg: '',
  }),
  getters: {
    isBusy: (s) => s.phase === 'shuffling' || s.phase === 'dealing',
    allRevealed: (s) => s.flipped.length > 0 && s.flipped.every(Boolean),
  },
  actions: {
    reset(): void {
      this.phase = 'idle'
      this.drawn = []
      this.flipped = []
      this.errorMsg = ''
    },

    /** 由组件按动画节奏调用：洗牌 → 发牌 → 等待用户翻牌 */
    async startDraw(spread: SpreadKind, shuffleMs = 600, dealMs = 600): Promise<void> {
      const deck = useDeckStore()
      await deck.ensureLoaded()
      this.reset()
      this.spread = spread
      this.phase = 'shuffling'

      const count = spread === 'single' ? 1 : 3

      // 真实接口与动画并行，整体感更连贯
      const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
      try {
        const [cards] = await Promise.all([drawCardsRemote(count), wait(shuffleMs)])
        this.drawn = attachOrientation(cards, spread)
        this.flipped = new Array(this.drawn.length).fill(false)
        this.phase = 'dealing'
        await wait(dealMs)
        this.phase = 'revealable'
      } catch (e) {
        this.phase = 'idle'
        this.errorMsg = (e as { message?: string })?.message ?? '抽牌失败'
        throw e
      }
    },

    flip(index: number): void {
      if (this.phase !== 'revealable' && this.phase !== 'revealed') return
      if (index < 0 || index >= this.flipped.length) return
      if (this.flipped[index]) return
      this.flipped[index] = true
      if (this.flipped.every(Boolean)) {
        this.phase = 'revealed'
        // 全部翻完写入历史
        useHistoryStore().push(this.spread, this.drawn)
      }
    },

    flipAll(): void {
      if (this.phase !== 'revealable') return
      this.flipped = this.flipped.map(() => true)
      this.phase = 'revealed'
      useHistoryStore().push(this.spread, this.drawn)
    },
  },
})
