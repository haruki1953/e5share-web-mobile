import type { AxiosResponse } from 'axios'

// api方法返回值类型的，dataType为返回数据的类型
export type ResData<DataType = undefined> = Promise<
  AxiosResponse<{
    code: number
    message: string
    data: DataType
  }>
>

// 对于登录接口，没有data属性，而是token
export type ResToken = Promise<
  AxiosResponse<{
    code: number
    message: string
    token: string
  }>
>
