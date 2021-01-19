import {
  TestExecutionNode,
  TestExecutionTurn,
  TestExecutionEdge,
} from 'src/models/execution/test.execution';
import { TestTemplate } from 'src/models/template/test.template';
import { Test, TestState } from 'src/models/execution/test';
import { Logger } from '@nestjs/common';
import { TestStateMachine } from 'src/modules/test/impl/test-state-machine';
import { EnsureThat } from 'src/common/validate';
import { Node } from 'src/models/template/edge';

export class ProcessorMidleOrEndOfTurn {
  private readonly logger = new Logger(ProcessorMidleOrEndOfTurn.name);

  private testTemplate: TestTemplate;
  private executionNode: TestExecutionNode;
  private currentTurn: TestExecutionTurn;
  private test: Test;
  private executionEdge: TestExecutionEdge;
  private currentExecutionEdgeIsForStartNode: boolean;

  constructor(
    test: Test,
    testTemplate: TestTemplate,
    executionNode: TestExecutionNode,
    currentTurn: TestExecutionTurn,
  ) {
    this.test = test;
    this.testTemplate = testTemplate;
    this.executionNode = executionNode;
    this.currentTurn = currentTurn;
  }

  async execute() {
    this.checkCurrentTurn();

    // Find last execution edge
    this.executionEdge = this.findLastExecutionEdge();

    const edgeSequence = this.executionEdge.edge.sequence;
    const edgeTemplate = this.findEdgeOnTemplateBySequence(edgeSequence);

    // By default must expect for end node of each edge, but there is one exception:
    // When the current execution edge does not have startTimeStamp, means that
    // it demands do be processed as the context execution node

    const isCurrentExecutionEdgeAlreadyHasStartTimestamp = this.executionEdge
      .startNode.recordedTimeStamp
      ? true
      : false;

    this.currentExecutionEdgeIsForStartNode = !isCurrentExecutionEdgeAlreadyHasStartTimestamp;

    let expectedNode: Node = edgeTemplate.endNode;
    if (this.currentExecutionEdgeIsForStartNode)
      expectedNode = edgeTemplate.startNode;

    EnsureThat.isNotNull(
      expectedNode,
      `Was not possible to find what is the expected node code`,
    );

    const isMatchExpectedNode =
      expectedNode.code === this.executionNode.node.code;
    if (!isMatchExpectedNode) {
      this.logger.log(
        `Node ${this.executionNode.node.code} don't match the expected Node ${expectedNode.code}`,
      );
      return;
    }

    if (this.currentExecutionEdgeIsForStartNode)
      this.executionEdge.startNode = this.executionNode;
    else this.executionEdge.endNode = this.executionNode;

    // Only process variables when the current exection Edge is at end node
    if (this.executionEdge.endNode) {
      const edgeDistance = edgeTemplate.distance;

      const edgeRecordedStartTime = Number.parseInt(
        this.executionEdge.startNode.recordedTimeStamp,
      );
      const edgeRecordedEndTime = Number.parseInt(
        this.executionEdge.endNode.recordedTimeStamp,
      );
      const totalTime = (edgeRecordedEndTime - edgeRecordedStartTime) / 1000;

      this.executionEdge.totalTime = totalTime;
      this.executionEdge.velocity = edgeDistance / totalTime;

      this.logger.log(`Last execution edge: ${this.executionEdge}`);
    }

    const lastEdgeInGraphBySequence = this.testTemplate.graph.edges
      .sort((a, b) => a.sequence - b.sequence)
      .reverse()[0];
    this.logger.log(
      `Last Edge in Graph by sequence: ${lastEdgeInGraphBySequence}`,
    );

    const isEndOfTurn =
      this.executionEdge.edge.sequence === lastEdgeInGraphBySequence.sequence &&
      !this.currentExecutionEdgeIsForStartNode;

    if (isEndOfTurn) {
      this.processEndOfTurn();
    } else {
      this.processBeginOrMidleOfTurn();
    }
  }

  private findLastExecutionEdge(): TestExecutionEdge {
    return this.currentTurn.executionEdges
      .sort((a, b) => a.edge.sequence - b.edge.sequence)
      .reverse()[0];
  }

