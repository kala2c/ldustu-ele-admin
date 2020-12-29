import router from '@/router'
import { constantRoutes, asyncRoutes } from "@/router"

export default {
    router: {
        router: router,
        constantRoutes,
        asyncRoutes,
        whiteList: ['/login'],
        defaultAction: '/login'
    },
    token: {
        tokenKey: 'tokenKey',
        driver: 'cookie',
        fetchUserInfo() {
            return {
                roles: ['weapp']
            }
        }
    },
}
