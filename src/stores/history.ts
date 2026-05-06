import { defineStore } from 'pinia'
import type { DrawRecord, DrawnCard, SpreadKind } from '@/types/tarot'
import { readJSON, writeJSON } from '@/utils/storage'
import { uid } from '@/utils/id'

const STORAGE_KEY = 'card-draw-app:history@v1'
const MAX_RECORDS = 50

interface HistoryState {
  records: DrawRecord[]
}

export const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    records: readJSON<DrawRecord[]>(STORAGE_KEY, []),
  }),
  getters: {
    count: (s) => s.records.length,
    latest: (s) => s.records[0],
  },
  actions: {
    push(spread: SpreadKind, drawn: DrawnCard[]): void {
      const record: DrawRecord = {
        id: uid(),
        spread,
        drawn,
        drawnAt: new Date().toISOString(),
      }
      this.records.unshift(record)
      if (this.records.length > MAX_RECORDS) {
        this.records.length = MAX_RECORDS
      }
      writeJSON(STORAGE_KEY, this.records)
    },
    remove(id: string): void {
      const idx = this.records.findIndex((r) => r.id === id)
      if (idx >= 0) {
        this.records.splice(idx, 1)
        writeJSON(STORAGE_KEY, this.records)
      }
    },
    clear(): void {
      this.records = []
      writeJSON(STORAGE_KEY, this.records)
    },
  },
})
