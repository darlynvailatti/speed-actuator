import { Turn } from '../template/turn';
import { TestTemplate } from 'src/models/template/test.template';
import { TestState } from 'src/models/execution/test';

export class TestView {
  code: string;
  description: string;
  state: TestState;
  template: TestTemplate;
  turns: Array<Turn>;
}
