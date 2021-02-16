import Vue from 'vue';
import Vuex from 'vuex';
import { InterfaceSpeedActuatorState } from './speed-actuator-store';
import { InterfaceSpeedSensorGatewayModule } from './speed-sensor-gateway-store';

Vue.use(Vuex);

export interface InterfaceRootState {
  speedActuator: InterfaceSpeedActuatorState;
  speedSensorGateway: InterfaceSpeedSensorGatewayModule;
}

export default new Vuex.Store<InterfaceRootState>({});
