<template>
  <v-container>
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import TestHeaderDetails from '../components/TestHeaderDetails.vue';
import TestExecutionDetails from '../components/TestExecutionDetails.vue';
import TestViewVelocityExecutionChart from '../components/TestViewVelocityExecutionChart.vue';
import TestViewTimeExecutionChart from '../components/TestViewTimeExecutionChart.vue';
import { TestViewModel } from '../models/test-view-model';
import { subscribeOnTestStateChannel } from '../service/socket-service';

@Component({
  name: 'TestView',
  components: {
    TestHeaderDetails,
    TestExecutionDetails,
    TestViewVelocityExecutionChart,
    TestViewTimeExecutionChart,
  },
})
export default class TestView extends Vue {
  created() {
    subscribeOnTestStateChannel(this);
  }

  async beforeMount() {
    const params = this.$router.currentRoute.params;
    const testCode = params.test_code;
    await speedActuatorStoreModule.viewTestByCode(testCode);
    await speedActuatorStoreModule.refreshTest(testCode);
  }

  get testView(): TestViewModel {
    return speedActuatorStoreModule.getTestView;
  }
}
</script>
