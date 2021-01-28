import { Module } from '@nestjs/common';
import { StopwatchHandlerService } from './stopwatch-handler.service';
import { DatabaseModule } from '../database/database.module';
import { TestModelModule } from '../test-model/test-model.module';
import { StopwatchController } from './stopwatch.controller';

@Module({
  imports: [DatabaseModule, TestModelModule],
  controllers: [StopwatchController],
  providers: [StopwatchHandlerService],
})
export class StopwatchModule {}
