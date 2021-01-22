export interface Stopwatcher {
  time: number;
  beginEdgeSequenceNumber: number;
  endEdgeSequenceNumber: number;
  turns: Array<number>;
}

export interface EdgeNode {
  code: string;
}

export interface Edge {
  sequence: number;
  description: string;
  distance: number;
  startNode: EdgeNode;
  endNode: EdgeNode;
}

export interface TemplateGraph {
  stopwatchers?: Array<Stopwatcher>;
  edges: Array<Edge>;
}

export interface Template {
  description: string;
  numberOfTurns: number;
  graph: TemplateGraph;
}

export interface TextExecutionNode {
  node: {
    code: string;
  };
  recordedTimeStamp: string;
}
export interface TestExecutionEdge {
  edge: {
    sequence: number;
  };
  startNode: TextExecutionNode;
  endNode?: TextExecutionNode;
  totalTime?: number;
  velocity?: number;
}
export interface TestExecutionTurn {
  number: number;
  startTimeStamp: string;
  endTimeStamp?: string;
  totalTime?: number;
  executionEdges: Array<TestExecutionEdge>;
}

export interface TestExecution {
  when: string;
  who: string;
  turns: Array<TestExecutionTurn>;
}

export interface TestModel {
  code: string;
  state: string;
  template: Template;
  testExecution?: TestExecution;
}
