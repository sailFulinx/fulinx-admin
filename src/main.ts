// init preference
import { usePreferenceStore } from '@/stores/preference'
import { useCreateI18n } from '@/utils/i18n'
// ElementPlus
import ElementPlus from 'element-plus'

// pinia
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'
import { initPermission } from './permission'
import router from './router'

import './assets/main.css'

import '@unocss/reset/tailwind.css'
// 引入动画
import 'animate.css'
import 'element-plus/dist/index.css'
import 'virtual:uno.css'

const i18n = await useCreateI18n()

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.use(i18n)
app.mount('#app')

// 初始化权限
await initPermission()

// 初始化偏好设置
usePreferenceStore().getPreferences()
// 初始化系统语言
useInitLanguageList()
