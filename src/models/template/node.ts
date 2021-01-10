import { Sensor } from '../sensor/sensor';
import { ApiProperty } from '@nestjs/swagger';

export class Node {
  @ApiProperty() code: string;
  @ApiProperty({ type: Sensor }) sensor: Sensor;
}