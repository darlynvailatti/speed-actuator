import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import HighchartsVue from 'highcharts-vue';
import Toasted from 'vue-toasted';

Vue.use(HighchartsVue);
Vue.use(Toasted, {
  position: 'bottom-center',
  keepOnHover: true,
  duration: 5000,
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
