export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
}

export interface NormalizedError {
  /** 业务码或 HTTP 状态码 */
  code: number | string
  message: string
  /** 是否由用户主动取消（AbortController） */
  canceled?: boolean
  /** 原始错误，调试用 */
  raw?: unknown
}
