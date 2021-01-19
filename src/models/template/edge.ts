import { ApiProperty } from '@nestjs/swagger';

export class Node {
  code: string;
}

export class Edge {
  @ApiProperty() code?: string;
  @ApiProperty() sequence?: number;
  @ApiProperty() description: string;
  @ApiProperty() distance: number;
  @ApiProperty() velocity?: number;
  @ApiProperty() totalTime?: number;
  @ApiProperty() startTimeStamp?: string;
  @ApiProperty() endTimeStamp?: string;
  @ApiProperty({ type: Node }) startNode: Node;
  @ApiProperty({ type: Node }) endNode: Node;
}
