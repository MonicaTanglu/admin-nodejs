const getters = {
    token: state => state.user.token,
    userInfo: (state) => {
        if (state.user.userInfo) return state.user.userInfo
        else {
            let userInfo = localStorage.getItem('userInfo')
            if (userInfo) return JSON.parse(userInfo)
        }
        return ''
    },
    permissionList: state => state.user.permissionList,
    addRoutes: state => state.permission.addRoutes,
    routes: state => state.permission.routes

}

export default getters