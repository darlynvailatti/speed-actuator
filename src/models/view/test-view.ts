import { Turn } from '../template/turn';
import { TestTemplate } from 'src/models/template/test.template';
import { TestState } from 'src/models/execution/test';
import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';

export class TestView {
  @ApiProperty() code: string;
  @ApiProperty() description: string;
  @ApiProperty() state: TestState;
  @ApiProperty() template: TestTemplate;
  @ApiProperty({ type: [Turn] }) turns: Array<Turn>;
}
