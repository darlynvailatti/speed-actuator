import { ApiProperty } from '@nestjs/swagger';

export class TestExecution {
  @ApiProperty() totalTime?: number;
  @ApiProperty() who: string;
  @ApiProperty() when: Date;
  @ApiProperty() turns: TestExecutionTurn[];
}

export class TestExecutionTurn {
  @ApiProperty() number: number;
  @ApiProperty() startTimeStamp: string;
  @ApiProperty() endTimeStamp?: string;
  @ApiProperty() totalTime?: number;
  @ApiProperty() averageTime?: number;
  @ApiProperty() executionEdges?: TestExecutionEdge[];
}

export class TestExecutionNode {
  @ApiProperty() node: {
    code: string;
  };
  @ApiProperty() recordedTimeStamp?: string;
  @ApiProperty() time?: number;
}

export class TestExecutionEdge {
  @ApiProperty() edge: {
    sequence: number;
  };
  @ApiProperty() velocity?: number;
  @ApiProperty() totalTime?: number;
  @ApiProperty() startNode: TestExecutionNode;
  @ApiProperty() endNode?: TestExecutionNode;
}
