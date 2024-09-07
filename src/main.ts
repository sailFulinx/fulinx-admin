// init preference
import { usePreferenceStore } from '@/stores/preference'
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

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.mount('#app')

// 初始化权限
await initPermission()

// 初始化偏好设置
usePreferenceStore().getPreferences()
// 初始化系统语言
useInitLanguageList()
