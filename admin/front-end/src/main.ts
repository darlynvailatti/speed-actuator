import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io';
import HighchartsVue from 'highcharts-vue';
import { getBackendUrl } from './constants/utils';

Vue.config.productionTip = false;
console.log('Building app' + window.location.host);

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: getBackendUrl(), //Optional options
  }),
);

Vue.use(HighchartsVue);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
