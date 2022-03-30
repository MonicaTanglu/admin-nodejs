import { Component } from 'vue';
interface MenuObject {
    path: string,
    name: string,
    // redirect: string,
    component: Component,
    hidden: boolean,
    meta: object,
    children?: MenuObject[]
}
export class Util {
    isURL(s) {
        return /^http[s]?:\/\/.*/.test(s)
    }
    generateIndexRouter(data): object[] {
        const indexRouter = [
            ...this.generateChildRouters(data)
        ]
        return indexRouter
    }
    generateChildRouters(data) {
        const routers: MenuObject[] = [];
        for (const item of data) {
            let component = "";
            if (item.component) {
                if (item.component && item.component.indexOf("layout") >= 0) {
                    component = item.component;
                } else {
                    component = "views/" + item.component;
                }
            }

            // eslint-disable-next-line
            // let URL = (item.meta.url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
            // if (this.isURL(URL)) {
            //     item.meta.url = URL;
            // }
            const componentPath = () => import('@/' + component + '.vue')
            const menu: MenuObject = {
                path: item.page_url,
                name: item.name,
                // redirect: item.redirect,
                component: componentPath,
                hidden: item.is_show === 1 ? false : true,
                meta: {
                    title: item.name,
                    icon: item.icon,
                    // url: item.meta.url,
                    // permissionList: item.meta.permissionList,
                    // keepAlive: item.meta.keepAlive,
                    /*update_begin author:wuxianquan date:20190908 for:赋值 */
                    // internalOrExternal: item.meta.internalOrExternal,
                    /*update_end author:wuxianquan date:20190908 for:赋值 */
                    // componentName: item.meta.componentName
                }
            }
            if (item.children && item.children.length > 0) {
                menu.children = [...this.generateChildRouters(item.children)];
            }
            //--update-begin----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
            //判断是否生成路由
            if (!item.component) {
                console.log(item)
                //console.log(' 不生成路由 item.route：  '+item.route);
                //console.log(' 不生成路由 item.path：  '+item.path);
            } else {
                routers.push(menu);
            }
        }
        //--update-end----author:scott---date:20190320------for:根据后台菜单配置，判断是否路由菜单字段，动态选择是否生成路由（为了支持参数URL菜单）------
        return routers
    }

}