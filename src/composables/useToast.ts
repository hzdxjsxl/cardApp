import { reactive, readonly } from 'vue'
import { uid } from '@/utils/id'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

interface ToastState {
  items: ToastItem[]
}

const DEFAULT_DURATION = 2400
const MAX_VISIBLE = 4

const state = reactive<ToastState>({ items: [] })

function push(message: string, variant: ToastVariant, duration = DEFAULT_DURATION): string {
  const id = uid()
  state.items.push({ id, message, variant, duration })
  if (state.items.length > MAX_VISIBLE) {
    state.items.splice(0, state.items.length - MAX_VISIBLE)
  }
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration)
  }
  return id
}

function dismiss(id: string): void {
  const idx = state.items.findIndex((t) => t.id === id)
  if (idx >= 0) state.items.splice(idx, 1)
}

export function useToast() {
  return {
    state: readonly(state),
    info: (msg: string, dur?: number) => push(msg, 'info', dur),
    success: (msg: string, dur?: number) => push(msg, 'success', dur),
    warn: (msg: string, dur?: number) => push(msg, 'warning', dur),
    error: (msg: string, dur?: number) => push(msg, 'error', dur),
    dismiss,
  }
}
