<template>
  <div :v-set="(connection = connectionChannelsStatus)">
    <v-progress-linear
      indeterminate
      v-if="!connection.allGood"
      dense
    ></v-progress-linear>
    <v-alert dense :type="connection.status" tile>
      {{ connection.statusMessage }}
    </v-alert>

    <v-container>
      <v-row>
        <v-col v-for="s in sensors" :key="s.uuid" offset-md="1" offset-sm="1">
          <sensor-unit-component :sensorModel="s" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { speedSensorGatewayStoreModule } from '../store/speed-sensor-gateway-store';
import {
  EventChannelConnection,
  SensorModel,
} from '../models/sensor-gateway-model';
import SensorUnitComponent from '../components/SensorUnitComponent.vue';

export interface ChannelsStatus {
  allGood: boolean;
  statusMessage: string;
  status: string;
}

@Component({
  name: 'SensorManagementView',
  components: { SensorUnitComponent },
})
export default class SensorManagementView extends Vue {
  created() {
    speedSensorGatewayStoreModule.subscribeOnDetectionChannel();
    speedSensorGatewayStoreModule.subscribeOnSensorStateChannel();
  }

  mounted() {
    speedSensorGatewayStoreModule.refreshSensors();
  }

  get sensorStateChannelConnection(): EventChannelConnection {
    return speedSensorGatewayStoreModule.sensorStateEventChannelConnection;
  }

  get sensorDetectionChannelConnection(): EventChannelConnection {
    return speedSensorGatewayStoreModule.sensorDetectionEventChannelConnection;
  }

  get sensors(): Array<SensorModel> {
    return speedSensorGatewayStoreModule.sortedSensors;
  }

  get connectionChannelsStatus(): ChannelsStatus {
    let statusMessage = '';
    let allGood = false;
    const channels = [
      this.sensorStateChannelConnection,
      this.sensorDetectionChannelConnection,
    ];
    let unavailableChannels: Array<EventChannelConnection> = [];

    unavailableChannels = channels.filter(c => !c.connected);

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
