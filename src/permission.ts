import { usePermissionStore } from '@/stores/permission'
import router from './router'

export const initPermission = async () => {
  const permissionStore = usePermissionStore()

  const whiteList = ['/login'] // 不重定向白名单

  router.beforeEach(async (to, from, next) => {
    console.log(localStorage.getItem('token'))
    if (localStorage.getItem('token')) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        if (permissionStore.getIsAddRouters) {
          next()
          return
        }

        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach(route => {
          router.addRoute(route) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        const redirect = decodeURIComponent(redirectPath as string)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
        permissionStore.setIsAddRouters(true)
        next(nextData)
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      }
    }
  })

  router.afterEach(to => {})
}
