import { Module } from '@nestjs/common';
import { StopWatcherGatewayService } from './stop-watcher-gateway.service';
import { DatabaseModule } from '../database/database.module';
import { TestModule } from '../test/test.module';
import { StopwatchController } from './stop-watcher.controller';


@Module({
  imports: [DatabaseModule, TestModule],
  controllers: [StopwatchController],
  providers: [StopWatcherGatewayService],
})
export class StopWatcherModule {}
