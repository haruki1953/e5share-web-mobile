import request from '@/utils/request'
import type { ResData } from '@/types/api'
import type { UserRes } from '@/types/user'

export const publicGetUsersService = (): ResData<UserRes[]> =>
  request.get('/public/users')
