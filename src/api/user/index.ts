import { request } from '@/api/http.ts'
export const loginApi = (data:never) => {
  return request<never>({
    url: '/user/login',
    method: 'post',
    data,
    cancelKey: 'login_request' // 核心防刷：无论手速多快狂点，上一个未完成的请求会被自动砍掉
  })
}
// 2. 注册接口
export const registerApi = (data:never) => {
  return request<string>({ // 结合你后端的改造，注册成功只返回 String 提示
    url: '/user/register',
    method: 'post',
    data,
    cancelKey: 'register_request'
  })
}
