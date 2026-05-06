/** 旧 Safari / 旧 Edge 没 randomUUID，做一层降级 */
export function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  const rand = Math.random().toString(16).slice(2, 10)
  return `${Date.now().toString(16)}-${rand}`
}
