import { Module } from '@nestjs/common';
import { DetectionModule } from './modules/detection/detection.module';
import { StateUpdaterModule } from './modules/test-state-updater/test-state-updater.module';
import { StatePublisherModule } from './modules/test-state-publisher/state-publisher.module';
import { DatabaseModule } from './modules/database/database.module';
import { TestTemplateModule } from './modules/test-template/test-template.module';
import { TestModule } from './modules/test/test.module';
import { TestViewModule } from './modules/test-view/test-view.module';
import { StopWatcherModule } from './modules/stop-watcher/stop-watcher.module';

@Module({
  imports: [
    DatabaseModule,
    DetectionModule,
    StateUpdaterModule,
    StatePublisherModule,
    TestTemplateModule,
    TestModule,
    TestViewModule,
    StopWatcherModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
