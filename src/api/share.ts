import request from '@/utils/request'
import type { ResData } from '@/types/api'
import type { ShareInfo } from '@/types/share'
import type { Notif } from '@/types/notif'

export const shareRegisterService = (data: {
  subscriptionDate: string
  expirationDate: string
}): ResData => request.put(`/e5share/register`, data)

export const shareCancelService = (data: { message: string }): ResData =>
  request.put(`/e5share/cancel`, data)

export const shareGetInfoService = (): ResData<ShareInfo[]> =>
  request.get(`/e5share/info`)

export const shareAddInfoService = (data: {
  userId: number
  note: string
}): ResData<ShareInfo> => request.post(`/e5share/info`, data)

export const shareUpdateInfoService = (data: {
  userId: number
  note: string
}): ResData<ShareInfo> => request.patch(`/e5share/info`, data)

export const shareDeleteInfoService = (data: { userId: number }): ResData =>
  request.delete(`/e5share/info/${data.userId}`)

export const shareConfirmSendService = (data: {
  userId: number
  message: string
}): ResData<Notif> => request.put(`/e5share/confirmation/send`, data)

export const shareStopSharingService = (data: {
  userId: number
  message: string
}): ResData<Notif> => request.put(`/e5share/stop/sharing`, data)

export const shareConfirmAcceptService = (data: {
  e5id: number
  message: string
}): ResData<Notif> => request.put(`/e5share/confirmation/accept`, data)

export const shareApplicationService = (data: {
  e5id: number
  message: string
}): ResData<Notif> => request.post(`/e5share/application`, data)

export const shareStopReceivingService = (data: {
  e5id: number
  message: string
}): ResData<Notif> => request.put(`/e5share/stop/receiving`, data)
