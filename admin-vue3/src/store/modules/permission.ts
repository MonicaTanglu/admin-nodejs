import { constantRouterMap } from '@/router'


const permission = {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: []
  },


  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRouterMap.concat(routes)
    }
  },
  actions: {
    UpdateAppRouter({ commit }, routes) {
      return new Promise((resolve) => {
        const routeList = routes.constRoutes
        commit('SET_ROUTES', routeList)
        resolve(true)
      })
    }
  }

}

export default permission