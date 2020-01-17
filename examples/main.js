import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routers from './router'
import eMap from '../packages/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(eMap)
Vue.use(ElementUI)
const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: routers
})
new Vue({
  el: '#app',
  router,
  render: h => h(App),
}).$mount('#app')