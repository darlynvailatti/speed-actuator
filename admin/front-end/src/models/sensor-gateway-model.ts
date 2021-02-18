export interface DetectionModel {
  timestamp: number;
}

export enum SensorState {
  IDLE = 'idle',
  LISTENING = 'listening',
  DISCONNECTED = 'disconnected',
}

export interface SensorModel {
  code: string;
  uuid: string;
  detections: Array<DetectionModel>;
  lastUpdate: number;
  state: SensorState;
}

export interface EventChannelConnection {
  name: string;
  connected: boolean;
}