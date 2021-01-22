import { TestExecutionTurn, TestModel } from '@/models/test-mode';
import {
  TestViewEdge,
  TestViewModel,
  TestViewNode,
  TestViewStopwatch,
  TestViewTurn,
} from '@/models/test-view-model';
import { useDefaultIfIsNone } from '@/utils/filter';

export class TestModelConverter {
  test: TestModel;

  constructor(test: TestModel) {
    this.test = test;
  }

  public convertToView(): TestViewModel {
    const turns: Array<TestViewTurn> = [];

    const numberOfTurns = this.test.template.numberOfTurns;

    Array.from(Array(numberOfTurns).keys()).forEach(turnNumber => {
      const testViewTurn: TestViewTurn = this.testViewTurnFrom(turnNumber + 1);
      turns.push(testViewTurn);
    });

    const testViewStopwatchers: Array<TestViewStopwatch> = [];
    const stopwatchersOnGraph = this.test.template.graph.stopwatchers;
    if (stopwatchersOnGraph && stopwatchersOnGraph.length > 0) {
      stopwatchersOnGraph.forEach(s => {
        testViewStopwatchers.push(s);
      });
    }

    return {
      code: this.test.code,
      state: this.test.state,
      description: this.test.template.description,
      numberOfTurns: this.test.template.numberOfTurns,
      turns: turns,
      stopwatchers: testViewStopwatchers,
    };
  }

  private testViewTurnFrom(turnNumber: number): TestViewTurn {
    const edges: Array<TestViewEdge> = [];
    const turnExecution: TestExecutionTurn = useDefaultIfIsNone(
      this.test.testExecution?.turns.find(t => t.number === turnNumber),
      {
        number: turnNumber,
        startTimeStamp: '',
        endTimeStamp: '',
        totalTime: 0,
        edges: [],
        isCompleted: false,
      },
    );

    this.test.template.graph.edges.forEach(edge => {
      const startNode: TestViewNode = {
        code: edge.startNode.code,
        recordedTimeStamp: '',
      };

      const endNode: TestViewNode = {
        code: edge.endNode.code,
        recordedTimeStamp: '',
      };

      //Execution metrics if exists
      const edgeView: TestViewEdge = {
        sequence: edge.sequence,
        totalTime: 0,
        distance: edge.distance,
        velocity: 0,
        description: edge.description,
        endNode: endNode,
        startNode: startNode,
        stopWatchers: [],
        isCompleted: false,
      };

      if (
        turnExecution &&
        turnExecution.startTimeStamp != '' &&
        turnExecution.executionEdges.length > 0
      ) {
        const executionEdge = turnExecution.executionEdges.find(
          e => e.edge.sequence === edge.sequence,
        );
        if (executionEdge) {
          startNode.recordedTimeStamp =
            executionEdge.startNode.recordedTimeStamp;
          endNode.recordedTimeStamp = useDefaultIfIsNone(
            executionEdge.endNode?.recordedTimeStamp,
            '',
          );

          edgeView.velocity = useDefaultIfIsNone(executionEdge.velocity, 0);
          edgeView.totalTime = useDefaultIfIsNone(executionEdge.totalTime, 0);

          edgeView.isCompleted = edgeView.totalTime > 0;
        }
      }

      edges.push(edgeView);
    });

    const edgesNotCompleted = edges.filter(e => !e.isCompleted);
    const turnIsCompleted = edgesNotCompleted.length <= 0;

    edges.sort((a, b) => a.sequence - b.sequence);

    return {
      number: turnNumber,
      startTimeStamp: turnExecution.startTimeStamp,
      endTimeStamp: useDefaultIfIsNone(turnExecution.endTimeStamp, ''),
      totalTime: useDefaultIfIsNone(turnExecution.totalTime, 0),
      edges: edges,
      isCompleted: turnIsCompleted,
    };
  }
}
