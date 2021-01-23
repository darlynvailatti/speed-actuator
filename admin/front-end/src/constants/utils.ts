export function getBackendUrl() {
  return (
    window.location.protocol + '//' + window.location.hostname + ':' + '3001'
  );
}
