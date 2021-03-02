<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-avatar
        v-on="on"
        v-bind="attrs"
        color="blue"
        size="200"
        :class="avatarStyle"
      >
        <span class="white--text headline pt-8" style="width: 100%;">
          <div class="text-h1">
            {{ sensorModel.code }}
          </div>
          <v-divider />
          <v-icon size="35" class="pt-2">{{
            iconStateRepresentation.icon
          }}</v-icon>
        </span>
      </v-avatar>
    </template>
    <span>{{ sensorModel.uuid }}</span>
  </v-tooltip>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  SensorDetectionModel,
  SensorModel,
  SensorState,
} from '../models/sensor-gateway-model';
import { speedSensorGatewayStoreModule } from '../store/speed-sensor-gateway-store';

@Component({
  name: 'SensorUnitComponent',
})
export default class SensorUnitComponent extends Vue {
  @Prop()
  private sensorModel!: SensorModel;

  private alertEnabled = false;

  private stateStyles = [
    { state: SensorState.IDLE, styleClass: 'idle_state' },
    { state: SensorState.LISTENING, styleClass: 'listening_state' },
    { state: SensorState.DISCONNECTED, styleClass: 'disconnected_state' },
  ];

  get avatarStyle(): string {
    const found = this.stateStyles.find(s => s.state == this.sensorModel.state);
    let style = found ? found.styleClass : 'default';
    if (this.alertEnabled) style = style + ' alert-enabled';
    return style;
  }

  get iconStateRepresentation() {
    const iconsStateMapping = [
      { state: SensorState.IDLE, icon: '', styleClass: '' },
      {
        state: SensorState.LISTENING,
        icon: 'mdi-eye',
        styleClass: 'alert-enabled',
      },
      {
        state: SensorState.DISCONNECTED,
        icon: 'mdi-connection',
        styleClass: '',
      },
    ];
    const icon = iconsStateMapping.find(i => i.state == this.sensorModel.state);
    return icon ? icon : '';
  }

  get detections() {
    return speedSensorGatewayStoreModule.detections;
  }

  @Watch('detections', { deep: true })
  observeDetection() {
    console.log(`Receveid detection`);
    const detections: Array<SensorDetectionModel> =
      speedSensorGatewayStoreModule.detections;
    const detection = detections.find(
      d => d.sensor.uuid == this.sensorModel.uuid,
    );
    if (detection) {
      this.alertEnabled = true;
      setTimeout(() => (this.alertEnabled = false), 500);
      speedSensorGatewayStoreModule.consumeDetection(detection);
    }
    return null;
  }
}
</script>
<style scoped>
.idle_state {
  border: 10px white !important;
}

.listening_state {
  -webkit-animation: pulsating 1s ease-in-out;
  -webkit-animation-iteration-count: infinite;
}

@keyframes pulsating {
  0% {
    transform: scale(1, 1);
    box-shadow: initial;
  }

  50% {
    transform: scale(1.01, 1.01);
    box-shadow: 0 0 20px 1px #3e3e3f;
  }

  100% {
    transform: scale(1, 1);
    box-shadow: initial;
  }
}

.disconnected_state {
  background-color: lightcoral !important;
}

.alert-enabled {
  -webkit-animation: alert-pulse 0.5s ease-in-out;
  -webkit-animation-iteration-count: infinite;
}

@keyframes alert-pulse {
  0% {
    transform: scale(1, 1);
    box-shadow: initial;
  }

  50% {
    transform: scale(1.2, 1.2);
    box-shadow: 0 0 35px 1px #e45a42;
  }

  100% {
    transform: scale(1, 1);
    box-shadow: initial;
  }
}

.default {
}
</style>
