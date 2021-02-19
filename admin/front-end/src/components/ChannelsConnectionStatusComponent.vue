<template>
  <v-container :v-set="(connection = connectionChannelsStatus)" fluid pa-0>
    <v-progress-linear
      indeterminate
      v-if="!connection.allGood"
      dense
    ></v-progress-linear>
    <v-alert dense :type="connection.status" tile class="ma-0">
      {{ connection.statusMessage }}
    </v-alert>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SensorModel, SensorState } from '../models/sensor-gateway-model';
import {
  ChannelsConnectionStatus,
  EventChannelConnection,
  InterfaceTransportChannelsConnection,
} from '../models/transport';

@Component({
  name: 'ChannelsConnectionStatusComponent',
})
export default class ChannelsConnectionStatusComponent extends Vue {
  @Prop()
  private store!: InterfaceTransportChannelsConnection;

  get connectionChannelsStatus(): ChannelsConnectionStatus {
    let statusMessage = '';
    let allGood = false;
    let unavailableChannels: Array<EventChannelConnection> = [];

    unavailableChannels = this.store.channels.filter(c => !c.connected);

    if (unavailableChannels.length > 0) {
      statusMessage = 'One or more channels are disconnected: ';
      unavailableChannels.forEach(
        c => (statusMessage = statusMessage.concat(c.name).concat(', ')),
      );
    } else {
      statusMessage = 'All channels are connected and listening';
      allGood = true;
    }

    return {
      allGood: allGood,
      statusMessage: statusMessage,
      status: allGood ? 'info' : 'error',
    };
  }
}
</script>
