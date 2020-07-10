import { ApiProperty } from "@nestjs/swagger"

export class CreateTestTemplateDTO {

    @ApiProperty()
    description: string
    
    @ApiProperty()
    numberOfTurns: number
}

