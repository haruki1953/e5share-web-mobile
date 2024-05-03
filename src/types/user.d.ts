import type { Notif } from './notif'

// 返回响应的用户数据
export interface UserRes {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  contact_info: string | null
  bio: string | null
  registered_at: string
  last_login: string
  account_status: string
  e5_subscription_date: string | null
  e5_expiration_date: string | null
  helping_users: string
  helped_users: string
  helping_by_users: string
  helped_by_users: string
}

// 处理后的用户数据
export interface User {
  id: number
  username: string
  email: string
  nickname: string
  avatar: string
  contact_info: string
  bio: string
  registered_at: string
  last_login: string
  account_status: string
  e5_subscription_date: string | null
  e5_expiration_date: string | null
  helping_users: number[]
  helped_users: number[]
  helping_by_users: number[]
  helped_by_users: number[]
}

// 用户个人信息响应数据
export interface ProfileRes extends UserRes {
  notifications: string
}
