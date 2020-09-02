import { Graph } from './graph';
import { ApiProperty } from '@nestjs/swagger';

export class TestTemplate {
  @ApiProperty() code?: string;
  @ApiProperty() description?: string;
  @ApiProperty() numberOfTurns?: number;
  @ApiProperty({ type: Graph }) graph?: Graph;
}

export class TestTemplateFactory {
  static build({
    description,
    numberOfTurns = 0,
  }: {
    description: string;
    numberOfTurns?: number;
  }): TestTemplate {
    return {
      description: description,
      numberOfTurns: numberOfTurns,
    };
  }
}
