import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './assets/styles.less'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Ripple from 'vue-ripple-directive'

Vue.use(Vuetify)
Vue.directive('ripple', Ripple);

window.Event = new class {
  constructor() {
    this.vue = new Vue();
  }

  fire(event, data = null) {
    this.vue.$emit(event, data);
  }

  listen(even, callback) {
    this.vue.$on(even, callback);
  }

}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
