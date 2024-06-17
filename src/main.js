import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/css/global.css'

Vue.config.productionTip = false
const user = localStorage.getItem('user');
if (user) {
  store.dispatch('login', JSON.parse(user));
}
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
