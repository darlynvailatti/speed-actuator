<template>
  <v-container>
    <v-container
      v-for="turn in test.testExecution.turns"
      v-bind:key="turn.number"
    >
      <v-card>
        <v-card-title>{{ turn.number }}</v-card-title>
        <v-timeline align-top>
          <v-timeline-item
            v-for="edge in turn.executionEdges"
            v-bind:key="edge.sequence"
          >
            <v-card>
              <v-card-title>
                {{ edge }}
              </v-card-title>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-card>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'TestExecutionDetails',
  components: {},
})
export default class TestExecutionDetails extends Vue {
  @Prop()
  test: any;

  testCode = '';
}
</script>
