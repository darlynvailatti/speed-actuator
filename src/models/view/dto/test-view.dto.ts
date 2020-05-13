export interface TestViewDTO {
    code: string,
    description: string,
    state: string,
    totalTime?: number,
    numberOfTurns: number,
    turns?: TurnDTO[],
    testCompare?: TestViewDTO
}

export interface TurnDTO {
    number: number,
    startTimeStamp: string,
    endTimeStamp: string,
    recordedStartTime: string,
    recordedEndTime: string,
    totalTime: number,
    averageTime: number,
    edges: EdgeDTO[],
}

export interface EdgeDTO {
    code: string,
    description: string,
    velocity: number,
    startTimeStamp: string,
    endTimeStamp: string,
    distance: number,
    startNode: NodeDTO,
    endNode: NodeDTO,
    edgeToCompare?: EdgeDTO
}

export interface NodeDTO {
    code: string,
    description?: string,
    recordedTime: number,
    nodeToCompare?: NodeDTO
}

export class TestViewDTOBuilder {

    static build(
        code: string,
        description: string,
        state: string,
        numberOfTurns: number,
    ) : TestViewDTO {
        return {
            code: code,
            description: description,
            state: state,
            numberOfTurns: numberOfTurns,
        }
    }

}