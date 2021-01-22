<template>
  <v-container>
    <test-header-details />
    <test-view-execution-chart />
    <test-execution-details />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import TestHeaderDetails from '../components/TestHeaderDetails.vue';
import TestExecutionDetails from '../components/TestExecutionDetails.vue';
import TestViewExecutionChart from '../components/TestVIewExecutionChart.vue';
import { TestViewModel } from '../models/test-view-model';
import { subscribeOnTestStateChannel } from '../service/socket-service';

@Component({
  name: 'TestView',
  components: {
    TestHeaderDetails,
    TestExecutionDetails,
    TestViewExecutionChart,
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
