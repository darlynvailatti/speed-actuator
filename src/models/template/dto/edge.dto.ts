import { Edge } from "../edge";

export interface EdgeDTO {
    description: string,
    distance: number,
    baseTime?: number,
    stopWatch?: boolean,
    sequence?: number,
    startNode: string
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