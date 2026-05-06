import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiEnvelope } from '@/types/api'
import type { TarotCard } from '@/types/tarot'
import { request } from './http'
import { fullDeck } from '@/data/deck'
import { pickN } from '@/utils/shuffle'

/**
 * 当前没有真实牌库后端，用 axios 的自定义 adapter 在前端短路一层，
 * 让请求依然完整走过 axios 的拦截器 / 错误归一化 / AbortController 链路。
 *
 * 切到真实接口时，删掉这个 adapter，把 baseURL 指到后端即可，
 * 上层调用（fetchDeck / drawCardsRemote）签名不变。
 */

const NETWORK_DELAY_MS = 220
const NETWORK_JITTER_MS = 180

interface MockRouteHandler {
  match: (url: string) => boolean
  handle: (config: InternalAxiosRequestConfig) => unknown
}

const routes: MockRouteHandler[] = [
  {
    match: (url) => url.endsWith('/api/tarot/deck'),
    handle: () => fullDeck,
  },
  {
    match: (url) => url.endsWith('/api/tarot/draw'),
    handle: (config) => {
      const params = config.params as { count?: number } | undefined
      const count = Math.max(1, Math.min(params?.count ?? 1, fullDeck.length))
      return pickN(fullDeck, count)
    },
  },
]

const mockAdapter: AxiosAdapter = (config) => {
  const url = config.url ?? ''
  const route = routes.find((r) => r.match(url))
  const delay = NETWORK_DELAY_MS + Math.random() * NETWORK_JITTER_MS

  // axios 的 GenericAbortSignal 类型只声明了 aborted，事件监听 API 是可选的，
  // 所以这里手动判一次再用，避免 TS 抱怨。
  const signal = config.signal as AbortSignal | undefined

  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | null = null

    const onAbort = () => {
      if (timer) clearTimeout(timer)
      const reason = signal && 'reason' in signal ? (signal as AbortSignal).reason : undefined
      reject(reason ?? new DOMException('canceled', 'AbortError'))
    }

    if (signal?.aborted) {
      onAbort()
      return
    }
    if (signal && typeof signal.addEventListener === 'function') {
      signal.addEventListener('abort', onAbort, { once: true })
    }

    timer = setTimeout(() => {
      if (signal && typeof signal.removeEventListener === 'function') {
        signal.removeEventListener('abort', onAbort)
      }
      if (!route) {
        const err = new Error(`mock route 未命中: ${url}`)
        ;(err as Error & { response?: unknown }).response = {
          status: 404,
          data: { code: 404, message: '资源不存在', data: null },
        }
        reject(err)
        return
      }
      const data = route.handle(config)
      const body: ApiEnvelope<unknown> = { code: 0, message: 'ok', data }
      const resp: AxiosResponse<ApiEnvelope<unknown>> = {
        data: body,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      }
      resolve(resp)
    }, delay)
  })
}

export interface DrawApiOptions {
  signal?: AbortSignal
}

export async function fetchDeck(opts: DrawApiOptions = {}): Promise<TarotCard[]> {
  return request<TarotCard[]>({
    url: '/api/tarot/deck',
    method: 'get',
    cancelKey: 'tarot:deck',
    adapter: mockAdapter,
    ...(opts.signal ? { signal: opts.signal } : {}),
  })
}

export async function drawCardsRemote(
  count: number,
  opts: DrawApiOptions = {},
): Promise<TarotCard[]> {
  if (count <= 0) return []
  return request<TarotCard[]>({
    url: '/api/tarot/draw',
    method: 'get',
    params: { count },
    cancelKey: 'tarot:draw',
    adapter: mockAdapter,
    ...(opts.signal ? { signal: opts.signal } : {}),
  })
}
