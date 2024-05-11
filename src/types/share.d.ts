export interface ShareInfo {
  id: string
  userId: number
  note: string
  status: string
  time: string
}

export interface LinkInfo {
  userId: number
  notifUuid: string
  link: string
  time: Date
}

export interface E5Date {
  subscriptionDate: string
  expirationDate: string
}
