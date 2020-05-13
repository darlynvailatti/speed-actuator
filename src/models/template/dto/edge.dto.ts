import { Edge } from "../edge";

export interface EdgeDTO {
    description: string,
    distance: number,
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
            startNode: {
                code: edgeDTO.startNode
            },
            endNode: {
                code: edgeDTO.endNode
            } 
        }
    }

}