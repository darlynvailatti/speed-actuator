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
        <span class="white--text headline">
          <div class="text-h1">
            {{ sensorModel.code }}
          </div>
        </span>
      </v-avatar>
    </template>
    <span>{{ sensorModel.uuid }}</span>
  </v-tooltip>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SensorModel, SensorState } from '../models/sensor-gateway-model';

@Component({
  name: 'SensorUnitComponent',
})
export default class SensorUnitComponent extends Vue {
  @Prop()
  private sensorModel!: SensorModel;

  private stateStyles = [
    { state: SensorState.IDLE, styleClass: 'idle_state' },
    { state: SensorState.LISTENING, styleClass: 'listening_state' },
    { state: SensorState.DISCONNECTED, styleClass: 'disconnected_state' },
  ];

  get avatarStyle(): string {
    console.log(this.sensorModel);
    const found = this.stateStyles.find(s => s.state == this.sensorModel.state);
    return found ? found.styleClass : 'default';
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

.default {
}
</style>
