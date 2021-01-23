import { ApiProperty } from '@nestjs/swagger';
import { Test } from './test';

export class StopwatchProcess {
  @ApiProperty({ type: Test }) test: Test;
  @ApiProperty() turn: number;
  @ApiProperty() edges: Array<number>;
  @ApiProperty() baseTime: number;
  @ApiProperty() startTimeStamp: number;

  constructor({ test, turn, edges, baseTime, startTimeStamp }) {
    this.test = test;
    this.turn = turn;
    this.baseTime = baseTime;
    this.edges = edges;
    this.startTimeStamp = startTimeStamp;
  }

  public stopwatchIsEqualTo(stopwatch: StopwatchProcess): boolean {
    let isTheSameEdges = false;
    for (const edge of this.edges) {
      isTheSameEdges = stopwatch.edges.includes(edge);
    }

    let isTheSameTurns = false;
    if (!this.turn) isTheSameTurns = true;
    else isTheSameTurns = this.turn === stopwatch.turn;

    return isTheSameEdges && isTheSameTurns;
  }
}
