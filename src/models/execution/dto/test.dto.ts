import { ApiProperty } from "@nestjs/swagger"

export class TestTemplateDTO {

    @ApiProperty()
    code: string
}

export class TestDTO {

    @ApiProperty()
    code: string

    @ApiProperty()
    description: string

    @ApiProperty()
    state: string

    @ApiProperty()
    testTemplate: TestTemplateDTO
}

