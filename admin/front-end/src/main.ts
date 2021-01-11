import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3001', //Optional options
  }),
);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
