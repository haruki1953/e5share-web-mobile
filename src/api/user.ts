import type { ResData } from '@/types/api'
import type { ProfileRes } from '@/types/user'
import request from '@/utils/request'

export const userGetInfoService = (): ResData<ProfileRes> =>
  request.get('/user/profile')

export const userUpdateProfileService = (data: {
  nickname: string
  contactInfo: string
  bio: string
}): ResData => request.patch('/user/profile', data)

export const userUpdateAvatarService = (data: FormData): ResData =>
  request.put('/user/avatar', data)

export const userUpdateEmailService = (data: { email: string }): ResData =>
  request.put('/user/email', data)

export const userUpdatePasswordService = (data: {
  oldPassword: string
  newPassword: string
}): ResData => request.put('/user/password', data)

export const userUpdateE5infoService = (data: {
  subscriptionDate: string
  expirationDate: string
}): ResData => request.put('/user/e5info', data)

export const userClearNotifService = (): ResData =>
  request.delete('/user/notifications')

export const userGetLastLoginTimeService = (userId: number): ResData<string> =>
  request.get(`/user/last-login/${userId}`)

export const userDeleteUserService = (): ResData => request.delete('/user')
