import { OnApplicationBootstrap, Injectable, Logger } from '@nestjs/common';
import { RedisDatabase } from '../database/redis.database';
import { RedisConstants } from 'src/constants/constants';
import { Test, TestState } from 'src/models/execution/test';
import {
  StopwatchProcessorImplementation,
  StopwatchProcessorRequest,
} from './processor/stopwatcher-processor';
import { TestTemplate } from 'src/models/template/test.template';
import {
  TestExecutionTurn,
  TestExecutionEdge,
} from 'src/models/execution/test.execution';
import { EnsureThat } from 'src/common/validate';
import { TestService } from '../test/test.service';
import { StopwatchProcess } from 'src/models/execution/stopwatcher-processor';

@Injectable()
export class StopwatcherGatewayService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StopwatcherGatewayService.name);

  private test: Test;

  // Local cache of all stopwatch processors
  private executionStack: Array<StopwatchProcess>;

  constructor(
    private readonly redisDatabase: RedisDatabase,
    private readonly testService: TestService,
  ) {
    this.logger.log('Bulding StopwatcherGatewayService');
  }

  onApplicationBootstrap() {
    this.logger.log(`Initializing...`);
    this.executionStack = [];
    this.startListeningTestUpdateStateChannel();
  }

  private startListeningTestUpdateStateChannel() {
    const channel = RedisConstants.TEST_UPDATE_STATE_CHANNEL;
    const callBack = this.handle.bind(this);
    this.redisDatabase.subscribeOnChannelAndRegisterCallback(channel, callBack);
  }

  private async handle(updatedTestState: string) {
    this.logger.log(`Handling stopwatch`);
    await this.receiveAndParseUpdatedTestMessage(updatedTestState);

    const template: TestTemplate = this.test.template;
    const graph = template.graph;

    if (!graph.stopwatchers || graph.stopwatchers.length === 0) {
      this.logger.log(
        `Template ${template.code} don't have stopwatchers to process, ignored.`,
      );
      return;
    }

    const lastExecutionTurn: TestExecutionTurn = this.testService.getLastExecutionTurn(
      this.test,
    );
    const lastExecutionEdge: TestExecutionEdge = this.testService.getLastExecutionEdge(
      lastExecutionTurn,
    );

    const edge = template.graph.edges.find(
      e => e.sequence === lastExecutionEdge.edge.sequence,
    );
    EnsureThat.isNotNull(
      edge,
      `Can't find edge sequence ${lastExecutionEdge.edge.sequence} in graph of template ${template.code}`,
    );
    const lastEdgeSequenceNumber = edge.sequence;

    const stopwatchers = graph.stopwatchers;

    // Try find some stopwatcher that matchs this last edge
    // sequence and is set for this turn
    const stopwatcherToProccess = stopwatchers.find(s => {
      const lastEdgeSequenceIsBetweenBeginAndEnd =
        lastEdgeSequenceNumber >= s.beginEdgeSequenceNumber &&
        lastEdgeSequenceNumber <= s.endEdgeSequenceNumber;

      const isThisLastTurnSetToHappen = s.turns.includes(
        lastExecutionTurn.number,
      );
      const isNoTurnSetAtStopwatcher = s.turns === null || s.turns.length <= 0;

      return (
        lastEdgeSequenceIsBetweenBeginAndEnd &&
        (isThisLastTurnSetToHappen || isNoTurnSetAtStopwatcher)
      );
    });

    if (stopwatcherToProccess) {
      const beginEdge = stopwatcherToProccess.beginEdgeSequenceNumber;
      const endEdge = stopwatcherToProccess.endEdgeSequenceNumber;

      // Build squence range number
      this.logger.log(
        `Initializing stopwatch process for: ${stopwatcherToProccess}`,
      );
      const edgesSequenceRangeNumberOfStopwatcher: Array<number> = [];
      for (let i = beginEdge; i <= endEdge; i++) {
        edgesSequenceRangeNumberOfStopwatcher.push(i);
      }

      // Build stopwatchProcess object
      const stopwatchProcess: StopwatchProcess = new StopwatchProcess({
        test: this.test,
        edges: edgesSequenceRangeNumberOfStopwatcher,
        turn: lastExecutionTurn.number,
        startTimeStamp: Number.parseInt(
          lastExecutionEdge.startNode.recordedTimeStamp,
        ),
        baseTime: stopwatcherToProccess.time,
      });

      // Check if is already on the execution stack and then add or update
      if (!this.findOnStack(stopwatchProcess)) {
        this.addToStackAndStartProcessing(stopwatchProcess);
      }
    } else {
      this.logger.log(
        `No one Stopwatcher was not found for edge sequence ${lastEdgeSequenceNumber}`,
      );
    }

    this.updateTestOnStack(this.test);
  }

  private async receiveAndParseUpdatedTestMessage(updatedTestMessage: string) {
    this.test = null;

    if (!updatedTestMessage || updatedTestMessage.length <= 0) return;

    const testViewDTO: Test = JSON.parse(updatedTestMessage);
    this.test = await this.testService.foundTestOrThrowError(testViewDTO.code);
  }

  /*
    This function is called by processor for check if the stopwatchProcess
    is done
  */
  private isDone(stopwatchProcess: StopwatchProcess) {
    let isDone = false;
    const test = stopwatchProcess.test;
    const lastExecutionTurn: TestExecutionTurn = this.testService.getLastExecutionTurn(
      test,
    );
    const lastExecutionEdge: TestExecutionEdge = this.testService.getLastExecutionEdge(
      lastExecutionTurn,
    );

    const lastEdge = lastExecutionEdge.edge;

    // Check if the last turn is greater then turn of stopwatchProcess
    const turnIsFinished = lastExecutionTurn.number > stopwatchProcess.turn;
    isDone = turnIsFinished;

    const isTheLastTurn = lastExecutionTurn.number === test.numberOfTurns;
    const endEdgeOfTemplate = test.template.graph.edges
      .sort((a, b) => a.sequence - b.sequence)
      .reverse()[0];
    const isEndEdge = endEdgeOfTemplate.sequence === lastEdge.sequence;
    const isLastTurnAndIsLastEdge =
      isTheLastTurn && isEndEdge && lastExecutionEdge.endNode;

    if (isLastTurnAndIsLastEdge) {
      this.removeStopwatchProcess(stopwatchProcess);
      return true;
    }

    if (!turnIsFinished) {
      const lastEdgeSequenceOfStopwatch = stopwatchProcess.edges.reduce(
        (a, b) => (a > b ? a : b),
      );
      const firstEdgeSequenceOfStopwatch = stopwatchProcess.edges.reduce(
        (a, b) => (a < b ? a : b),
      );

      // last edge is beetwen the edges of stopwatcherProcess
      isDone =
        lastEdge.sequence < firstEdgeSequenceOfStopwatch ||
        lastEdge.sequence > lastEdgeSequenceOfStopwatch;
    }

    if (isDone) this.removeStopwatchProcess(stopwatchProcess);

    return isDone;
  }

  private timeoutCallback(stopwatchTest: StopwatchProcess) {
    // search test on execution queue
    const testCode = stopwatchTest.test.code;
    this.testService.changeState(testCode, TestState.DONE);

    // remove from execution queue
    this.removeStopwatchProcess(stopwatchTest);
  }

  private findOnStack(stopwatchProcess: StopwatchProcess) {
    const filteredStopwatcherProcess: Array<StopwatchProcess> = this.executionStack.filter(
      s => s.test.code === stopwatchProcess.test.code,
    );

    if (filteredStopwatcherProcess) {
      for (const stopwatchProcessOfTest of filteredStopwatcherProcess) {
        if (stopwatchProcessOfTest.stopwatchIsEqualTo(stopwatchProcess))
          return stopwatchProcessOfTest;
      }
    }
    return null;
  }

  private addToStackAndStartProcessing(stopwatchProcess: StopwatchProcess) {
    this.logger.log(
      `StopwatchProcess not in stack yet, pushing and starting processing...`,
    );
    this.executionStack.push(stopwatchProcess);

    // Request new stop watch processor instance
    const timeoutFunction = this.timeoutCallback.bind(this);
    const checkIfIsDoneFunction = this.isDone.bind(this);

    const requestToProcess: StopwatchProcessorRequest = {
      timeoutCallback: timeoutFunction,
      isDoneCallback: checkIfIsDoneFunction,
      stopwatchProcess: stopwatchProcess,
    };

    const processor: StopwatchProcessorImplementation = new StopwatchProcessorImplementation(
      requestToProcess,
    );

    processor.execute();
  }

  private updateTestOnStack(test: Test) {
    this.executionStack.forEach(s => {
      if (s.test.code === test.code) s.test = test;
    });
  }

  private removeStopwatchProcess(stopwatchProcess: StopwatchProcess) {
    const allStopwatchProcessesExceptOneToBeRemove = this.executionStack.filter(
      s => !s.stopwatchIsEqualTo(stopwatchProcess),
    );
    this.executionStack = allStopwatchProcessesExceptOneToBeRemove;
  }

  public getAllStopwatchProcessorInStack(): Array<StopwatchProcess> {
    return this.executionStack;
  }
}
