import { Test } from './test';
import { ApiProperty } from '@nestjs/swagger';

export class PostTest {
  @ApiProperty()
  test: Test;
}
