import { Message } from 'element-ui'
import { removeToken, getToken} from '../utils/auth'

import eleAdminState from '../state'
// import { generateRoutes, hasPermission } from '../utils/permission'
import { hasPermission } from '../utils/permission'

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

export default function (router, config) {
  const loginAction = config.defaultAction || '/login'
  const whiteList = config.whiteList || [loginAction] // 不需要权限验证的路由
  // const asyncRoutes = config.asyncRoutes || []
  // const constantRoutes = config.asyncRoutes || []

  router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    // 设置页面标题
    document.title = to.meta && to.meta.title || ''

    // 确定用户是否已登录
    const hasLogin = getToken()

    if (hasLogin) {
      if (to.path === loginAction) {
        // 已经登录跳转到首页
        next({ path: '/' })
        NProgress.done()
      } else {
        // 验证用户是否具备权限
        const roles = eleAdminState.getRoles()
        const hasRoles = hasPermission(roles, to)
        if (hasRoles) {
          next()
        } else {
          try {
            // 动态添加路由
            await eleAdminState.setRoutes(router)
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (error) {
            // 移除token并重定向到登录页
            removeToken && removeToken()
            Message.error(error || '出错啦')
            next(`${loginAction}?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* 未登录 */
      if (whiteList.indexOf(to.path) !== -1) {
        // 白名单页面直接过
        next()
      } else {
        // 其他页面跳转到登录页
        next(`${loginAction}?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    // 关闭进度条
    NProgress.done()
  })

}
