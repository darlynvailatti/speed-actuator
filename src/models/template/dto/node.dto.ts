import { Node } from "../node";

export interface NodeDTO {
    code: string,
    sensor: {
        code: string,
        description?: string
    }
}

export class NodeDTOConverter {

    static convertToModel(nodeDTO: NodeDTO) : Node {
        return {
            code: nodeDTO.code,
            sensor: {
                code: nodeDTO.sensor.code
            },
        }
    }

}