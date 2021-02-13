<template>
  <div>teste</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  subscribeOnDetectionChannel,
  subscribeOnSensorStateChannel,
} from '../service/socket-service';

@Component({
  name: 'SensorManagementView',
})
export default class SensorManagementView extends Vue {
  created() {
    subscribeOnDetectionChannel();
    subscribeOnSensorStateChannel();
  }
}
</script>
