<template>
  <v-container>
    <v-checkbox
      v-model="enableAutoSwitchTurnExpansionPanel"
      :label="`Enable auto switch to active turn?`"
    ></v-checkbox>
    <v-expansion-panels :value="activeTurnExpansionPanel">
      <v-expansion-panel
        v-for="turn in testView.turns"
        v-bind:key="turn.number"
        class="ma-0"
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
        <v-expansion-panel-content class="pa-0">
          <v-stepper v-model="currentActiveEdgeSequence">
            <v-stepper-header>
              <template v-for="edge in turn.edges">
                <v-stepper-step
                  editable
                  :key="`${edge.sequence}-step`"
                  :complete="edge.isCompleted"
                  :step="edge.sequence"
                  edit-icon="mdi-check"
                  :set="
                    (stopwatchDefinitions = findStopwatchDefinitionByTurnAndEdge(
                      turn.number,
                      edge.sequence,
                    ))
                  "
                >
                  <v-row>
                    <v-col>
                      {{ edge.description }}
                      <v-tooltip right v-if="stopwatchDefinitions.length > 0">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-timer
                          </v-icon>
                        </template>
                        <span>
                          <p
                            v-for="stopwatchDefinition in stopwatchDefinitions"
                            v-bind:key="
                              stopwatchDefinition.time +
                                stopwatchDefinition.turns
                            "
                          >
                            <v-row>
                              <v-col>
                                Base time:
                                {{ stopwatchDefinition.time / 1000 }}'s
                              </v-col>
                            </v-row>
                          </p>
                        </span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
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

                  <v-row>
                    <v-col>
                      <v-card
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
                    </v-col>
                    <v-col cols="4" md="5">
                      <v-container>
                        <v-row
                          fluid
                          class="d-flex justify-center"
                          justify="space-around"
                          no-gutters
                        >
                          <v-icon large>
                            mdi-arrow-right
                          </v-icon>
                        </v-row>
                        <v-row
                          justify="center"
                          no-gutters
                          v-for="item in stopwatchProcessForCurrentTurnAndEdge"
                          v-bind:key="item.testCode + item.turn + item.edges"
                        >
                          <v-chip>
                            <v-col cols="1" class="d-flex justify-center">
                              <v-icon aria-hidden="false">
                                mdi-clock
                              </v-icon>
                            </v-col>
                            <v-col class="d-flex align-center flex-column">
                              <div class="title">
                                <test-view-stopwatch-process
                                  :stopwatchProcess="item"
                                />
                              </div>
                            </v-col>
                          </v-chip>
                        </v-row>
                      </v-container>
                    </v-col>

                    <v-col>
                      <v-card
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
                    </v-col>
                  </v-row>
                </v-container>
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
import { StopwatchProcess } from '../models/stopwatch-model';
import TestViewStopwatchProcess from '../components/TestViewStopwatch.vue';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';

@Component({
  name: 'TestExecutionDetails',
  components: { TestViewStopwatchProcess },
})
export default class TestExecutionDetails extends Vue {
  DEFAULT_CONCLUDE_COLOR_STATUS = 'teal accent-2';

  localTestView!: TestViewModel;
  currentActiveEdgeSequence = 0;
  currentTurnNumber = -1;
  enableAutoSwitchTurnExpansionPanel = false;

  get stopwatchProcesses(): Array<StopwatchProcess> {
    return speedActuatorStoreModule.stopwatchProcessesOfTestView;
  }

  get stopwatchProcessForCurrentTurnAndEdge() {
    const stopwatchProcesses = this.stopwatchProcesses.filter(
      sp =>
        sp.turn === this.currentTurnNumber &&
        sp.edgesSequences.indexOf(this.currentActiveEdgeSequence) >= 0,
    );
    return stopwatchProcesses;
  }

  get isCurrentTurnHasStopwatchDefinitions() {
    const stopwatchDefinitionsForCurrentTurn = this.localTestView.stopwatchers.filter(
      sd => sd.turns.filter(t => t === this.currentTurnNumber).length > 0,
    );
    return (
      stopwatchDefinitionsForCurrentTurn &&
      stopwatchDefinitionsForCurrentTurn.length > 0
    );
  }

  get activeTurnExpansionPanel() {
    let indexActiveExpansionPanel = -1;
    if (this.enableAutoSwitchTurnExpansionPanel) {
      indexActiveExpansionPanel = this.currentTurnNumber - 1;
    }
    return indexActiveExpansionPanel;
  }

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
  private findStopwatchDefinitionByTurnAndEdge(
    turnNumber: number,
    edgeSequence: number,
  ) {
    if (edgeSequence && turnNumber) {
      return this.localTestView.stopwatchers.filter(s => {
        if (s.turns.indexOf(turnNumber) < 0) {
          return false;
        }

        const insideEdgeRange =
          (edgeSequence > s.beginEdgeSequenceNumber &&
            edgeSequence < s.endEdgeSequenceNumber) ||
          (edgeSequence >= s.beginEdgeSequenceNumber &&
            edgeSequence < s.endEdgeSequenceNumber) ||
          (edgeSequence > s.beginEdgeSequenceNumber &&
            edgeSequence <= s.endEdgeSequenceNumber) ||
          (edgeSequence == s.beginEdgeSequenceNumber &&
            edgeSequence == s.endEdgeSequenceNumber);

        return insideEdgeRange;
      });
    }
    return [];
  }
}
</script>
