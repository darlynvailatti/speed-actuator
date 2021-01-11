import Vue from 'vue';
import Vuex from 'vuex';
import { InterfaceSpeedActuatorState } from './speed-actuator-store';

Vue.use(Vuex);

export interface InterfaceRootState {
  speedActuator: InterfaceSpeedActuatorState;
}

export default new Vuex.Store<InterfaceRootState>({});
