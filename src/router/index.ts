import { useLocale } from '@/hooks/useLocale'

import { Layout } from '@/utils/routerHelper'
import { createRouter, createWebHashHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const { t: $t } = useLocale()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true,
    },
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {},
      },
    ],
    meta: {
      hidden: true,
      noTagsView: true,
    },
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: $t('router.login'),
      noTagsView: true,
    },
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true,
    },
  },
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: $t('router.dashboard'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true,
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: $t('router.analysis'),
          noCache: true,
          affix: true,
        },
      },
    ],
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/list',
    name: 'Category',
    meta: {
      title: $t('router.category'),
      icon: 'ant-design:appstore-outlined',
    },
    children: [
      {
        path: 'list1',
        component: () => import('@/views/Category/index.vue'),
        name: 'CategoryList1',
        meta: {
          title: $t('router.category'),
          icon: 'ant-design:appstore-outlined',
          noCache: true,
        },
      },
      {
        path: 'list',
        component: () => import('@/views/Category/List.vue'),
        name: 'CategoryList',
        meta: {
          title: $t('router.category'),
          icon: 'ant-design:appstore-outlined',
          noCache: true,
        },
      },
      {
        path: '/category/create',
        component: () => import('@/views/Category/Create.vue'),
        name: 'CreateCategory',
        meta: {
          title: `${$t('common.create')}` + `${$t('category.name')}`,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/category',
          props: true,
        },
      },
      {
        path: '/category/edit/:id',
        component: () => import('@/views/Category/Edit.vue'),
        name: 'EditCategory',
        meta: {
          title: `${$t('common.edit')} ${$t('category.name')}`,
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/category',
          props: true,
        },
      },
    ],
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: {
      title: '内容管理',
      icon: 'bx:bxs-component',
      noCache: true,
      hidden: false,
      canTo: false,
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/Article/index.vue'),
        name: 'ArticleList',
        meta: {
          title: '内容列表',
          icon: 'ant-design:read-outlined',
        },
      },
      {
        path: 'create',
        component: () => import('@/views/Article/Create.vue'),
        name: 'CreateArticle',
        meta: {
          title: '内容新增',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/article',
          props: false,
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/Article/Edit.vue'),
        name: 'EditArticle',
        meta: {
          title: '内容修改',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/article',
          props: true,
        },
      },
    ],
  },
  {
    path: '/theme',
    component: Layout,
    redirect: '/theme/list',
    name: 'Theme',
    meta: {
      title: '主题管理',
      icon: 'bx:bxs-component',
      noCache: true,
      hidden: false,
      canTo: false,
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/Theme/index.vue'),
        name: 'ThemeList',
        meta: {
          title: '主题列表',
          icon: 'ant-design:gold-outlined',
        },
      },
      {
        path: 'create',
        component: () => import('@/views/Theme/Create.vue'),
        name: 'CreateTheme',
        meta: {
          title: '主题新增',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/Theme',
          props: false,
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/Theme/Edit.vue'),
        name: 'EditTheme',
        meta: {
          title: '主题修改',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/Theme',
          props: true,
        },
      },
      {
        path: 'setting/:id',
        component: () => import('@/views/Theme/Components/ComponentSetting.vue'),
        name: 'EditThemeComponent',
        meta: {
          title: '主题组件设置',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/Theme',
          props: true,
        },
      },
    ],
  },
  {
    path: '/site',
    component: Layout,
    redirect: '/site/list',
    name: 'Site',
    meta: {
      title: '网站管理',
      icon: 'bx:bxs-component',
      noCache: true,
      hidden: false,
      canTo: false,
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/Site/index.vue'),
        name: 'SiteList',
        meta: {
          title: '网站列表',
          icon: 'ant-design:cloud-server-outlined',
        },
      },
      {
        path: 'create',
        component: () => import('@/views/Site/Create.vue'),
        name: 'CreateSite',
        meta: {
          title: '网站新增',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/Site',
          props: false,
        },
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/Site/Edit.vue'),
        name: 'EditSite',
        meta: {
          title: '网站修改',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/Site',
          props: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
