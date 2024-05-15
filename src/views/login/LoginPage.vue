<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  authRegisterService,
  authLoginByUsernameService,
  authLoginByEmailService
} from '@/api/auth.js'
import { useAuthStore } from '@/stores'
import { adminContact, loginImage } from '@/config'
import { userRules } from '@/config/rules'
import type { FieldRule, FormInstance } from 'vant'
import { loadAllData } from '@/utils/dataManage'

const isRegister = ref(false)

// 表单组件
const form = ref<FormInstance>()

// 整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  email: '',
  password: '',
  repassword: '',
  // 选择是否为邮箱登录
  isLoginByEmail: false
})

const rules: Record<'repassword', FieldRule[]> & typeof userRules = {
  ...userRules,
  repassword: [
    {
      validator: (value: string) => value === formModel.value.password,
      message: '两次输入密码不一致',
      trigger: 'onBlur'
    }
  ]
}

// 注册
const isRegistering = ref(false) // 标记状态
const register = async () => {
  // 设置为注册中状态
  isRegistering.value = true
  try {
    // 注册成功之前，先进行校验，校验成功 → 请求，校验失败 → 自动提示
    await form.value?.validate()
    await authRegisterService(formModel.value)
    showToast('注册成功')
    isRegister.value = false
  } finally {
    // 无论注册成功或失败，都要解除注册中状态
    isRegistering.value = false
  }
}

const authStore = useAuthStore()
const router = useRouter()

// 登录
const isLogingIn = ref(false) // 标记状态
const login = async () => {
  isLogingIn.value = true
  try {
    await form.value?.validate()
    let res
    // 根据 isLoginByEmail 选择调用的登陆方式
    if (formModel.value.isLoginByEmail) {
      res = await authLoginByEmailService(formModel.value)
    } else {
      // eslint-disable-next-line no-unused-vars
      res = await authLoginByUsernameService(formModel.value)
    }
    // 保存token
    authStore.setToken(res.data.token)
    // 跳转至首页
    await router.replace('/home')
    // 请求数据
    loadAllData()
    showToast('登录成功')
  } finally {
    // 无论成功或失败，都要解除状态
    isLogingIn.value = false
  }
}

// 点击忘记密码时弹出的消息
const forgotPasswordMessage = () => {
  showToast(`请联系管理员 ${adminContact}`)
}

watch(isRegister, () => {
  formModel.value = {
    ...formModel.value,
    username: '',
    email: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <div class="bg" :style="{ backgroundImage: `url(${loginImage})` }"></div>
  <div class="login-form">
    <van-form ref="form" v-if="isRegister">
      <h1 class="title">注册</h1>
      <van-cell-group inset>
        <van-field
          left-icon="user-o"
          v-model="formModel.username"
          name="username"
          placeholder="请输入用户名"
          :rules="rules.username"
        />
        <van-field
          left-icon="envelop-o"
          v-model="formModel.email"
          name="email"
          placeholder="请输入邮箱"
          :rules="rules.email"
        />
        <van-field
          left-icon="lock"
          v-model="formModel.password"
          name="password"
          placeholder="请输入密码"
          :rules="rules.password"
        />
        <van-field
          left-icon="lock"
          v-model="formModel.repassword"
          name="rePassword"
          placeholder="请再次输入密码"
          :rules="rules.repassword"
        />
      </van-cell-group>
      <div class="submit-button">
        <van-button
          round
          block
          type="primary"
          @click="register"
          loading-text="注册中..."
          :loading="isRegistering"
        >
          注册
        </van-button>
      </div>
      <div class="submit-button">
        <van-button round block @click="isRegister = false">
          ← 返回
        </van-button>
      </div>
    </van-form>
    <van-form ref="form" v-else>
      <h1 class="title">登录</h1>
      <van-cell-group inset>
        <van-field
          left-icon="envelop-o"
          v-model="formModel.email"
          name="email"
          placeholder="请输入邮箱"
          :rules="rules.email"
          v-if="formModel.isLoginByEmail"
        />
        <van-field
          left-icon="user-o"
          v-model="formModel.username"
          name="username"
          placeholder="请输入用户名"
          :rules="rules.username"
          v-else
        />
        <van-field
          left-icon="lock"
          v-model="formModel.password"
          type="password"
          name="password"
          placeholder="请输入密码"
          :rules="rules.password"
        />

        <van-cell class="checkbox-button-cell">
          <van-checkbox v-model="formModel.isLoginByEmail">
            邮箱登录
          </van-checkbox>
          <van-button type="primary" size="mini" @click="forgotPasswordMessage">
            忘记密码
          </van-button>
        </van-cell>
      </van-cell-group>
      <div class="submit-button">
        <van-button
          round
          block
          type="primary"
          @click="login"
          loading-text="登录中..."
          :loading="isLogingIn"
        >
          登录
        </van-button>
      </div>
      <div class="submit-button">
        <van-button round block @click="isRegister = true"> 注册 → </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.bg {
  height: 200px;
  // background: url('@/assets/login_bg.jpg') no-repeat center / cover;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  border-radius: 0 0 20px 20px;
}
.title {
  margin-left: 30px;
  font-size: 30px;
  color: var(--my-color-b1);
}
.submit-button {
  margin: 20px;
}

.checkbox-button-cell {
  :deep() {
    .van-cell__value {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
