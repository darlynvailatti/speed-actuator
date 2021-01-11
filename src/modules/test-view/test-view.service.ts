import { Injectable } from '@nestjs/common';
import { TestRepositoryService } from '../database/test-repository.service';
import { Test } from 'src/models/execution/test';
import { Edge } from 'src/models/template/edge';
import { Turn } from 'src/models/template/turn';

@Injectable()
export class TestViewService {
  constructor(readonly testRepositoryService: TestRepositoryService) {}

  async getTestView(testCode: string): Promise<Test> {
    const test = await this.testRepositoryService.findOne(testCode);

    if (!test) throw new Error(`Can't find Test with code ${testCode}`);

    return test;
  }

  async getAllInExecution(): Promise<Array<Test>> {
    const tests = await this.testRepositoryService.findReadyOrStarted();
    if (!tests) {
      return [];
    }
    return tests;
  }

  async getAll(): Promise<Test[]> {
    const tests = await this.testRepositoryService.getAll();
    if (!tests) {
      return [];
    }
    return tests;
  }
}
