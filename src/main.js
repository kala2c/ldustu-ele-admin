import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './ldustu-ele-admin/styles/index.scss'
Vue.use(ElementUI)

import eleAdmin from './ldustu-ele-admin'
import config from './admin.config'
Vue.use(eleAdmin, config)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
