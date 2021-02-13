export function getSpeedActuatorBackendUrl() {
  return (
    window.location.protocol + '//' + window.location.hostname + ':' + '3001'
  );
}

export function getSpeedSensorGatewayBackendUrl() {
  return (
    window.location.protocol + '//' + window.location.hostname + ':' + '3000'
  );
}
