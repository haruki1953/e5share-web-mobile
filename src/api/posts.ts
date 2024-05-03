import request from '@/utils/request'
import type { ResData } from '@/types/api'

export const postsGetService = (e5id: number): ResData<string> =>
  request.get(`/e5post/posts/${e5id}`)

export const postsDelPostService = (e5id: number, uuid: string): ResData =>
  request.delete(`/e5post/post`, {
    params: {
      e5id,
      uuid
    }
  })

export const postsSendPostService = (e5id: number, content: string): ResData =>
  request.post(`/e5post/post`, { e5id, content })

export const postsClearPostService = (): ResData =>
  request.delete(`/e5post/posts`)
