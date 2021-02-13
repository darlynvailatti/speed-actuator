<template>
  <v-container class="pt-10">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row justify="center">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div class="title">Test</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                v-model="test.code"
                :counter="10"
                label="Code"
                required
              ></v-text-field>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <div class="title">Template</div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col v-for="field in templateFields" v-bind:key="field.label">
                  <v-text-field
                    v-model="field.model"
                    :counter="10"
                    :label="field.label"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row> </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </v-form>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TestModel } from '../models/test-mode';

@Component({
  name: 'TestForm',
})
export default class TestForm extends Vue {
  valid = true;
  test: TestModel = {
    code: '',
    state: '',
    template: {
      description: '',
      numberOfTurns: 0,
      graph: {
        edges: [],
        stopwatchDefinitions: [],
      },
    },
    testExecution: undefined,
  };

  templateFields = [
    {
      label: 'Description',
      model: this.test.template.description,
    },
    {
      label: 'Number of turns',
      model: this.test.template.numberOfTurns,
    },
  ];
}
</script>
