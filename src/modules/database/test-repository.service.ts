import { Injectable, Logger } from '@nestjs/common';
import { Test, TestState } from 'src/models/execution/test';
import { RedisDatabase } from './redis.database';

@Injectable()
export class TestRepositoryService {
  private readonly logger = new Logger(TestRepositoryService.name);

  private readonly MODEL_NAME = 'test';

  constructor(private readonly redisDatabase: RedisDatabase) {}

  async findOne(code: string): Promise<Test> {
    const redisClient = this.redisDatabase.getRepositoryClient();
    const testAsString = await redisClient.get(this.getKey(code));
    const test: Test = JSON.parse(testAsString);
    return test;
  }

  async findReadyOrStarted(): Promise<Array<Test>> {
    const client = this.redisDatabase.getRepositoryClient();
    const tests: Array<string> = await client.keys(this.MODEL_NAME + '*');

    if (!tests) return [];

    const foundTests = [];
    for (const testKey of tests) {
      const test: Test = await JSON.parse(await client.get(testKey));
      if (test.state === TestState.READY || test.state === TestState.STARTED) {
        foundTests.push(test);
      }
    }
    return foundTests;
  }

  async save(newTest: Test): Promise<boolean> {
    const redisClient = this.redisDatabase.getRepositoryClient();
    const testCode = newTest.code;
    const key = this.getKey(testCode);
    const testJson = JSON.stringify(newTest);
    await redisClient.set(key, testJson);
    return true;
  }

  private getKey(code: string): string {
    return this.MODEL_NAME + ':' + code;
  }
}
