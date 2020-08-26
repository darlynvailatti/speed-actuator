import { Module } from '@nestjs/common';
import { StopwatcherGatewayService } from './stopwatcher-gateway.service';
import { DatabaseModule } from '../database/database.module';
import { TestModule } from '../test/test.module';
import { StopwatchController } from './stopwatcher.controller';

@Module({
  imports: [DatabaseModule, TestModule],
  controllers: [StopwatchController],
  providers: [StopwatcherGatewayService],
})
export class StopWatcherModule {}
