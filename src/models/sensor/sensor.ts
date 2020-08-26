import { ApiProperty } from '@nestjs/swagger';

export class Sensor {
  @ApiProperty() code: string;
}
