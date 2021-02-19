<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-row>
      <v-progress-linear
        :active="true"
        :value="testConclusionPercentage"
        height="10"
        color="deep-purple accent-4"
        ma-0
        pa-0
      ></v-progress-linear>
      <v-col
        v-for="header in headers"
        v-bind:key="header.label"
        class="pa-2 ma-0"
      >
        <v-text-field
          :value="header.value"
          :label="header.label"
          readonly
          filled
          class="pa-0 ma-0"
        ></v-text-field>
      </v-col>
      <v-col
        class="pa-0 ma-2"
        :cols="1"
        v-for="action in actions"
        v-bind:key="action.description"
      >
        <v-btn fab dark @click="action.action">
          <v-icon>
            {{ action.icon }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-snackbar v-model="errorMessage.show">
      {{ errorMessage.message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="errorMessage.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TestViewEdge, TestViewModel } from '../models/test-view-model';
import { ErrorMessage } from '../models/error-message';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';
import TestView from '../views/TestView.vue';

@Component({
  name: 'TestHeaderDetails',
  components: {},
})
export default class TestHeaderDetails extends Vue {
  errorMessage: ErrorMessage = {
    show: false,
    message: '',
  };

  get headers() {
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

  get actions() {
    return [
      {
        description: 'Set to Ready',
        icon: 'mdi-hand',
        action: this.setToReady,
      },
      {
        description: 'Cancel',
        icon: 'mdi-cancel',
        action: this.setToCancelled,
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
      percentage = (completedEdges.length / totalEdges) * 100;
    }
    return percentage;
  }

  private async setToReady() {
    try {
      const testCode = speedActuatorStoreModule.testViewCode;
      await speedActuatorStoreModule.setTestExecutionToReady(testCode);
    } catch (error) {
      this.showErrorMessage(error);
    }
  }

  private async setToCancelled() {
    try {
      const testCode = speedActuatorStoreModule.testViewCode;
      await speedActuatorStoreModule.cancelTestExecution(testCode);
    } catch (error) {
      this.showErrorMessage(error);
    }
  }

  private showErrorMessage(message: string) {
    this.errorMessage.show = true;
    this.errorMessage.message = message;
  }
}
</script>
