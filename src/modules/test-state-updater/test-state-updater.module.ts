import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StateUpdaterService } from './test-state-updater.service';
import { TestModule } from '../test/test.module';
import { TestViewModule } from '../test-view/test-view.module';

@Module({
  imports: [DatabaseModule, TestModule, TestViewModule],
  controllers: [],
  providers: [StateUpdaterService],
  exports: [StateUpdaterService]
})
export class StateUpdaterModule {}
