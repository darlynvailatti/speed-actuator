import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import TestsView from '../views/TestsView.vue';
import TestView from '../views/TestView.vue';
import TestForm from '../views/TestForm.vue';
import SensorManagamentView from '../views/SensorManagementView.vue';
import SensorRawDataView from '../views/SensorRawDataView.vue';

Vue.use(VueRouter);

export const BASE_PATH = '/admin';
export const TESTS_VIEW_PATH = `${BASE_PATH}`;
export const TEST_VIEW_PATH = `${BASE_PATH}/test-view`;
export const TEST_FORM_PATH = `${BASE_PATH}/test`;
export const SENSOR_MANAGEMENT_PATH = `${BASE_PATH}/sensor-management`;
export const SENSOR_RAW_DATA_PATH = `${BASE_PATH}/sensor-raw-data`;

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: TestsView,
  },
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
  {
    path: SENSOR_MANAGEMENT_PATH,
    name: 'SensorManagament',
    component: SensorManagamentView,
  },
  {
    path: SENSOR_RAW_DATA_PATH,
    name: 'SensorRawData',
    component: SensorRawDataView,
  },
];

const router = new VueRouter({
  routes: routes,
  mode: 'history',
});
export default router;
