import { defineStore } from 'pinia'
import type { TarotCard } from '@/types/tarot'
import { fetchDeck } from '@/api/tarot'

interface DeckState {
  cards: TarotCard[]
  loading: boolean
  loaded: boolean
  errorMsg: string
}

export const useDeckStore = defineStore('deck', {
  state: (): DeckState => ({
    cards: [],
    loading: false,
    loaded: false,
    errorMsg: '',
  }),
  getters: {
    total: (s) => s.cards.length,
    isReady: (s) => s.loaded && s.cards.length > 0,
  },
  actions: {
    async ensureLoaded(): Promise<void> {
      if (this.loaded || this.loading) return
      this.loading = true
      this.errorMsg = ''
      try {
        const cards = await fetchDeck()
        this.cards = cards
        this.loaded = true
      } catch (e) {
        const msg = (e as { message?: string })?.message ?? '牌库加载失败'
        this.errorMsg = msg
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
