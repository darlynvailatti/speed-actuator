import { Injectable } from '@nestjs/common';
import { TestTemplateValidatorService } from './validation/test-template-validator.service';
import { TestTemplate } from 'src/models/template/test.template';
import {
  ValidationRequest,
  ValidationResponse,
} from './validation/validation.dto';

@Injectable()
export class TestTemplateService {
  constructor(
    private readonly testTemplateValidatorService: TestTemplateValidatorService,
  ) {}

  async validateTemplate(template: TestTemplate): Promise<ValidationResponse> {
    const validationRequest: ValidationRequest = {
      testTemplate: template,
    };
    return await this.testTemplateValidatorService.validate(validationRequest);
  }
}
