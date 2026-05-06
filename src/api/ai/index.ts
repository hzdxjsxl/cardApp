import { request } from '@/api/http.ts'
interface TarotAnalyzeParams {
  cards: {
    name: string;
    position: string;
    label: string;
  }[]
}
// 2. 将 any 替换为刚才定义的接口，并修正 request 的泛型
export const analyzeStreamApi = (data: TarotAnalyzeParams) => {
  // 注意：这里的 request<any> 是为了让它能返回 ReadableStream 流对象
  // 如果 ESLint 还是报错，可以写成 request<ReadableStream> 或 request<unknown>
  return request<ReadableStream>({
    url: '/ai/analyze-stream',
    method: 'post',
    data,
    responseType: 'stream',
    adapter: 'fetch',
    timeout: 0,
    cancelKey: 'analyze_stream_request'
  })
}
