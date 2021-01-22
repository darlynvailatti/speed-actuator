<template>
  <v-container>
    {{ testView.stopwatchers }}
    <v-expansion-panels :value="currentTurnNumber - 1">
      <v-expansion-panel
        v-for="turn in testView.turns"
        v-bind:key="turn.number"
      >
        <v-expansion-panel-header>
          <v-container>
            <v-progress-linear
              :active="true"
              top
              :value="turnConclusionPercentage(turn)"
              height="10"
              absolute
              color="deep-purple accent-4"
            ></v-progress-linear>
            <v-row>
              <v-col cols="1">
                <v-icon v-if="turn.isCompleted">
                  mdi-flag-checkered
                </v-icon>
                <div class="text-h4" v-text="turn.number"></div>
              </v-col>
              <v-col cols="1"><v-divider vertical/></v-col>
              <v-col cols="2">
                <v-chip>
                  Total time:
                  <div
                    class="subtitle-2"
                    v-text="turn.totalTime + '\'s'"
                    v-if="turn.isCompleted"
                  ></div>
                </v-chip>
              </v-col>
              <v-col cols="3">
                <v-chip>
                  Start TimeStamp:
                  <div class="subtitle-2" v-text="turn.startTimeStamp"></div>
                </v-chip>
              </v-col>
              <v-col cols="4">
                <v-chip>
                  End TimeStamp:
                  <div class="subtitle-2" v-text="turn.endTimeStamp"></div>
                </v-chip>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-header>
        <v-divider />
        <v-expansion-panel-content>
          <v-stepper v-model="currentActiveEdgeSequence">
            <v-stepper-header>
              <template v-for="edge in turn.edges">
                <v-stepper-step
                  editable
                  :key="`${edge.sequence}-step`"
                  :complete="edge.isCompleted"
                  :step="edge.sequence"
                  edit-icon="mdi-check"
                >
                  {{ edge.description }}
                </v-stepper-step>
                <v-icon
                  large
                  color="darken-2"
                  v-bind:key="edge.sequence"
                  v-if="!isTheLastEdge(edge)"
                >
                  mdi-arrow-right
                </v-icon>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content
                vertical
                v-for="edge in turn.edges"
                :key="`${edge.sequence}-content`"
                :step="edge.sequence"
              >
                <v-container>
                  <v-row>
                    <v-col>
                      <div class="title">
                        {{ edge.description }}
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        :value="edge.distance"
                        label="Distance"
                        readonly
                        filled
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        :value="edge.totalTime"
                        label="Total time"
                        readonly
                        filled
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        :value="edge.velocity"
                        label="Velocity"
                        readonly
                        filled
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>

                <v-card
                  class="d-flex justify-space-around mb-6"
                  color="white"
                  flat
                  tile
                >
                  <v-card
                    class="pa-1"
                    outlined
                    rounded
                    :color="
                      edge.startNode.recordedTimeStamp
                        ? DEFAULT_CONCLUDE_COLOR_STATUS
                        : ''
                    "
                  >
                    <v-card-title>
                      Node {{ edge.startNode.code }}
                      <v-icon v-if="edge.startNode.recordedTimeStamp"
                        >mdi-check</v-icon
                      >
                    </v-card-title>
                    <v-card-subtitle>start</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        :value="edge.startNode.recordedTimeStamp"
                        label="Recorded timestamp"
                        readonly
                      ></v-text-field>
                    </v-card-text>
                  </v-card>

                  <v-icon large>
                    mdi-arrow-right
                  </v-icon>
                  <v-card
                    class="pa-1"
                    outlined
                    rounded
                    :color="
                      edge.endNode.recordedTimeStamp
                        ? DEFAULT_CONCLUDE_COLOR_STATUS
                        : ''
                    "
                  >
                    <v-card-title>
                      Node {{ edge.endNode.code }}
                      <v-icon v-if="edge.endNode.recordedTimeStamp"
                        >mdi-check</v-icon
                      ></v-card-title
                    >
                    <v-card-subtitle>end</v-card-subtitle>
                    <v-card-text>
                      <v-text-field
                        :value="edge.endNode.recordedTimeStamp"
                        label="Recorded timestamp"
                        readonly
                      ></v-text-field>
                    </v-card-text>
                  </v-card>
                </v-card>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  TestViewEdge,
  TestViewModel,
  TestViewTurn,
} from '../models/test-view-model';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';

@Component({
  name: 'TestExecutionDetails',
  components: {},
})
export default class TestExecutionDetails extends Vue {
  DEFAULT_CONCLUDE_COLOR_STATUS = 'teal accent-2';

  localTestView!: TestViewModel;
  currentActiveEdgeSequence = 0;
  currentTurnNumber = -1;

  get testView(): TestViewModel {
    const t: TestViewModel = speedActuatorStoreModule.getTestView;
    this.localTestView = t;
    this.updateCurrentExecutionEdgeOfTurn(t);
    this.updateCurrentTurnExecution(t);
    return t;
  }

  public isTheLastEdge(edge: TestViewEdge): boolean {
    const edgeSequences = this.localTestView.turns[0].edges.map(
      e => e.sequence,
    );
    const lastSequece = Math.max(...edgeSequences);
    return edge.sequence == lastSequece;
  }

  public turnConclusionPercentage(turn: TestViewTurn) {
    const totalEdges = turn.edges.length;
    const totalCompletedEdges = turn.edges.filter(e => e.isCompleted).length;

    let percentage = 0;
    if (totalCompletedEdges > 0)
      percentage = (totalCompletedEdges / totalEdges) * 100;

    return percentage;
  }

  private updateCurrentExecutionEdgeOfTurn(testView: TestViewModel) {
    const firstTurnNotCompleted = testView.turns
      .sort((a, b) => a.number - b.number)
      .find(t => !t.isCompleted);

    if (!firstTurnNotCompleted) return;

    const firstEdgeNotCompleted = firstTurnNotCompleted.edges
      .sort((a, b) => a.sequence - b.sequence)
      .find(e => !e.isCompleted);

    if (firstEdgeNotCompleted)
      this.currentActiveEdgeSequence = firstEdgeNotCompleted.sequence;
  }

  private updateCurrentTurnExecution(testView: TestViewModel) {
    const firstTurnNotCompletedYet = testView.turns
      .sort((a, b) => a.number - b.number)
      .find(t => !t.isCompleted);
    if (firstTurnNotCompletedYet)
      this.currentTurnNumber = firstTurnNotCompletedYet.number;
  }
}
</script>
