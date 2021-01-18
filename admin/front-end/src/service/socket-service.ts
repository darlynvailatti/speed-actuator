import { speedActuatorStoreModule } from '../store/speed-actuator-store';

export function subscribeOnTestStateChannel(component: Vue) {
  component.sockets.subscribe('TEST_VIEW_CHANNEL_WS', data => {
    const message = data.replaceAll('\\', '\\');
    const messageAsJson = JSON.parse(message);
    const testAsJson = JSON.parse(messageAsJson);
    speedActuatorStoreModule.updateJustOneTest(testAsJson);
  });
}
