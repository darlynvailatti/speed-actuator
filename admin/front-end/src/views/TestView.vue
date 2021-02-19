<template>
  <div>
    <channels-connection-status-component :store="store" />
    <v-container fluid>
      <test-header-details />
      <test-execution-details />
      <v-row>
        <v-col>
          <test-view-velocity-execution-chart />
        </v-col>
        <v-col>
          <test-view-time-execution-chart />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import TestHeaderDetails from '../components/TestHeaderDetails.vue';
import TestExecutionDetails from '../components/TestExecutionDetails.vue';
import ChannelsConnectionStatusComponent from '../components/ChannelsConnectionStatusComponent.vue';
import TestViewVelocityExecutionChart from '../components/TestViewVelocityExecutionChart.vue';
import TestViewTimeExecutionChart from '../components/TestViewTimeExecutionChart.vue';
import { TestViewModel } from '../models/test-view-model';
import { subscribeOnTestStateChannel } from '../service/socket-service';
import { getSpeedActuatorBackendUrl } from '../constants/utils';
import { InterfaceTransportChannelsConnection } from '../models/transport';

@Component({
  name: 'TestView',
  components: {
    TestHeaderDetails,
    TestExecutionDetails,
    TestViewVelocityExecutionChart,
    TestViewTimeExecutionChart,
    ChannelsConnectionStatusComponent,
  },
})
export default class TestView extends Vue {
  created() {
    subscribeOnTestStateChannel();
  }

  async beforeMount() {
    const params = this.$router.currentRoute.params;
    const testCode = params.test_code;
    await speedActuatorStoreModule.viewTestByCode(testCode);
    await speedActuatorStoreModule.refreshTest(testCode);
  }

  get store() {
    return speedActuatorStoreModule;
  }

  get testView(): TestViewModel {
    return speedActuatorStoreModule.getTestView;
  }
}
</script>
