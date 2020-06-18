import { Module } from '@nestjs/common';
import { StopWatcherGatewayService } from './stop-watcher-gateway.service';
import { DatabaseModule } from '../database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [StopWatcherGatewayService],
})
export class StopWatcherModule {}
