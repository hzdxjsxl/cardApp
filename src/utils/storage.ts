/**
 * localStorage 的薄封装。重点在两点：
 * 1. 隐私模式 / 配额满时不要让业务崩溃；
 * 2. 反序列化失败时静默清空对应 key，避免坏数据反复抛错。
 */

const isAvailable = (() => {
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return false
    const probe = '__probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
})()

export function readJSON<T>(key: string, fallback: T): T {
  if (!isAvailable) return fallback
  const raw = window.localStorage.getItem(key)
  if (raw == null) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    window.localStorage.removeItem(key)
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  if (!isAvailable) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    // 配额超限就放弃，外层若需要可以做降级（比如截断历史长度）
    return false
  }
}

export function remove(key: string): void {
  if (!isAvailable) return
  window.localStorage.removeItem(key)
}
