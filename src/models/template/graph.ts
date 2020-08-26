import { Edge } from './edge';
import { Node } from './node';
import { ApiProperty } from '@nestjs/swagger';
import { Stopwatch } from './stopwatch';

export class Graph {
  @ApiProperty() code?: string;
  @ApiProperty() description: string;
  @ApiProperty({ type: [Stopwatch] }) stopwatchers?: Array<Stopwatch>;
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
