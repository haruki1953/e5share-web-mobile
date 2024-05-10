import type { FieldRule } from 'vant'
// 用户相关信息的验证规则
export const userRules: Record<
  'username' | 'email' | 'password' | 'nickname' | 'contactInfo' | 'bio',
  FieldRule[]
> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'onBlur' },
    {
      pattern: /^[a-zA-Z0-9_]{1,32}$/,
      message: '用户名必须是 1-32位 的字符，只能包含字母数字下划线',
      trigger: 'onBlur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'onBlur' },
    {
      pattern: /^.+@.+\..+$/,
      message: '请输入正确的邮箱格式',
      trigger: 'onBlur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'onBlur' },
    {
      pattern: /^[a-zA-Z0-9_]{6,32}$/,
      message: '密码必须是 6-32位 的字符，只能包含字母数字下划线',
      trigger: 'onBlur'
    }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'onBlur' },
    {
      pattern: /^.{0,32}$/,
      message: '昵称长度不能超过32个字符',
      trigger: 'onBlur'
    }
  ],
  contactInfo: [
    {
      pattern: /^.{0,500}$/,
      message: '联系信息长度不能超过500个字符',
      trigger: 'onBlur'
    }
  ],
  bio: [
    {
      pattern: /^.{0,500}$/,
      message: '简介长度不能超过500个字符',
      trigger: 'onBlur'
    }
  ]
}

// 头像的规则
export const avatarRule = {
  // 允许的文件类型
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  typeError: '请选择 jpg、png 或 gif 格式的图片文件',
  // 允许的大小
  maxSize: 2 * 1024 * 1024,
  sizeError: '图片文件大小不能超过 2MB'
}

// 分享相关信息的验证规则
export const shareRules: Record<'message' | 'note', FieldRule[]> = {
  message: [
    {
      pattern: /^.{0,500}$/,
      message: '留言长度不能超过500个字符',
      trigger: 'onBlur'
    }
  ],
  note: [
    {
      pattern: /^.{0,500}$/,
      message: '备注长度不能超过500个字符',
      trigger: 'onBlur'
    }
  ]
}
