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
  DetectionModel,
  SensorDetectionModel,
  SensorModel,
  SensorRawDataModel,
} from '@/models/sensor-gateway-model';
import {
  EventChannelConnection,
  InterfaceTransportChannelsConnection,
} from '@/models/transport';

export interface InterfaceSpeedSensorGatewayStore
  extends InterfaceTransportChannelsConnection {
  sensors: Array<SensorModel>;
  sensorStateEventChannelConnection: EventChannelConnection;
  sensorDetectionEventChannelConnection: EventChannelConnection;
  detections: Array<SensorDetectionModel>;
}

@Module({
  dynamic: true,
  name: 'speed-sensort-gateway-module',
  namespaced: true,
  store,
})
class SpeedSensorGatewayStore extends VuexModule
  implements InterfaceSpeedSensorGatewayStore {
  sensors: Array<SensorModel> = [];
  sensorStateEventChannelConnection: EventChannelConnection = {
    name: 'StateEventChannel',
    connected: false,
  };
  sensorDetectionEventChannelConnection: EventChannelConnection = {
    name: 'DetectionEventChannel',
    connected: false,
  };
  detections: Array<SensorDetectionModel> = [];
  sensorRawData: Array<SensorRawDataModel> = [];

  get sortedSensors() {
    return this.sensors.sort((a, b) => (a.code > b.code ? 1 : -1));
  }

  get channels() {
    return [
      this.sensorDetectionEventChannelConnection,
      this.sensorStateEventChannelConnection,
    ];
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
  public addNewSensorDetection(sensorDetection: SensorDetectionModel) {
    this.detections.push(sensorDetection);
  }

  @Mutation
  public removeSensorDetection(sensorDetection: SensorDetectionModel) {
    console.log('Before: ' + this.detections);
    this.detections = this.detections.filter(
      d => d.sensor.uuid != sensorDetection.sensor.uuid,
    );
    console.log('After: ' + this.detections);
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

  @Mutation
  public addSensorRawData(sensorRawData: SensorRawDataModel) {
    this.sensorRawData.push(sensorRawData);
  }

  @Action({ rawError: true })
  public receiveDetectionEvent(sensorDetection: SensorDetectionModel) {
    if (sensorDetection) {
      this.context.commit('addNewSensorDetection', sensorDetection);
    }
  }

  @Action({ rawError: true })
  public receiveSensorStateEvent(sensorModel: SensorModel) {
    if (sensorModel) {
      console.log('Receveid new sensor state event');
      this.context.commit('updateJustOneSensor', sensorModel);
    }
  }

  @Action({ rawError: true })
  receiveSensorRawData(sensorRawData: SensorRawDataModel) {
    if (sensorRawData) {
      this.context.commit('addSensorRawData', sensorRawData);
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

  @Action({ rawError: true })
  public async consumeDetection(sensorDetection: SensorDetectionModel) {
    this.context.commit('removeSensorDetection', sensorDetection);
  }
}

export const speedSensorGatewayStoreModule = getModule(SpeedSensorGatewayStore);
