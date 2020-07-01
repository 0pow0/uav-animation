import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import './assets/styles.less'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Ripple from 'vue-ripple-directive'
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import {VTable,VPagination} from 'vue-easytable'


Vue.use(Vuetify)
Vue.directive('ripple', Ripple);

window.Event = new class {
  constructor() {
    this.vue = new Vue();
  }

  fire(event, data = null) {
    this.vue.$emit(event, data);
  }

  fire2(event, data = null, data2 = null) {
    this.vue.$emit(event, data, data2);
  }

  listen(even, callback) {
    this.vue.$on(even, callback);
  }

}

Vue.config.productionTip = false
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
