import { Module } from '@nestjs/common';
import { TestModelExecutionController as TestController } from './test-model-execution.controller';
import { TestService } from './test-model.service';
import { DatabaseModule } from '../database/database.module';
import { TestTemplateModule } from '../test-template/test-template.module';

@Module({
  imports: [DatabaseModule, TestTemplateModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModelModule {}
