import { generateRoutes } from '../utils/permission'
import Cookies from 'js-cookie'

export function getState(namespace) {
    namespace = namespace || 'all'
    if (namespace === 'all') {
        return window.$eleAdmin.state
    } else {
        if (window.$eleAdmin.state[namespace]) {
            return window.$eleAdmin.state[namespace]
        } else {
            throw new Error('状态项不存在')
        }
    }
}
export function getConfig(namespace) {
    namespace = namespace || 'all'
    if (namespace === 'all') {
        return window.$eleAdmin.config
    } else {
        if (window.$eleAdmin.config[namespace]) {
            return window.$eleAdmin.config[namespace]
        } else {
            throw new Error('配置项不存在')
        }
    }
}

export function setState(namespace, key, value) {
    if (window.$eleAdmin === undefined || window.$eleAdmin === null) {
        throw new Error('请先Vue.use引入eleAdmin')
    }
    if (!window.$eleAdmin.state) {
        throw new Error('请先初始化state')
    }
    if (window.$eleAdmin.state[namespace]) {
        window.$eleAdmin.state[namespace][key] = value
    } else {
        window.$eleAdmin.state[namespace] = {}
        window.$eleAdmin.state[namespace][key] = value
    }
}

const actions = {
    /**
     * 打开左侧菜单栏
     */
    openSidebar() {
        setState('sidebar', 'withoutAnimation', false)
        setState('sidebar', 'opened', true)
        Cookies.set('sidebarStatus', 1)
    },
    /**
     * 关闭左侧菜单栏
     */
    closeSidebar(options) {
        options = options || {withoutAnimation: true}
        setState('sidebar', 'withoutAnimation', options.withoutAnimation)
        setState('sidebar', 'opened', false)
        Cookies.set('sidebarStatus', 0)
    },
    toggleDevice(device) {
        setState('app', 'device', device)
    },
    async setRoutes(router) {
        const roles = actions.getRoles()
        const { asyncRoutes, constantRoutes } = getConfig('router')
        const accessRoutes = await generateRoutes(roles, asyncRoutes, constantRoutes)
        router.addRoutes(accessRoutes)
        setState('permission', 'routes', accessRoutes)
    },
    getRoutes() {
        return getState('permission').routes
    },
    setRoles(roles) {
        setState('permission', 'roles', roles)
    },
    getRoles() {
        return getState('permission').roles
    }
}

export function initState(Vue, config) {
    window.$eleAdmin = new Vue({
        data: {
            state: {
                app: {
                    device: 'desktop',
                    fixedHeader: true
                },
                sidebar: {
                    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,   //控制菜单栏开闭
                    withoutAnimation: false, //开关菜单时的动画
                },
                permission: {
                    routes: [],
                    roles: []
                }
            },
            config: config
        }
    })
    //执行初始化操作
    if (config.token) {
        const fetchUserInfo = config.token.fetchUserInfo
        if (fetchUserInfo) {
            const userInfo = fetchUserInfo()
            actions.setRoles(userInfo.roles)
            actions.setRoutes(config.router.router)
        }
    }
}

export default {
    ...actions
}
