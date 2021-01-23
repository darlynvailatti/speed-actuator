import { ApiProperty } from '@nestjs/swagger';
import { StopwatchProcess } from 'src/models/execution/stopwatcher-process';

export default class StopwatchProcessDTO {
  @ApiProperty() testCode: string;
  @ApiProperty() turn: number;
  @ApiProperty({ type: [Number] }) edgesSequences: Array<number>;
  @ApiProperty() baseTime: number;
  @ApiProperty() startTimeStamp: number;
}

export class StopwatchDTOConverter {
  stopwatchProcess: StopwatchProcess;

  constructor(stopwatchProcess: StopwatchProcess) {
    this.stopwatchProcess = stopwatchProcess;
  }

  public convert(): StopwatchProcessDTO {
    return {
      baseTime: this.stopwatchProcess.baseTime,
      edgesSequences: this.stopwatchProcess.edges,
      startTimeStamp: this.stopwatchProcess.startTimeStamp,
      testCode: this.stopwatchProcess.test.code,
      turn: this.stopwatchProcess.turn,
    };
  }
}
