export interface Notif {
  id: string
  type: string
  content: string
  time: string
  otherInfo?: {
    otherUserId?: number
  }
}
