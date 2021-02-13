import { getModule, Module, VuexModule } from 'vuex-module-decorators';
import store from '@/store/index';

@Module({
  dynamic: true,
  name: 'speed-actuator-module',
  store,
})
class SpeedSensorGatewayModule extends VuexModule {}

export const speedSensorGatewayStoreModule = getModule(
  SpeedSensorGatewayModule,
);
