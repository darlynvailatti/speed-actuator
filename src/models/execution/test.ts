import { TestExecution } from './test.execution';
import { TestTemplate } from 'src/models/template/test-template';
import { ApiProperty } from '@nestjs/swagger';

export class Test {
  @ApiProperty() code?: string;
  @ApiProperty() description: string;
  @ApiProperty() state: TestState;
  @ApiProperty() numberOfTurns: number;
  @ApiProperty() template: TestTemplate;
  @ApiProperty() testExecution?: TestExecution;
}

export enum TestState {
  IDLE = 'IDLE',
  READY = 'READY',
  STARTED = 'STARTED',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}
