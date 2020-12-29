import Cookies from 'js-cookie'
import { getConfig } from "../state"

function conf(key) {
    return getConfig('token')[key]
}

export function setToken(token) {
    const tokenKey = conf('tokenKey')
    if (conf('driver') === 'cookie') {
        return Cookies.set(tokenKey, token)
    } else {
        return localStorage.setItem(tokenKey, token)
    }
}

export function getToken() {
    const tokenKey = conf('tokenKey')
    if (conf('driver') === 'cookie') {
        return Cookies.get(tokenKey)
    } else {
        return localStorage.getItem(tokenKey)
    }

}

export function removeToken() {
    const tokenKey = conf('tokenKey')
    if (conf('driver') === 'cookie') {
        return Cookies.remove(tokenKey)
    } else {
        return localStorage.removeItem(tokenKey)
    }
}

export default {
    setToken,
    getToken,
    removeToken
}
