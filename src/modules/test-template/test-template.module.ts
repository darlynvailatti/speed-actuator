import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/database/database.module';
import { TestTemplateController } from './test-template.controller';
import { TestTemplateService } from './test-template.service';
import { TestTemplateValidatorService } from './validation/test-template-validator.service';

@Module({
    imports: [DatabaseModule],
    controllers: [TestTemplateController],
    providers: [TestTemplateService, TestTemplateValidatorService],
    exports: [TestTemplateService]
})
export class TestTemplateModule {

}