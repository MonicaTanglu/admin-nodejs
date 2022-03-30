import { createRouter, createWebHistory } from 'vue-router'
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
// import { markRyaw, h } from 'vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/index',
  //   name: 'Index',
  //   meta: {
  //     title: '首页',
  //     affix: true,
  //     icon: 'icon-home',
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Index',
  //       component: () => import('@/views/index/index.vue'),
  //       meta: {
  //         title: '首页',
  //         affix: true,
  //         icon: 'icon-home'
  //       },
  //     },
  //   ],
  // },
  {
    path: '/demo',
    component: Layout,
    name: 'Demo',
    redirect: '/demo/table',
    meta: {
      title: '组件',
      icon: 'icon-wallet',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/demo/table/index.vue'),
        meta: {
          title: '表格',
          icon: 'table-2',
        },
      },
      {
        path: 'icon',
        name: 'Icon',
        component: () => import('@/views/demo/icon/index.vue'),
        meta: {
          title: '图标',
          icon: 'remixicon-line',
        },
      },
    ],
  },
  {
    path: '/user/login',
    name: 'login',
    component: () => import('@/views/user/Login.vue'),
  },
  {
    path: '/error',
    name: 'Error',
    component: Layout,
    redirect: '/error/403',
    meta: {
      title: '错误页',
      icon: 'icon-error',
    },
    children: [
      {
        path: '403',
        name: 'Error403',
        component: () => import('@/views/error/403.vue'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/error/404.vue'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
    ],
  },
  {
    path: '/echart',
    component: Layout,
    name: 'echart',
    redirect: '/echart/bar',
    meta: {
      title: 'echart',
      icon: 'icon-areachart',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'bar',
        name: 'Bar',
        component: () => import('@/views/echart/bar/index.vue'),
        meta: {
          title: 'bar',
          icon: 'test-tube-line',
          roles: ['admin', 'editor']
        },
      },
      {
        path: 'line',
        name: 'Line',
        component: () => import('@/views/echart/line/index.vue'),
        meta: {
          title: 'line',
          icon: 'test-tube-line',
          roles: ['admin', 'editor']
        },
      },
      {
        path: 'pie',
        name: 'Pie',
        component: () => import('@/views/echart/pie/index.vue'),
        meta: {
          title: 'pie',
          icon: 'test-tube-line',
        },
      },
    ],
  },
  {
    path: '/system',
    name: '系统',
    component: Layout,
    redirect: '/system/account/index.vue',
    meta: {
      title: 'system',
      icon: 'icon-setting',
      roles: ['admin', 'editor']
    },
    children: [
      // {
      //   path: 'account',
      //   name: 'account',
      //   component: () => import('@/views/system/account/index.vue'),
      //   meta: {
      //     title: 'account',
      //     icon: 'account',
      //     roles: ['editor']
      //   }

      // },
      // {
      //   path: 'group',
      //   name: 'group',
      //   component: () => import('@/views/system/group/index.vue'),
      //   meta: {
      //     title: 'group',
      //     icon: 'group',
      //     roles: ['admin']
      //   }
      // },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
        }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/error',
    name: 'Error',
    component: Layout,
    redirect: '/error/403',
    meta: {
      title: '错误页',
      icon: 'error-warning-line',
    },
    children: [
      {
        path: '403',
        name: 'Error403',
        component: () => import('@/views/error/403.vue'),
        meta: {
          title: '403',
          icon: 'error-warning-line',
        },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/error/404.vue'),
        meta: {
          title: '404',
          icon: 'error-warning-line',
        },
      },
    ],
  },
  {
    path: '/echart',
    component: Layout,
    name: 'echart',
    redirect: '/echart/bar',
    meta: {
      title: '动态路由测试',
      icon: 'test-tube-line',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'bar',
        name: 'Bar',
        component: () => import('@/views/echart/bar/index.vue'),
        meta: {
          title: '路由测试1',
          icon: 'test-tube-line',
          roles: ['admin', 'editor']
        },
      },
      {
        path: 'line',
        name: 'Line',
        component: () => import('@/views/echart/line/index.vue'),
        meta: {
          title: '路由测试2',
          icon: 'test-tube-line',
          roles: ['admin', 'editor']
        },
      },
      {
        path: 'pie',
        name: 'Pie',
        component: () => import('@/views/echart/pie/index.vue'),
        meta: {
          title: '路由测试3',
          icon: 'test-tube-line',
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: '/system/account/index.vue',
    meta: {
      title: '系统管理',
      icon: 'system',
      roles: ['admin', 'editor']
    },
    children: [
      // {
      //   path: 'account',
      //   name: 'account',
      //   component: () => import('@/views/system/account/index.vue'),
      //   meta: {
      //     title: 'account',
      //     icon: 'account',
      //     roles: ['editor']
      //   }

      // },
      // {
      //   path: 'group',
      //   name: 'group',
      //   component: () => import('@/views/system/group/index.vue'),
      //   meta: {
      //     title: 'group',
      //     icon: 'group',
      //     roles: ['admin']
      //   }
      // }
    ]

  }
]

export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Index',
    meta: {
      title: '首页',
      affix: true,
      icon: 'icon-home',
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index.vue'),
        meta: {
          title: '首页',
          affix: true,
          icon: 'icon-home'
        },
      },
    ],
  },
  {
    path: '/user/login',
    hidden: true,
    component: () => import('@/views/user/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRouterMap,
})



export default router