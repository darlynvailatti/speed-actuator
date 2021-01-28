import { TestTemplate } from 'src/models/template/test-template';
import {
  TestExecutionNode,
  TestExecutionTurn,
  TestExecutionEdge,
} from 'src/models/execution/test.execution';
import { TestState, Test } from 'src/models/execution/test';
import { TestStateMachine } from 'src/modules/test-model/impl/test-state-machine';
import { Logger } from '@nestjs/common';

export class ProcessorBeginOfTestExecution {
  private readonly logger = new Logger(ProcessorBeginOfTestExecution.name);

  testTemplate: TestTemplate;
  executionNode: TestExecutionNode;
  currentTurn: TestExecutionTurn;
  test: Test;

  constructor(
    test: Test,
    testTemplate: TestTemplate,
    executionNode: TestExecutionNode,
    currentTurn: TestExecutionTurn,
  ) {
    this.test = test;
    (this.testTemplate = testTemplate),
      (this.executionNode = executionNode),
      (this.currentTurn = currentTurn);
  }

  async execute() {
    this.validateMandatoryFields();

    const firstEdgeTemplate = this.testTemplate.graph.edges.find(
      e => e.sequence === 1,
    );

    if (!firstEdgeTemplate) {
      throw new Error(
        `Graph of Test Template ${this.testTemplate.code} don't have edge sequence = 1`,
      );
    }

    const startNodeOfFirstEdgeTemplate = firstEdgeTemplate.startNode;

    if (!startNodeOfFirstEdgeTemplate || !startNodeOfFirstEdgeTemplate.code)
      throw new Error(`First Edge of Graph don't have start node code`);

    const isMatchExpectedNode =
      startNodeOfFirstEdgeTemplate.code === this.executionNode.node.code;
    if (!isMatchExpectedNode) {
      this.logger.log(
        `Node ${this.executionNode.node.code} It's not expected Node: ${startNodeOfFirstEdgeTemplate.code}`,
      );
      return;
    }

    // Create new TestExecutionEdge
    const executionEdge: TestExecutionEdge = {
      edge: {
        sequence: firstEdgeTemplate.sequence,
      },
      startNode: this.executionNode,
    };

    this.logger.log(
      `Pushing new execution edge ${executionEdge.edge.sequence}`,
    );
    this.currentTurn.executionEdges = [executionEdge];

    const isFirstTurn = this.currentTurn.number === 1;
    if (isFirstTurn) {
      this.logger.log(`Starting test ${this.test.code}`);
      TestStateMachine.change(this.test, TestState.STARTED);
    }
  }

  private validateMandatoryFields() {
    if (!this.test || !this.test.state)
      throw new Error(`Test must have defined State`);

    if (!this.testTemplate) {
      throw new Error(`Can´t process begin of turn without TestTemplate`);
    }

    if (!this.testTemplate.graph || !this.testTemplate.graph.edges) {
      throw new Error(`Graph and Edges is mandatory in TestTemplate`);
    }

    if (
      !this.executionNode ||
      !this.executionNode.node ||
      !this.executionNode.node.code
    )
      throw new Error(`Execution Node must have Node Code`);

    if (!this.currentTurn || !this.currentTurn.number)
      throw new Error(`Current Turn must have number`);
  }
}
