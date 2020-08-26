import { Sensor } from './sensor';

export class SensorMessage {
  createdTimeStamp: string;
  sensor: Sensor;
}

export class SensorDetectionMessage extends SensorMessage {
  timeStamp: string;
}

export class SensorStateChangeMessage extends SensorMessage {
  state: SensorState;
}

export enum SensorState {
  UNKNOW,
  READY,
  STAND_BY,
}

export class SensorMessageBuilder {
  static buildSensorMessageDetection(
    createdTimeStamp: string,
    sensor: Sensor,
    timeStamp: string,
  ): SensorDetectionMessage {
    return {
      createdTimeStamp: createdTimeStamp,
      sensor: sensor,
      timeStamp: timeStamp,
    };
  }

  static;
}
