import { Module } from '@nestjs/common';
import { TestViewController } from './test-view.controller';
import { TestViewService } from './test-view.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TestViewController],
  providers: [TestViewService],
  exports: [TestViewService]
})
export class TestViewModule {}
