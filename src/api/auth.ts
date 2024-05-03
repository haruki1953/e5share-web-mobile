import request from '@/utils/request'
import type { ResData, ResToken } from '@/types/api'

export const authRegisterService = (data: {
  username: string
  password: string
  email: string
}): ResData => request.post('/auth/register', data)

export const authLoginByUsernameService = (data: {
  username: string
  password: string
}): ResToken => request.post('/auth/login/username', data)

export const authLoginByEmailService = (data: {
  email: string
  password: string
}): ResToken => request.post('/auth/login/email', data)
