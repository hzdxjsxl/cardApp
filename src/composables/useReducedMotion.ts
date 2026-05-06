import { onBeforeUnmount, ref } from 'vue'

/** 监听系统的 prefers-reduced-motion，关掉时返回 true */
export function useReducedMotion() {
  const reduced = ref(false)
  if (typeof window === 'undefined' || !('matchMedia' in window)) {
    return reduced
  }
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = mq.matches
  const onChange = (e: MediaQueryListEvent) => {
    reduced.value = e.matches
  }
  mq.addEventListener('change', onChange)
  onBeforeUnmount(() => mq.removeEventListener('change', onChange))
  return reduced
}
