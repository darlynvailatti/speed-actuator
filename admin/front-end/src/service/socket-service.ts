import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import { speedSensorGatewayStoreModule } from '../store/speed-sensor-gateway-store';
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

  websocket.on(
    'connect_error',
    speedActuatorStoreModule.handleDisconnectionOnTestStateChannel,
  );

  websocket.on(
    'disconnect',
    speedActuatorStoreModule.handleDisconnectionOnTestStateChannel,
  );
  websocket.on(
    'connect',
    speedActuatorStoreModule.handleConnectionOnTestStateChannel,
  );
}

export function subscribeOnDetectionChannel() {
  console.log('Subscribing on sensor detection channel...');
  const websocket = websocketSensorGateway;
  websocket.on('sensor-gateway:detection', (data: string) => {
    const event = data.replaceAll('\\', '\\');
    const eventAsJson = JSON.parse(event);
    speedSensorGatewayStoreModule.receiveDetectionEvent(eventAsJson);
  });

  websocket.on(
    'connect_error',
    speedSensorGatewayStoreModule.handleDisconnectionOnSensorDetectionChannel,
  );

  websocket.on(
    'disconnect',
    speedSensorGatewayStoreModule.handleDisconnectionOnSensorDetectionChannel,
  );
  websocket.on(
    'connect',
    speedSensorGatewayStoreModule.handleConnectionOnDetectionChannel,
  );
}

export function subscribeOnSensorStateChannel() {
  console.log('Subscribing on sensor state channel...');
  const websocket = websocketSensorGateway;
  websocket.on('sensor-gateway:sensor-state', (data: string) => {
    const event = data.replaceAll('\\', '\\');
    const eventAsJson = JSON.parse(event);
    const sensorModelAsJson = eventAsJson.sensorModel;
    speedSensorGatewayStoreModule.receiveSensorStateEvent(sensorModelAsJson);
  });

  websocket.on(
    'connect',
    speedSensorGatewayStoreModule.handleConnectionOnSensorStateChannel,
  );

  websocket.on(
    'disconnect',
    speedSensorGatewayStoreModule.handleDisconnectionOnSensorStateChannel,
  );

  websocket.on(
    'connect_error',
    speedSensorGatewayStoreModule.handleDisconnectionOnSensorStateChannel,
  );
}

export function subscribeOnSensorRawDataChannel() {
  console.log('Subscribing on sensor state channel...');
  const websocket = websocketSensorGateway;
  websocket.on('sensor-gateway:sensor-raw-data', (data: string) => {
    const event = data.replaceAll('\\', '\\');
    const eventAsJson = JSON.parse(event);
    const sensorRawDataAsJson = eventAsJson;
    speedSensorGatewayStoreModule.receiveSensorRawData(sensorRawDataAsJson);
  });
}
