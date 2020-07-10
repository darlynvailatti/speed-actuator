import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class NodeDTO {
    @ApiProperty() code: string
    @ApiPropertyOptional() description?: string
    @ApiProperty() recordedTime: number
    @ApiPropertyOptional() nodeToCompare?: NodeDTO
}

export class EdgeDTO {
    @ApiProperty() sequence: number
    @ApiProperty() description: string
    @ApiProperty() velocity: number
    @ApiProperty() totalTime: number
    @ApiProperty() startTimeStamp: string
    @ApiProperty() endTimeStamp: string
    @ApiProperty() distance: number
    @ApiProperty() startNode: NodeDTO
    @ApiProperty() endNode: NodeDTO
    @ApiPropertyOptional() edgeToCompare?: EdgeDTO
}

export class TurnDTO {
    @ApiProperty() number: number
    @ApiProperty() startTimeStamp: string
    @ApiProperty() endTimeStamp: string
    @ApiProperty() recordedStartTime: string
    @ApiProperty() recordedEndTime: string
    @ApiProperty() totalTime: number
    @ApiProperty() averageTime: number
    @ApiProperty({type: [EdgeDTO]}) edges: EdgeDTO[]
}

export class TestViewDTO {
    @ApiProperty() code: string
    @ApiProperty() description: string
    @ApiProperty() templateCode: string
    @ApiProperty() state: string
    @ApiPropertyOptional() totalTime?: number
    @ApiProperty() numberOfTurns: number
    @ApiPropertyOptional({type: [TurnDTO]}) turns?: TurnDTO[]
    @ApiProperty() testCompare?: TestViewDTO
}


export class TestViewDTOBuilder {

    static build(
        code: string,
        description: string,
        state: string,
        numberOfTurns: number,
        templateCode: string
    ) : TestViewDTO {
        return {
            code: code,
            description: description,
            state: state,
            numberOfTurns: numberOfTurns,
            templateCode: templateCode
        }
    }

}