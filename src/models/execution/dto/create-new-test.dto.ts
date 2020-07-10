import { ApiProperty } from "@nestjs/swagger"
import { TestTemplateDTO } from "./test.dto"


export class CreateNewTestDTO {

    @ApiProperty()
    description: string

    @ApiProperty()
    numberOfTurns: number

    @ApiProperty()
    testTemplate: TestTemplateDTO
}

