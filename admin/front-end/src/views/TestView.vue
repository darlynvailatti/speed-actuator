<template>
  <v-container>
    <test-header-details />
    <test-execution-details />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import TestHeaderDetails from '../components/TestHeaderDetails.vue';
import TestExecutionDetails from '../components/TestExecutionDetails.vue';
import { TestViewModel } from '../models/test-view-model';
import { subscribeOnTestStateChannel } from '../service/socket-service';

@Component({
  name: 'TestView',
  components: { TestHeaderDetails, TestExecutionDetails },
})
export default class TestView extends Vue {
  created() {
    subscribeOnTestStateChannel(this);
  }

  async beforeMount() {
    const params = this.$router.currentRoute.params;
    const testCode = params.test_code;
    console.log(testCode);
    await speedActuatorStoreModule.viewTestByCode(testCode);
    await speedActuatorStoreModule.refreshTest(testCode);
  }

  get testView(): TestViewModel {
    return speedActuatorStoreModule.getTestView;
  }
}
</script>
