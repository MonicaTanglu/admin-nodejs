// import router from "@/router"
import store from './store/index'
import { Util } from '@/utils/util'
import { Router } from 'vue-router'
// import { useStore } from "vuex"

const whiteList = ['/user/login']
function updateAppRouter(constRoutes, router: Router, from, to, next) {
  store.dispatch('permission/UpdateAppRouter', { constRoutes }).then(() => {
    // router.addRoute(store.getters.routes)
    const routes = store.getters.routes
    for (const route of routes) {
      router.addRoute(route)
    }
    const path: string = from.query.redirect?.toString() || to.path
    const redirect = decodeURIComponent(path)
    // console.log(router.getRoutes(), 'routes')
    if (to.path === redirect || !redirect) {
      if (whiteList.indexOf(to.path) !== -1 || to.path === '/index') {
        next()
      } else
        next(to)

    } else {
      next({ path: redirect })
    }
  }).catch((err) => {
    console.log(err, 'catchErr')
    store.dispatch('user/Logout')
    next({ path: '/user/login', query: { redirect: to.fullPath } })
    //
  })
}
export function createRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    if (store && store.getters.permissionList.length === 0) {
      if (whiteList.indexOf(to.path) !== -1) {
        updateAppRouter([], router, from, to, next)
      } else {
        store.dispatch('user/GetPermissionList').then(res => {
          const menuData = res.result
          if (menuData === null || menuData === "" || menuData === undefined) {
            return
          }
          let constRoutes: object[] = []
          const utilClass = new Util()
          constRoutes = utilClass.generateIndexRouter(menuData)
          updateAppRouter(constRoutes, router, from, to, next)
          // store.dispatch('permission/UpdateAppRouter', { constRoutes }).then(() => {
          //   // router.addRoute(store.getters.routes)
          //   const routes = store.getters.routes
          //   for (const route of routes) {
          //     router.addRoute(route)
          //   }
          //   const path: string = from.query.redirect?.toString() || to.path
          //   const redirect = decodeURIComponent(path)
          //   if (to.path === redirect) {
          //     next()
          //   } else {
          //     next({ path: redirect })
          //   }
          // })
        }).catch((err) => {
          console.log(err, 'catchErr')
          store.dispatch('user/Logout')
          next({ path: '/user/login', query: { redirect: to.fullPath } })
          //
        })
      }


    } else {
      next()
    }
    // }

    // } else {

    // }

  })
}
