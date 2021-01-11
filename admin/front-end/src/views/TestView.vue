<template>
  <v-container>
    <test-header-details :test="test" />
    <test-execution-details :test="test" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { speedActuatorStoreModule } from '@/store/speed-actuator-store';
import TestHeaderDetails from '@/components/TestHeaderDetails.vue';
import TestExecutionDetails from '@/components/TestExecutionDetails.vue';

@Component({
  name: 'TestView',
  components: { TestHeaderDetails, TestExecutionDetails },
})
export default class TestView extends Vue {
  testCode = '';

  created() {
    const params = this.$router.currentRoute.params;
    this.testCode = params.test_code;
  }

  get test() {
    return speedActuatorStoreModule.tests.filter(
      t => t.code == this.testCode,
    )[0];
  }
}
</script>
