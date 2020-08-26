import { Injectable, Logger } from '@nestjs/common';
import { TestRepositoryService } from '../database/test-repository.service';
import { Test, TestState } from 'src/models/execution/test';
import { TestTemplate } from 'src/models/template/test.template';
import {
  TestExecutionNode,
  TestExecutionTurn,
  TestExecution,
} from 'src/models/execution/test.execution';
import { SensorDetectionMessage } from 'src/models/sensor/sensor-message';
import { Constants } from 'src/constants/constants';
import { RedisDatabase } from '../database/redis.database';
import { TestViewService } from '../test-view/test-view.service';
import { ProcessorBeginOfTestExecution } from './processor/processor-begin-of-test-execution';
import { ProcessorMidleOfTurn as ProcessorMidleOrEndOfTestExecution } from './processor/processor-midle-or-end-of-test-execution';
import ProcessorConvertDetectionToExecutionNode from './processor/processor-convert-detection-to-execution-node';
import { ProcessorGetCurrentTurnOrCreateOne } from './processor/processor-get-current-turn-or-create-one';

@Injectable()
export class StateUpdaterService {
  private readonly logger = new Logger(StateUpdaterService.name);

  private testsInExecution: Array<Test>;
  private test: Test;
  private testTemplate: TestTemplate;
  private sensorDetectionMessage: SensorDetectionMessage;
  private executionNode: TestExecutionNode;
  private currentTurn: TestExecutionTurn;
  private receivedDetectionMessage: string;

  constructor(
    private readonly redisDatabase: RedisDatabase,
    private readonly testeViewService: TestViewService,
    private readonly testRespositoryService: TestRepositoryService,
  ) {}

  async processDetection(message: string) {
    try {
      this.initilizeAttributes();

      this.receivedDetectionMessage = message;
      this.logger.log(`Process detection message: ${message}`);

      await this.findTestsInExecution();

      for (const test of this.testsInExecution) {
        this.logger.log(`Start Processing of test: ${test.code}`);

        this.test = test;
        this.testTemplate = this.test.template;
        this.createNewExecutionTestIfNotExist();
        this.parseDetectionMessage();
        await this.convertDetectionToExecutionNode();

        if (!this.executionNode) {
          this.logger.log(
            `Detection message don't match graph of test code ${this.test.code}`,
          );
          continue;
        }

        await this.getCurrentTurnOrCreateOne();

        const isBeginOfTurn = this.test.state === TestState.READY;

        if (isBeginOfTurn) {
          await this.processBeginOfTestExecution();
        } else {
          await this.processMidleOrEndOfTestExecution();
        }

        this.setCurrentTurnOnTestExecution();
        this.testRespositoryService.save(this.test);
        this.publish();
      }
    } catch (error) {
      const formattedMessageError = `Process detection fail: ${error.message}`;
      this.logger.error(formattedMessageError);
      throw new Error(formattedMessageError);
    }
  }

  private initilizeAttributes() {
    this.testsInExecution = [];
    this.test = null;
    this.testTemplate = null;
    this.sensorDetectionMessage = null;
    this.executionNode = null;
    this.currentTurn = null;
    this.receivedDetectionMessage = null;
  }

  private parseDetectionMessage() {
    if (!this.receivedDetectionMessage)
      throw new Error(`Detection message cat't be empty`);
    const sensorDetectionMessage: SensorDetectionMessage = JSON.parse(
      this.receivedDetectionMessage,
    );
    this.sensorDetectionMessage = sensorDetectionMessage;
  }

  private createNewExecutionTestIfNotExist() {
    if (!this.test.testExecution) {
      this.logger.log(`Creating new execution test for test ${this.test.code}`);
      const newTestExecution: TestExecution = {
        when: new Date(),
        who: 'user',
        turns: [],
      };
      this.test.testExecution = newTestExecution;
    }
  }

  private async findTestsInExecution() {
    this.logger.log(`Finding ready or started tests...`);
    this.testsInExecution = await this.testRespositoryService.findReadyOrStarted();
    this.logger.log(`Found Test's in execution: ${this.testsInExecution}`);
  }

  private async convertDetectionToExecutionNode() {
    const processor = new ProcessorConvertDetectionToExecutionNode(
      this.sensorDetectionMessage,
      this.testTemplate,
    );
    this.executionNode = await processor.execute();
  }

  private async getCurrentTurnOrCreateOne() {
    const processor = new ProcessorGetCurrentTurnOrCreateOne(
      this.test,
      this.executionNode,
    );

    this.currentTurn = await processor.execute();
    this.logger.log(`Current turn number:  ${this.currentTurn.number}`);
  }

  private async processBeginOfTestExecution() {
    const processor = new ProcessorBeginOfTestExecution(
      this.test,
      this.testTemplate,
      this.executionNode,
      this.currentTurn,
    );
    await processor.execute();
  }

  private async processMidleOrEndOfTestExecution() {
    const processor = new ProcessorMidleOrEndOfTestExecution(
      this.test,
      this.testTemplate,
      this.executionNode,
      this.currentTurn,
    );
    await processor.execute();
  }

  private setCurrentTurnOnTestExecution() {
    this.test.testExecution.turns = this.test.testExecution.turns.filter(
      t => t.number != this.currentTurn.number,
    );
    this.test.testExecution.turns.push(this.currentTurn);
  }

  private async publish() {
    this.logger.log(`Publishing in update state channel...`);
    const redisPubClient = this.redisDatabase.getPublisherClient();
    redisPubClient.publish(
      Constants.TEST_UPDATE_STATE_CHANNEL,
      JSON.stringify(this.test),
    );
  }
}
