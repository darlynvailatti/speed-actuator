import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import { speedSensorGatewayStoreModule } from '../store/speed-sensor-gateway';
import * as io from 'socket.io-client';

const websocketSpeedActuator = io.connect(
  window.location.hostname + ':' + '3001',
  {
    transports: ['websocket'],
  },
);

const websocketSensorGateway = io.connect(
  window.location.hostname + ':' + '3000',
  {
    transports: ['websocket'],
  },
);

export function subscribeOnTestStateChannel() {
  console.log('Subscribing on Test State channel...');
  const websocket = websocketSpeedActuator;
  websocket.on('TEST_VIEW_CHANNEL_WS', (event: string) => {
    const message = event.replaceAll('\\', '\\');
    const messageAsJson = JSON.parse(message);
    const testAsJson = JSON.parse(messageAsJson);
    speedActuatorStoreModule.receiveTestStateUpdateEvent(testAsJson);
  });
}

export function subscribeOnDetectionChannel() {
  console.log('Subscribing on sensor detection channel...');
  const websocket = websocketSensorGateway;
  websocket.on('sensor-gateway:detection', (data: string) => {
    console.log(data);
    const message = data.replaceAll('\\', '\\');
    const messageAsJson = JSON.parse(message);
    const testAsJson = JSON.parse(messageAsJson);
    console.log(testAsJson);
  });
}

export function subscribeOnSensorStateChannel() {
  console.log('Subscribing on sensor state channel...');
  const websocket = websocketSensorGateway;
  websocket.on('sensor-gateway:sensor-state', (data: string) => {
    const message = data.replaceAll('\\', '\\');
    const messageAsJson = JSON.parse(message);
    console.log(messageAsJson);
  });
}
