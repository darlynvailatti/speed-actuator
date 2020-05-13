import { Module } from '@nestjs/common';
import { DetectionModule } from './modules/detection/detection.module';
import { StateUpdaterModule } from './modules/state-updater/state-updater.module';
import { StatePublisherModule } from './modules/state-publisher/state-publisher.module';
import { DatabaseModule } from './modules/database/database.module';
import { TestTemplateModule } from './modules/test-template/test-template.module';
import { TestModule } from './modules/test/test.module';
import { TestViewModule } from './modules/test-view/test-view.module';

@Module({
  imports: [
    DatabaseModule,
    DetectionModule,
    StateUpdaterModule,
    StatePublisherModule,
    TestTemplateModule,
    TestModule,
    TestViewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
