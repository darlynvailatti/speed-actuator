import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import TestsView from '@/views/TestsView.vue';
import TestView from '@/views/TestView.vue';
import TestForm from '@/views/TestForm.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'TestsView',
    component: TestsView,
  },
  {
    path: '/test-view/:test_code',
    name: 'TestView',
    component: TestView,
  },
  {
    path: '/test',
    name: 'TestForm',
    component: TestForm,
  },
];

const router = new VueRouter({
  routes: routes,
  mode: 'history',
});

export default router;
