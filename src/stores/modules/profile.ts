import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userGetInfoService } from '@/api/user'
import { parseUserInfo, parseUserNotification } from '@/utils/resDataHandle'
import type { User } from '@/types/user'
import type { Notif } from '@/types/notif'
import { useRoute, useRouter } from 'vue-router'
import { useShareStore, useUsersStore } from '..'

// 用户信息模块
export const useProfileStore = defineStore(
  'e5mobile-profile',
  () => {
    // 用户信息
    const user = ref<User>()

    // 通知
    const notifications = ref<Notif[]>([])
    // 已读通知uuid
    const readNotifUuid = ref<string[]>([])
    // 重要通知
    const importantNotif = ref<Notif>()

    // 请求获取用户信息
    const getProfile = async () => {
      const res = await userGetInfoService() // 请求获取数据

      // 解析用户信息
      user.value = parseUserInfo(res.data.data)

      // 解析通知信息
      notifications.value = parseUserNotification(res.data.data)

      // 检查重点通知
      checkImportantNotif()
    }

    // 清除信息
    const removeProfile = () => {
      user.value = undefined
      notifications.value = []
      readNotifUuid.value = []
      importantNotif.value = undefined
    }

    // 获取未读通知数
    const unreadNotifCount = computed(() => {
      return notifications.value?.filter(
        (notification) => !readNotifUuid.value?.includes(notification.id)
      ).length
    })

    // 判断通知是否已读
    const isNotifRead = (id: string) => {
      return readNotifUuid.value?.includes(id)
    }
    // 设置单个通知为已读
    const markNotifAsRead = (id: string) => {
      // 不是已读再设置
      if (!isNotifRead(id)) {
        readNotifUuid.value?.push(id)
      }
    }

    // 设置全部通知为已读
    const markAllNotifAsRead = () => {
      if (!unreadNotifCount.value) return // 没有未读则返回
      readNotifUuid.value = notifications.value?.map(
        (notification) => notification.id
      )
    }

    // 根据id查找通知
    const findNotifById = (id: string) => {
      return notifications.value?.find((notif) => notif.id === id)
    }

    const route = useRoute()
    const router = useRouter()
    // const profileStore = useProfileStore()
    const shareStore = useShareStore()
    const usersStore = useUsersStore()
    // 检查重点通知
    const checkImportantNotif = async () => {
      // 根据路由参数查找重点通知
      const notifUuid = route.query.notif
      // 【test】
      // console.log('notifUuid', notifUuid, typeof notifUuid)
      // console.log(route.query)

      if (!notifUuid || typeof notifUuid !== 'string') return
      const notif = findNotifById(notifUuid)
      // 如果找到则将其保存在重点通知
      if (notif) {
        importantNotif.value = notif
        // 跳转至通知页
        router.push('/notif')
        return
      }

      // TODO 找不到则在 applyInfo confirmInfo 中寻找
      const applyInfo = shareStore.findApplyInfoByUuid(notifUuid)
      // 如果找到则弹出通知提示
      if (applyInfo) {
        const user = usersStore.findUserById(applyInfo.userId)
        // 确保用户存在
        if (user) {
          showNotify({
            message: `这是您与 @${user.username} 的分享申请链接`,
            type: 'primary'
          })
          return
        }
      }
      const confirmInfo = shareStore.findConfirmInfoByUuid(notifUuid)
      // 如果找到则弹出通知提示
      if (confirmInfo) {
        const user = usersStore.findUserById(confirmInfo.userId)
        if (user) {
          // 确保用户存在
          showNotify({
            message: `这是您与 @${user.username} 的分享确认链接`,
            type: 'primary'
          })
        }
        return
      }

      showNotify({
        message: '链接无效',
        type: 'warning'
      })
    }

    return {
      user,
      notifications,
      readNotifUuid,
      getProfile,
      removeProfile,
      unreadNotifCount,
      isNotifRead,
      markNotifAsRead,
      markAllNotifAsRead,
      findNotifById,
      importantNotif,
      checkImportantNotif
    }
  },
  {
    persist: {
      // 选择性持久化，不持久化importantNotif
      paths: ['user', 'notifications', 'readNotifUuid']
    }
  }
)
