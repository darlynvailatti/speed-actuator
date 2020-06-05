
export interface TestExecution {
    totalTime?: number,
    who: string,
    when: Date
    turns: TestExecutionTurn[]
}

export interface TestExecutionTurn {
    number: number,
    startTimeStamp: string,
    endTimeStamp?: string,
    totalTime?: number,
    averageTime?: number,
    executionEdges?: TestExecutionEdge[]
}

export interface TestExecutionEdge {
    edge: {
        sequence: number
    },
    velocity?: number,
    totalTime?: number,
    startNode: TestExecutionNode,
    endNode?:TestExecutionNode
}

export interface TestExecutionNode {
    node: {
        code: string,
    },
    recordedTimeStamp?: string,
    time?: number
}