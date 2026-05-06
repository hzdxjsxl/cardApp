/**
 * Fisher-Yates 原地洗牌的非破坏版本。
 * 用 crypto.getRandomValues 提高随机性，避免 Math.random 在某些 WebView 上分布不均。
 */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = input.slice()
  const len = arr.length
  if (len <= 1) return arr

  const randoms = new Uint32Array(len)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(randoms)
  } else {
    for (let i = 0; i < len; i += 1) {
      randoms[i] = Math.floor(Math.random() * 0xffffffff)
    }
  }

  for (let i = len - 1; i > 0; i -= 1) {
    const j = randoms[i] % (i + 1)
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

/** 抽 N 张不重复的牌，count 超出长度时按全量返回 */
export function pickN<T>(input: readonly T[], count: number): T[] {
  if (count <= 0) return []
  const shuffled = shuffle(input)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
