<template>
  <tests-view-list />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TestsViewList from '../components/TestsViewList.vue';
import { subscribeOnTestStateChannel } from '../service/socket-service';

@Component({
  name: 'TestsView',
  components: {
    TestsViewList,
  },
})
export default class TestsView extends Vue {
  created() {
    subscribeOnTestStateChannel();
  }
}
</script>
