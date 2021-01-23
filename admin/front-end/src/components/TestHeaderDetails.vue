<template>
  <v-container class="ma-0 pa-0">
    <v-row no-gutters>
      <v-progress-linear
        :active="true"
        top
        :value="testConclusionPercentage"
        height="10"
        absolute
        color="deep-purple accent-4"
      ></v-progress-linear>
      <v-col v-for="chip in chips" v-bind:key="chip.label">
        <v-col>
          <v-text-field
            :value="chip.value"
            :label="chip.label"
            readonly
            filled
          ></v-text-field>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TestViewEdge, TestViewModel } from '../models/test-view-model';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import TestView from '../views/TestView.vue';

@Component({
  name: 'TestHeaderDetails',
  components: {},
})
export default class TestHeaderDetails extends Vue {
  get chips() {
    if (!this.testView) return [];

    return [
      {
        label: 'Code',
        value: this.testView.code,
      },
      {
        label: 'Description',
        value: this.testView.description,
      },
      {
        label: 'State',
        value: this.testView.state,
      },
    ];
  }

  get testView() {
    return speedActuatorStoreModule.getTestView;
  }

  get testConclusionPercentage() {
    let percentage = 0;
    const reducer = (accumulator: any, currentValue: any) =>
      accumulator + currentValue;

    const testView = this.testView;
    const totalEdgesByTurn = testView.turns.map(t => t.edges.length);

    if (totalEdgesByTurn.length > 0) {
      const totalEdges = totalEdgesByTurn.reduce(reducer);

      let completedEdges: Array<TestViewEdge> = [];
      testView.turns.map(t => {
        completedEdges = completedEdges.concat(
          t.edges.filter(e => e.isCompleted),
        );
      });

      console.log(
        `Completed edges: ${completedEdges.length} | total Edges: ${totalEdges}`,
      );
      percentage = (completedEdges.length / totalEdges) * 100;
    }
    return percentage;
  }
}
</script>
