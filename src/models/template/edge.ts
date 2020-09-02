import { ApiProperty } from '@nestjs/swagger';

export class Edge {
  @ApiProperty() code?: string;
  @ApiProperty() sequence?: number;
  @ApiProperty() description: string;
  @ApiProperty() distance: number;
  @ApiProperty() velocity?: number;
  @ApiProperty() totalTime?: number;
  @ApiProperty() startTimeStamp?: string;
  @ApiProperty() endTimeStamp?: string;
  @ApiProperty() startNode: {
    code: string;
  };
  @ApiProperty() endNode: {
    code: string;
  };
}
