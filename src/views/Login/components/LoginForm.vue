<script setup lang="ts">
import { loginApi } from '@/api/auth'
import { fetchCaptchaApi } from '@/api/captcha'
import { useLocale } from '@/hooks/useLocale'
import { usePermissionStore } from '@/stores/permission'

import type { RouteRecordRaw } from 'vue-router'

const { t: $t } = useLocale()

const permissionStore = usePermissionStore()

const { addRoute, push } = useRouter()

const redirect = ref<string>('')

const formRef = ref()

const form = ref<LoginRequestType>({
  username: '',
  password: '',
  captchaKey: '',
  captchaValue: '',
})

const rules = reactive({
  username: [{ required: true, type: 'string', message: $t('login.usernamePlaceholder'), trigger: 'blur' }],
  password: [{ required: true, type: 'string', message: $t('login.passwordPlaceholder'), trigger: 'blur' }],
  captchaValue: [{ required: true, type: 'string', message: $t('login.captchaValuePlaceholder'), trigger: 'blur' }],
})

const loading = reactive({
  captchaValue: false,
  login: false,
})

const captchaImageData = ref<string>('')

const captchaKey = ref<string>('')

const initCaptchaKey = () => {
  captchaKey.value = new Date().getTime().toString()
}

initCaptchaKey()

const fetchCaptcha = async () => {
  loading.captchaValue = true
  const payload = {
    captchaKey: captchaKey.value,
    captchaType: 1,
  }
  const { data } = await fetchCaptchaApi(payload).catch(error => {
    loading.captchaValue = false
    throw error
  })
  captchaImageData.value = data
  loading.captchaValue = false
}

fetchCaptcha()

const inputStyle = 'padding-right:0px;'

// 登录
const signIn = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  loading.login = true
  form.value.captchaKey = captchaKey.value
  const res = await loginApi(form.value).catch(error => {
    loading.login = false
    throw error
  })
  loading.login = false
  if (res) {
    localStorage.setItem('token', res.data.accessToken)
    localStorage.setItem('tokenExpiration', res.data.accessTokenExpiration)
    await permissionStore.generateRoutes()
    permissionStore.getAddRouters.forEach(route => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}
</script>

<template>
  <div>
    <h1 class="text-center mb-5 font-bold text-2xl">
      {{ $t('login.login') }}
    </h1>
    <ElForm ref="formRef" :model="form" label-width="120px" label-position="top" size="large" :rules="rules">
      <ElFormItem :label="$t('login.username')" prop="username">
        <ElInput v-model="form.username" class="input-line" clearable :placeholder="$t('login.usernamePlaceholder')" />
      </ElFormItem>
      <ElFormItem :label="$t('login.password')" prop="password">
        <ElInput
          v-model="form.password"
          class="input-line"
          clearable
          type="password"
          show-password
          :placeholder="$t('login.passwordPlaceholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('login.captchaValue')" prop="captchaValue">
        <ElInput
          v-model="form.captchaValue"
          class="input-line-captcha"
          :placeholder="$t('login.captchaValuePlaceholder')"
          :input-style="inputStyle"
        >
          <template #suffix>
            <ElImage v-loading="loading.captchaValue" :src="captchaImageData" @click="fetchCaptcha" />
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>
    <ElButton :loading="loading.login" type="primary" class="w-[100%]" @click="signIn">
      {{ $t('login.login') }}
    </ElButton>
  </div>
</template>

<style scoped>
:deep .input-line-captcha .el-input__wrapper {
  padding-right: 0 !important;
}
</style>
