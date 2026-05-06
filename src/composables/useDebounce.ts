import { onScopeDispose } from 'vue'

interface DebounceOptions {
  /** 是否首次立即触发，默认 false */
  leading?: boolean
}

/**
 * 通用防抖。返回 [防抖函数, 取消函数]，
 * 组件卸载时会自动清理，避免泄漏到全局。
 */
export function useDebounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait = 300,
  options: DebounceOptions = {},
): [(...args: Args) => void, () => void] {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastInvokeAt = 0

  const cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const debounced = (...args: Args) => {
    const now = Date.now()
    if (options.leading && now - lastInvokeAt > wait) {
      lastInvokeAt = now
      fn(...args)
      return
    }
    cancel()
    timer = setTimeout(() => {
      lastInvokeAt = Date.now()
      fn(...args)
    }, wait)
  }

  onScopeDispose(cancel)
  return [debounced, cancel]
}
