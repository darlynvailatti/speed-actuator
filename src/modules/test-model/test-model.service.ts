import { Injectable, Logger } from '@nestjs/common';
import { TestRepositoryService } from '../database/test-repository.service';
import { TestTemplateService } from '../test-template/test-template.service';
import { TestState, Test } from 'src/models/execution/test';
import { TestStateMachine } from './impl/test-state-machine';
import { PostTest } from 'src/models/execution/post-test';
import {
  TestExecutionTurn,
  TestExecutionEdge,
} from 'src/models/execution/test.execution';
import { RedisDatabase } from '../database/redis.database';
import { RedisConstants } from 'src/constants/constants';

@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);

  constructor(
    private readonly testRepositoryService: TestRepositoryService,
    private readonly testTemplateService: TestTemplateService,
    private readonly redisDatabase: RedisDatabase,
  ) {}

  async postTest(postTest: PostTest): Promise<boolean> {
    this.logger.log(`New request - posting Test: ${JSON.stringify(postTest)}`);

    const newTest = postTest.test;

    const validationTemplateResponse = await this.testTemplateService.validateTemplate(
      newTest.template,
    );
    if (!validationTemplateResponse.isValid) {
      throw new Error(validationTemplateResponse.causeIfIsNotValid);
    }

    newTest.state = TestState.IDLE;
    const wasCreated = await this.testRepositoryService.save(newTest);

    this.logger.log(`Was Test created? ${JSON.stringify(wasCreated)}`);

    return wasCreated;
  }

  async changeState(testCode: string, newState: TestState) {
    try {
      const foundTest = await this.foundTestOrThrowError(testCode);
      const isAlreadyInThisState = foundTest.state === newState;
      if (isAlreadyInThisState)
        throw new Error(`Test ${testCode} is already ${newState}`);
      TestStateMachine.change(foundTest, newState);
      await this.updateTest(foundTest);
    } catch (error) {
      throw new Error(`Error when start Test: ${error.message}`);
    }
  }

  async updateTest(test: Test): Promise<boolean> {
    const updatedTest = await this.testRepositoryService.save(test);
    await this.publishTestState(test);
    return updatedTest;
  }

  public getLastExecutionTurn(test: Test): TestExecutionTurn {
    if (!test) throw new Error(`Can't get last execution turn of null test`);

    if (!test.testExecution) return null;

    const testExecution = test.testExecution;
    const turns = testExecution.turns;

    if (!turns) return null;

    return turns.sort((x, y) => x.number - y.number).reverse()[0];
  }

  public getLastExecutionEdge(
    testExecutionTurn: TestExecutionTurn,
  ): TestExecutionEdge {
    if (!testExecutionTurn) return null;

    const executionEdges = testExecutionTurn.executionEdges;

    if (!executionEdges || executionEdges.length <= 0) return null;

    return executionEdges
      .sort((x, y) => x.edge.sequence - y.edge.sequence)
      .reverse()[0];
  }

  public async foundTestOrThrowError(testCode: string): Promise<Test> {
    const foundTest = await this.testRepositoryService.findOne(testCode);

    if (!foundTest) throw new Error(`Can't find Test with code ${testCode}`);

    return foundTest;
  }

  public async publishTestState(test: Test) {
    if (!test) throw new Error(`Can't publish state for a null test`);

    this.logger.log(`Publishing in update state channel...`);
    const redisPubClient = this.redisDatabase.getPublisherClient();
    redisPubClient.publish(
      RedisConstants.TEST_UPDATE_STATE_CHANNEL,
      JSON.stringify(test),
    );
  }
}
