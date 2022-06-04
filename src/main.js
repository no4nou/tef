import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueCardFormat from 'vue-credit-card-validation'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ColorPicker from 'vue-color-picker-simple'
import 'vue-color-picker-simple/dist/index.css'

Vue.config.productionTip = false
Vue.use(VueCardFormat)
Vue.use(VueAxios, axios)
Vue.use(ColorPicker)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
