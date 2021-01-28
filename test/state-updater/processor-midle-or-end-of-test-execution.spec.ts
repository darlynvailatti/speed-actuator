import { TestExecutionTurn } from 'src/models/execution/test.execution';
import { ProcessorMidleOrEndOfTurn } from 'src/modules/test-engine/processor/processor-midle-or-end-of-test-execution';

describe('Proccess midle or end of test execution', () => {
  test('Invalid turn', () => {
    const expectedErrorMessage = 'Current turn is not valid';

    const turnInvalidNumber: TestExecutionTurn = {
      number: -1,
      startTimeStamp: '',
    };

    const turnWihtoutExecutionEdge: TestExecutionTurn = {
      number: 1,
      executionEdges: [],
      startTimeStamp: '',
    };

    const fakeTest: any = 0;
    const fakeTestTemplate: any = 0;
    const fakeTestExecutionNode: any = 0;

    let processor = new ProcessorMidleOrEndOfTurn(
      fakeTest,
      fakeTestTemplate,
      fakeTestExecutionNode,
      turnInvalidNumber,
    );

    expect(processor.execute()).rejects.toEqual(
      new Error(expectedErrorMessage),
    );

    processor = new ProcessorMidleOrEndOfTurn(
      fakeTest,
      fakeTestTemplate,
      fakeTestExecutionNode,
      turnWihtoutExecutionEdge,
    );

    expect(processor.execute()).rejects.toEqual(
      new Error(expectedErrorMessage),
    );
  });

  test("Current turn can't be undefined", () => {
    const expectedErrorMessage = "Current turn can't be undefined";

    const fakeTest: any = 0;
    const fakeTestTemplate: any = 0;
    const fakeTestExecutionNode: any = 0;
    const fakeTurn: any = null;

    const processor = new ProcessorMidleOrEndOfTurn(
      fakeTest,
      fakeTestTemplate,
      fakeTestExecutionNode,
      fakeTurn,
    );

    expect(processor.execute()).rejects.toEqual(
      new Error(expectedErrorMessage),
    );
  });
});
