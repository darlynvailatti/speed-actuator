import { Module } from '@nestjs/common';
import { StopWatcherGatewayService } from './stop-watcher-gateway.service';
import { DatabaseModule } from '../database/database.module';
import { TestModule } from '../test/test.module';


@Module({
  imports: [DatabaseModule, TestModule],
  controllers: [],
  providers: [StopWatcherGatewayService],
})
export class StopWatcherModule {}
