import { Test, TestState } from 'src/models/execution/test';
import { TestTemplate } from 'src/models/template/test-template';
import { ProcessorBeginOfTestExecution } from 'src/modules/test-engine/processor/processor-begin-of-test-execution';
import {
  TestExecutionNode,
  TestExecutionTurn,
} from 'src/models/execution/test.execution';
import { Edge } from 'src/models/template/edge';
import { Node } from 'src/models/template/node';

describe('Process begin of test execution', () => {
  let nodeOne: Node;
  let edgeOne: Edge;
  let testTemplate: TestTemplate;
  let testInstance: Test;

  beforeEach(() => {
    nodeOne = {
      code: 'N1',
      sensor: {
        code: '1',
      },
    };

    edgeOne = {
      code: 'E1',
      sequence: 1,
      startNode: nodeOne,
      description: '',
      distance: 1,
      endNode: nodeOne,
    };

    testTemplate = {
      description: '',
      code: 'template_1',
      graph: {
        description: '',
        code: 'graph_1',
        nodes: [nodeOne],
        edges: [edgeOne],
      },
    };

    testInstance = {
      state: TestState.READY,
      numberOfTurns: 1,
      description: '',
      template: {
        code: 'template_1',
      },
    };
  });

  test('Succsseful process begin of test execution', () => {
    const executionNode: TestExecutionNode = {
      node: nodeOne,
    };

    const currentTurn: TestExecutionTurn = {
      number: 1,
      startTimeStamp: null,
    };

    const processor = new ProcessorBeginOfTestExecution(
      testInstance,
      testTemplate,
      executionNode,
      currentTurn,
    );

    processor.execute();
    expect(testInstance.state === TestState.STARTED).toBeTruthy();
    expect(currentTurn.executionEdges.length > 0).toBeTruthy();
    expect(
      currentTurn.executionEdges[0].edge.sequence === edgeOne.sequence,
    ).toBeTruthy();
  });
});
