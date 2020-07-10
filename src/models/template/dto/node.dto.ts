import { Node } from "../node";
import { ApiProperty } from "@nestjs/swagger";


export class NodeSensorDTO {
    
    @ApiProperty()
    code: string

    @ApiProperty()
    description?: string
}

export class NodeDTO {

    @ApiProperty()
    code: string

    @ApiProperty()
    sensor: NodeSensorDTO
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