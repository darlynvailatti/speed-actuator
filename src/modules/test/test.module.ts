import { Module } from '@nestjs/common';
import { TestExecutionController as TestController } from './test.controller';
import { TestService } from './test.service';
import { DatabaseModule } from '../database/database.module';
import { TestTemplateModule } from '../test-template/test-template.module';

@Module({
  imports: [DatabaseModule, TestTemplateModule],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService]
})
export class TestModule {}
