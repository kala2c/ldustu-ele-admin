import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './ldustu-ele-admin/styles/index.scss'
Vue.use(ElementUI)

Vue.config.productionTip = false

import admin from './ldustu-ele-admin'

const config = {
  whiteList: ['/login', '/hello'],
}

admin.permission(router, config)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
