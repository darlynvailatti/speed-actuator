import { Module } from '@nestjs/common';
import { TestStateListenerService } from './test-state-listener.service';
import { TestStateWebsocket } from 'src/modules/test-state-manager/test-state-websocket.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [TestStateListenerService, TestStateWebsocket],
})
export class TestStateManagerModule {}
