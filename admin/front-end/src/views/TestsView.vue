<template>
  <div class="home">
    <TestsViewList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TestsViewList from '@/components/TestsViewList.vue';
import { speedActuatorStoreModule } from '@/store/speed-actuator-store';

@Component({
  name: 'TestsView',
  components: {
    TestsViewList,
  },
})
export default class TestsView extends Vue {
  created() {
    console.log(this.sockets);
    this.sockets.subscribe('TEST_VIEW_CHANNEL_WS', data => {
      const message = data.replaceAll('\\', '\\');
      const messageAsJson = JSON.parse(message);
      const testAsJson = JSON.parse(messageAsJson);
      speedActuatorStoreModule.updateJustOneTest(testAsJson);
    });
  }
}
</script>
