import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from 'vuex-module-decorators';
import store from '@/store/index';
import {
  subscribeOnDetectionChannel,
  subscribeOnSensorStateChannel,
} from '../service/socket-service';
import { speedSensorGatewayServiceInstance } from '../service/speed-sensor-gateway-service';
import {
  SensorModel,
  EventChannelConnection,
} from '@/models/sensor-gateway-model';
export interface InterfaceSpeedSensorGatewayModule {
  sensors: Array<SensorModel>;
  sensorStateEventChannelConnection: EventChannelConnection;
  sensorDetectionEventChannelConnection: EventChannelConnection;
}

@Module({
  dynamic: true,
  name: 'speed-sensort-gateway-module',
  store,
})
class SpeedSensorGatewayModule extends VuexModule
  implements InterfaceSpeedSensorGatewayModule {
  sensors: Array<SensorModel> = [];
  sensorStateEventChannelConnection: EventChannelConnection = {
    name: 'StateEventChannel',
    connected: false,
  };
  sensorDetectionEventChannelConnection: EventChannelConnection = {
    name: 'DetectionEventChannel',
    connected: false,
  };

  get sortedSensors() {
    return this.sensors.sort((a, b) => (a.code > b.code ? 1 : -1));
  }

  @Mutation
  public setUpdateConnectionStatus(updateConnectionStatus: {
    eventChannelConnection: EventChannelConnection;
    isConnected: boolean;
  }) {
    updateConnectionStatus.eventChannelConnection.connected =
      updateConnectionStatus.isConnected;
  }

  @Mutation
  public updateSensors(sensors: Array<SensorModel>) {
    this.sensors = sensors;
  }

  @Mutation
  public updateJustOneSensor(sensor: SensorModel) {
    const allSensorsExceptTheOld = this.sensors.filter(
      s => s.uuid != sensor.uuid,
    );
    if (allSensorsExceptTheOld) allSensorsExceptTheOld.push(sensor);
    this.sensors = allSensorsExceptTheOld;
  }

  @Action({ rawError: true })
  public receiveDetectionEvent(event: string) {
    console.log(event);
  }

  @Action({ rawError: true })
  public receiveSensorStateEvent(sensorModel: SensorModel) {
    if (sensorModel) {
      console.log('Receveid new sensor state event');
      this.context.commit('updateJustOneSensor', sensorModel);
    }
  }

  @Action({ rawError: true })
  public handleDisconnectionOnSensorDetectionChannel() {
    this.context.commit('setUpdateConnectionStatus', {
      eventChannelConnection: this.sensorDetectionEventChannelConnection,
      isConnected: false,
    });
  }

  @Action({ rawError: true })
  public handleDisconnectionOnSensorStateChannel() {
    this.context.commit('setUpdateConnectionStatus', {
      eventChannelConnection: this.sensorStateEventChannelConnection,
      isConnected: false,
    });
  }

  @Action({ rawError: true })
  public handleConnectionOnDetectionChannel() {
    this.context.commit('setUpdateConnectionStatus', {
      eventChannelConnection: this.sensorDetectionEventChannelConnection,
      isConnected: true,
    });
  }

  @Action({ rawError: true })
  public handleConnectionOnSensorStateChannel() {
    this.context.commit('setUpdateConnectionStatus', {
      eventChannelConnection: this.sensorStateEventChannelConnection,
      isConnected: true,
    });
  }

  @Action({ rawError: true })
  public subscribeOnDetectionChannel() {
    subscribeOnDetectionChannel();
  }

  @Action({ rawError: true })
  public subscribeOnSensorStateChannel() {
    subscribeOnSensorStateChannel();
  }

  @Action({ rawError: true })
  public async getAllSensors(): Promise<Array<SensorModel>> {
    return await speedSensorGatewayServiceInstance.getAllSensors();
  }

  @Action({ rawError: true })
  public async refreshSensors(): Promise<void> {
    const sensors = await this.getAllSensors();
    this.context.commit('updateSensors', sensors);
  }
}

export const speedSensorGatewayStoreModule = getModule(
  SpeedSensorGatewayModule,
);
