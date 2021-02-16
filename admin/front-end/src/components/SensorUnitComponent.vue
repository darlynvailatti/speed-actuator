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
  ];

  get avatarStyle(): string {
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
  border: 10px solid orange !important;
}

.default {
}
</style>
