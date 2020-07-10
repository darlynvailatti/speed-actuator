import { GraphDTO } from "./graph.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTestTemplateDTO {

    @ApiProperty()
    code: string

    @ApiProperty()
    description: string

    @ApiProperty()
    numberOfTurns: number

    @ApiProperty()
    graph: GraphDTO
}