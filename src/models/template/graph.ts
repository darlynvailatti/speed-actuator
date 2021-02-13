import { Edge } from './edge';
import { Node } from './node';
import { ApiProperty } from '@nestjs/swagger';
import { Stopwatch as StopwatchDefinition } from './stopwatch-definition';

export class Graph {
  @ApiProperty() code?: string;
  @ApiProperty() description: string;
  @ApiProperty({ type: [StopwatchDefinition] }) stopwatchDefinitions?: Array<
    StopwatchDefinition
  >;
  @ApiProperty({ type: [Edge] }) edges?: Edge[];
  @ApiProperty({ type: [Node] }) nodes?: Node[];
}

export class GraphBuilder {
  static build(description: string): Graph {
    return {
      description: description,
    };
  }
}
