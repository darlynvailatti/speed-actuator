<template>
  <div>
    <channels-connection-status-component :store="store" />
    <v-container mt-10>
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
import { SensorModel } from '../models/sensor-gateway-model';
import {
  ChannelsConnectionStatus,
  EventChannelConnection,
} from '../models/transport';
import SensorUnitComponent from '../components/SensorUnitComponent.vue';
import ChannelsConnectionStatusComponent from '../components/ChannelsConnectionStatusComponent.vue';

@Component({
  name: 'SensorManagementView',
  components: { SensorUnitComponent, ChannelsConnectionStatusComponent },
})
export default class SensorManagementView extends Vue {
  mounted() {
    speedSensorGatewayStoreModule.subscribeOnDetectionChannel();
    speedSensorGatewayStoreModule.subscribeOnSensorStateChannel();
    speedSensorGatewayStoreModule.refreshSensors();
  }

  get channels(): Array<EventChannelConnection> {
    return [
      speedSensorGatewayStoreModule.sensorDetectionEventChannelConnection,
      speedSensorGatewayStoreModule.sensorStateEventChannelConnection,
    ];
  }

  get store() {
    return speedSensorGatewayStoreModule;
  }

  get sensors(): Array<SensorModel> {
    return speedSensorGatewayStoreModule.sortedSensors;
  }
}
</script>
