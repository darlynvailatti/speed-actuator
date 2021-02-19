import Vue from 'vue';
import Vuex from 'vuex';
import { InterfaceSpeedActuatorStore } from './speed-actuator-store';
import { InterfaceSpeedSensorGatewayStore } from './speed-sensor-gateway-store';

Vue.use(Vuex);

export interface InterfaceRootState {
  speedActuator: InterfaceSpeedActuatorStore;
  speedSensorGateway: InterfaceSpeedSensorGatewayStore;
}

export default new Vuex.Store<InterfaceRootState>({});
