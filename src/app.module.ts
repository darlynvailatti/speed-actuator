import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DetectionModule } from './modules/detection/detection.module';
import { StateEngineModule } from './modules/test-engine/test-engine.module';
import { TestStateManagerModule } from './modules/test-state-manager/test-state-manager.module';
import { DatabaseModule } from './modules/database/database.module';
import { TestTemplateModule } from './modules/test-template/test-template.module';
import { TestModelModule } from './modules/test-model/test-model.module';
import { TestViewModule } from './modules/test-view/test-view.module';
import { StopwatchModule } from './modules/stopwatch/stopwatch.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DetectionModule,
    StateEngineModule,
    TestStateManagerModule,
    TestTemplateModule,
    TestModelModule,
    TestViewModule,
    StopwatchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
