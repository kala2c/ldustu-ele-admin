import { Message } from 'element-ui'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false }) // NProgress配置

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export function generateRoutes(roles, asyncRoutes, constantRoutes) {
  return new Promise(resolve => {
    let accessedRoutes
    if (roles.includes('admin')) {
      accessedRoutes = asyncRoutes || []
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    }
    resolve(constantRoutes.concat(accessedRoutes))
  })
}

export default function (router, config) {

  const loginAction = '/login'
  const whiteList = config.whiteList || [loginAction] // 不需要权限验证的路由

  const asyncRoutes = config.asyncRoutes || []
  const constantRoutes = config.asyncRoutes || []

  const tokenKey = config.tokenKey || 'tokenKey'
  const getToken = config.getToken || function () {
    return localStorage.getItem(tokenKey)
  }
  const removeToken = config.removeToken || function () {
    localStorage.setItem(tokenKey, null)
  }

  const checkRole = config.checkRole || undefined
  const getRole = config.getRole || undefined

  router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start()

    console.log(router)

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
        // 是否具备用户角色
        const hasRoles = checkRole && checkRole || []
        if (hasRoles) {
          next()
        } else {
          try {
            // get user info
            // roles 是一个数组 例如: ['admin'] 或 ['developer','editor']
            const roles = getRole && getRole() || []

            // 解析用户角色可以打开的地址
            const accessRoutes = await generateRoutes(roles, asyncRoutes, constantRoutes)
            // 动态添加路由
            router.addRoutes(accessRoutes)

            // hack method to ensure that addRoutes is complete
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
