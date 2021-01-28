import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StateEngineService } from './test-engine.service';
import { TestModelModule } from '../test-model/test-model.module';
import { TestViewModule } from '../test-view/test-view.module';

@Module({
  imports: [DatabaseModule, TestModelModule, TestViewModule],
  controllers: [],
  providers: [StateEngineService],
  exports: [StateEngineService],
})
export class StateEngineModule {}
