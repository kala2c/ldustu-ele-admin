import permission from './permission'
import { initState } from "./state"

export default {
  install: (Vue, config) => {
    initState(Vue, config)
    // 开启权限路由
    if (config.router) {
      const { router, constantRoutes, asyncRoutes, whiteList, defaultAction } = config.router
      permission(router, {constantRoutes, asyncRoutes, whiteList, defaultAction})
    }
  }
}
