import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import TestsView from '../views/TestsView.vue';
import TestView from '../views/TestView.vue';
import TestForm from '../views/TestForm.vue';

Vue.use(VueRouter);

export const BASE_PATH = '/admin';
export const TESTS_VIEW_PATH = `${BASE_PATH}`;
export const TEST_VIEW_PATH = `${BASE_PATH}/test-view`;
export const TEST_FORM_PATH = `${BASE_PATH}/test`;

const routes: Array<RouteConfig> = [
  {
    path: `${TESTS_VIEW_PATH}`,
    name: 'TestsView',
    component: TestsView,
  },
  {
    path: `${TEST_VIEW_PATH}/:test_code`,
    name: 'TestView',
    component: TestView,
  },
  {
    path: TEST_FORM_PATH,
    name: 'NewTest',
    component: TestForm,
  },
  {
    path: `${TEST_FORM_PATH}/:test_code`,
    name: 'EditTest',
    component: TestForm,
  },
];

const router = new VueRouter({
  routes: routes,
  mode: 'history',
});
export default router;
