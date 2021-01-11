<template>
  <v-container>
    <v-data-table
      :headers="testHeaders"
      :items="tests"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="setTestExecutionToReady(item)">
          mdi-hand
        </v-icon>
        <v-icon small class="mr-2" @click="cancelTestExecution(item)">
          mdi-cancel
        </v-icon>
        <v-icon small class="mr-2" @click="viewTest(item)">
          mdi-eye
        </v-icon>
      </template>
    </v-data-table>

    <v-snackbar v-model="snackbar">
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { speedActuatorStoreModule } from '@/store/speed-actuator-store';
import { TestModel } from '@/models/test-mode';

@Component({
  name: 'TestsViewList',
})
export default class TestsViewList extends Vue {
  snackbar = false;
  snackbarMessage = '';

  async refresh() {
    speedActuatorStoreModule.updateTests();
  }

  async cancelTestExecution(test: TestModel) {
    speedActuatorStoreModule.cancelTestExecution(test.code).catch(error => {
      this.showSnackbar(error);
    });
  }

  async setTestExecutionToReady(test: TestModel) {
    speedActuatorStoreModule.setTestExecutionToReady(test.code).catch(error => {
      this.showSnackbar(error);
    });
  }

  async viewTest(test: TestModel) {
    this.$router.push({ path: `/test-view/${test.code}` });
  }

  showSnackbar(meessage: string) {
    this.snackbar = true;
    this.snackbarMessage = meessage;
  }

  get tests() {
    return speedActuatorStoreModule.tests;
  }

  get testHeaders() {
    return [
      { text: 'Code', value: 'code' },
      { text: 'State', value: 'state' },
      { text: 'Template', value: 'template.description' },
      { text: 'Turns', value: 'template.numberOfTurns' },
      { text: 'Actions', value: 'actions', sortable: false },
    ];
  }

  get cancelExecutionActionName() {
    return 'Cancel Execution';
  }

  get updateToReadyActionName() {
    return 'Update to Ready';
  }

  created() {
    this.refresh();
  }
}
</script>
