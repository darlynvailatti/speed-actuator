import { ApiProperty } from "@nestjs/swagger"
import { Edge } from "./edge"

export class Turn {
    @ApiProperty() number: number
    @ApiProperty() startTimeStamp: string
    @ApiProperty() endTimeStamp: string
    @ApiProperty() recordedStartTime: string
    @ApiProperty() recordedEndTime: string
    @ApiProperty({type: Edge}) edges: Array<Edge>
}
