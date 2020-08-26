import { ApiProperty } from '@nestjs/swagger';

export class Stopwatch {
  @ApiProperty() time: number;
  @ApiProperty() beginEdgeSequenceNumber: number;
  @ApiProperty() endEdgeSequenceNumber: number;
  @ApiProperty({ type: [Number] }) turns: Array<number>;
}
