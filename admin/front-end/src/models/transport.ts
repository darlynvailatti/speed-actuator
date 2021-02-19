export interface EventChannelConnection {
  name: string;
  connected: boolean;
}

export interface ChannelsConnectionStatus {
  allGood: boolean;
  statusMessage: string;
  status: string;
}

export interface InterfaceTransportChannelsConnection {
  channels: Array<EventChannelConnection>;
}
