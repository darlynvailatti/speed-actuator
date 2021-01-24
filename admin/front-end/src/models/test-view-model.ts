export interface TestViewNode {
  code: string;
  recordedTimeStamp: string;
}

export interface TestViewStopwatchDefinition {
  time: number;
}

export interface TestViewEdge {
  sequence: number;
  description: string;
  distance: number;
  totalTime: number;
  velocity: number;
  startNode: TestViewNode;
  endNode: TestViewNode;
  isCompleted: boolean;
}

export interface TestViewTurn {
  number: number;
  totalTime: number;
  startTimeStamp: string;
  endTimeStamp: string;
  edges: Array<TestViewEdge>;
  isCompleted: boolean;
}

export interface TestViewStopwatchDefinition {
  time: number;
  beginEdgeSequenceNumber: number;
  endEdgeSequenceNumber: number;
  turns: Array<number>;
}

export interface TestViewModel {
  code: string;
  state: string;
  description: string;
  numberOfTurns: number;
  turns: Array<TestViewTurn>;
  stopwatchers: Array<TestViewStopwatchDefinition>;
}
