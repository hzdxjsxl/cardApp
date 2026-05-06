import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { ApiEnvelope, NormalizedError } from '@/types/api'
import { useUserStore } from '@/stores/user'
const REQUEST_TIMEOUT = 10_000

const instance: AxiosInstance = axios.create({
  baseURL: '/nomock',
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
})

instance.interceptors.request.use(
  (config) => {
    // 这里可以塞 token / 埋点 trace-id，预留口子但当前业务不需要
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (err) => Promise.reject(normalize(err)),
)

instance.interceptors.response.use(
  (resp) => resp,
  (err) => Promise.reject(normalize(err)),
)

function normalize(err: unknown): NormalizedError {
  if (axios.isCancel(err)) {
    return { code: 'CANCELED', message: '请求已取消', canceled: true, raw: err }
  }
  if (err instanceof AxiosError) {
    if (err.code === 'ECONNABORTED') {
      return { code: 'TIMEOUT', message: '请求超时，请稍后重试', raw: err }
    }
    const status = err.response?.status
    if (status) {
      const apiData = err.response?.data as Partial<ApiEnvelope<unknown>> | undefined
      const message = apiData?.message || err.message || '请求失败'
      return { code: apiData?.code ?? status, message, raw: err }
    }
    return { code: 'NETWORK', message: '网络异常，请检查连接', raw: err }
  }
  if (err instanceof Error) {
    return { code: 'UNKNOWN', message: err.message, raw: err }
  }
  return { code: 'UNKNOWN', message: '未知错误', raw: err }
}

/**
 * 业务请求统一入口。
 * - 自动剥壳 ApiEnvelope.data
 * - code !== 0 视为业务失败
 * - 同名 key 的请求会取消上一次（避免抽牌按钮连点重复发请求）
 */
const pendingMap = new Map<string, AbortController>()

export interface RequestOptions<TBody = unknown> extends AxiosRequestConfig<TBody> {
  /** 用于去重的 key；为空则不参与去重 */
  cancelKey?: string
}

export async function request<TData, TBody = unknown>(
  options: RequestOptions<TBody>,
): Promise<TData> {
  const { cancelKey, ...rest } = options
  if (cancelKey) {
    pendingMap.get(cancelKey)?.abort()
    const controller = new AbortController()
    pendingMap.set(cancelKey, controller)
    rest.signal = controller.signal
  }

  try {
    const resp = await instance.request<ApiEnvelope<TData>>(rest)
    const body = resp.data
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code !== 200) {
        const e: NormalizedError = { code: body.code, message: body.message || '操作失败' }
        throw e
      }
      return body.data as TData
    }
    return resp.data as unknown as TData
  } finally {
    if (cancelKey) pendingMap.delete(cancelKey)
  }
}

export { instance as http }
