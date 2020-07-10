import { ApiProperty } from "@nestjs/swagger"

export class StopwatchTestDTO {
    @ApiProperty() testCode: string
    @ApiProperty() turnNumber: number
    @ApiProperty() edgeSequence: number
    @ApiProperty() baseTime: number
    @ApiProperty() lastTimeStamp: number

}
