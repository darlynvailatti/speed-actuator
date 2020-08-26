import { TestTemplate } from 'src/models/template/test.template';

export interface ValidationRequest {
  testTemplate: TestTemplate;
}

export interface ValidationResponse {
  isValid: boolean;
  causeIfIsNotValid?: string;
}
