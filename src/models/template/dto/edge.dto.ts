import { Edge } from "../edge";
import { ApiProperty } from "@nestjs/swagger";

export class EdgeDTO {
    
    @ApiProperty()
    description: string

    @ApiProperty()
    distance: number

    @ApiProperty()
    baseTime?: number

    @ApiProperty()
    stopWatch?: boolean

    @ApiProperty()
    sequence?: number

    @ApiProperty()
    startNode: string

    @ApiProperty()
    endNode: string
}

export class EdgeDTOConverter {

    static convertToModel(edgeDTO: EdgeDTO): Edge {
        return {
            description: edgeDTO.description,
            sequence: edgeDTO.sequence,
            distance: edgeDTO.distance,
            baseTime: edgeDTO.baseTime,
            stopWatch: edgeDTO.stopWatch,
            startNode: {
                code: edgeDTO.startNode
            },
            endNode: {
                code: edgeDTO.endNode
            } 
        }
    }

}