  private processBeginOrMidleOfTurn() {
    if (this.currentExecutionEdgeIsForStartNode) {
      this.logger.log(
        'Current execution edge context is about Start Node, will not create next execution edge',
      );
      this.currentTurn.startTimeStamp = this.executionNode.recordedTimeStamp;
      return;
    }

    const nextSequence = this.executionEdge.edge.sequence + 1;
    const nextEdge = this.findEdgeOnTemplateBySequence(nextSequence);

    const isLastNodeEqualsToNextNode =
      nextEdge.startNode.code === this.executionEdge.endNode.node.code;

    const nextExecutionEdge: TestExecutionEdge = {
      edge: {
        sequence: nextEdge.sequence,
      },
      startNode: {
        node: {
          code: nextEdge.startNode.code,
        },
        recordedTimeStamp: isLastNodeEqualsToNextNode
          ? this.executionNode.recordedTimeStamp
          : null,
      },
    };

    // Update execution edges, adding the new
    this.currentTurn.executionEdges.push(nextExecutionEdge);
  }

  private processEndOfTurn() {
    this.logger.log(`End of turn`);

    //Update current turn
    const endRecordedTimeStamp = this.executionNode.recordedTimeStamp;
    this.currentTurn.endTimeStamp = endRecordedTimeStamp;

    const turnStartTimeStamp = Number.parseInt(this.currentTurn.startTimeStamp);
    const turnEndTimeStamp = Number.parseInt(this.currentTurn.endTimeStamp);
    this.currentTurn.totalTime = (turnEndTimeStamp - turnStartTimeStamp) / 1000;

    let numberOfTurns = 0;
    if (this.test.numberOfTurns) numberOfTurns = this.test.numberOfTurns;
    else if (this.test.template.numberOfTurns)
      numberOfTurns = this.test.template.numberOfTurns;

    let isFinalTurn = this.currentTurn.number === numberOfTurns;

    this.logger.log(
      `Is final turn? ${isFinalTurn} : ${this.currentTurn.number} - ${numberOfTurns}`,
    );
    if (isFinalTurn) {
      const doneState = TestState.DONE;
      this.logger.log(`Is final turn, changing test state to ${doneState}`);
      TestStateMachine.change(this.test, doneState);
      return;
    }

    // Create new turn
    const newTurn = this.currentTurn.number + 1;

    // Find first ege of graph
    const firstEdgeOfGraph = this.testTemplate.graph.edges.sort(
      (a, b) => a.sequence - b.sequence,
    )[0];

    if (!firstEdgeOfGraph)
      throw new Error(`Can't found the first edge of the graph`);

    // End node and start node are the same
    let endNodeAndStartNodeAreTheSame =
      this.executionNode.node.code === firstEdgeOfGraph.startNode.code;

    const newStartExecutionEdge: TestExecutionEdge = {
      edge: {
        sequence: firstEdgeOfGraph.sequence,
      },
      startNode: {
        recordedTimeStamp: endNodeAndStartNodeAreTheSame
          ? this.executionNode.recordedTimeStamp
          : null,
        node: {
          code: firstEdgeOfGraph.startNode.code,
        },
      },
      endNode: {
        node: {
          code: firstEdgeOfGraph.endNode.code,
        },
      },
    };

    this.test.testExecution.turns.push({
      number: newTurn,
      startTimeStamp: endNodeAndStartNodeAreTheSame
        ? endRecordedTimeStamp
        : null,
      executionEdges: [newStartExecutionEdge],
    });
  }

  private checkCurrentTurn() {
    this.logger.log(`Checking current turn`);

    if (!this.currentTurn) throw new Error(`Current turn can't be undefined`);

    const turnDontHaveValidNumber = this.currentTurn.number < 0;
    const turnDontHaveExecutionEdges =
      !this.currentTurn.executionEdges ||
      this.currentTurn.executionEdges.length <= 0;
    if (turnDontHaveValidNumber || turnDontHaveExecutionEdges) {
      throw new Error(`Current turn is not valid`);
    }
  }

  private findEdgeOnTemplateBySequence(edgeSequence: number) {
    return this.testTemplate.graph.edges.find(e => e.sequence === edgeSequence);
  }
}
