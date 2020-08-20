import { Module } from '@nestjs/common';
import { DetectionListenerService } from './detection-listener.service';
import { DatabaseModule } from '../database/database.module';
import { StateUpdaterService } from './test-state-updater.service';
import { TestModule } from '../test/test.module';
import { TestViewModule } from '../test-view/test-view.module';

@Module({
  imports: [DatabaseModule, TestModule, TestViewModule],
  controllers: [],
  providers: [DetectionListenerService, StateUpdaterService],
})
export class StateUpdaterModule {}
