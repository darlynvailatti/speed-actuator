import { TestModel } from '@/models/test-mode';
import { TestModelConverter } from '@/converter/convert-test-to-view';
import { speedActuatorService } from '@/service/speed-actuator-service';
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store/index';
import { TestViewModel } from '@/models/test-view-model';

export interface InterfaceSpeedActuatorState {
  tests: Array<TestViewModel>;
  testViewCode: string;
}

@Module({
  dynamic: true,
  name: 'speed-actuator-module',
  store,
})
class SpeedActuatorModule extends VuexModule
  implements InterfaceSpeedActuatorState {
  public tests: Array<TestViewModel> = [];
  public testViewCode = '';

  get getTestView(): TestViewModel {
    console.log('get test view by ' + this.testViewCode);
    const testView = this.tests.find(t => t.code === this.testViewCode);
    if (testView) return testView;
    else
      return {
        code: '',
        description: '',
        numberOfTurns: 0,
        state: '',
        turns: [],
        stopwatchers: [],
      };
  }

  get getTests() {
    return this.tests;
  }

  @Mutation
  public setTests(tests: Array<TestViewModel>): void {
    this.tests = tests;
  }

  @Mutation
  public setTestViewCode(testCode: string): void {
    this.testViewCode = testCode;
  }

  @Action({ rawError: true })
  public async viewTestByCode(testCode: string) {
    this.context.commit('setTestViewCode', testCode);
  }

  @Action({ rawError: true })
  public async updateTests(): Promise<void> {
    const allTests: Array<TestModel> = await speedActuatorService.getAllTests();
    const convertedTests: Array<TestViewModel> = [];
    allTests.forEach(t => {
      const converter = new TestModelConverter(t);
      const convertedTest = converter.convertToView();
      convertedTests.push(convertedTest);
    });
    this.context.commit('setTests', convertedTests);
  }

  @Action({ rawError: true })
  public async updateJustOneTest(test: any) {
    const convertedTest = await this.convertToModel(test);
    const otherTests = this.tests.filter(t => t.code != convertedTest.code);
    otherTests.push(convertedTest);
    this.context.commit('setTests', otherTests);
  }

  @Action({ rawError: true })
  public async refreshTest(testCode: string) {
    try {
      const refreshedTest = await speedActuatorService.getTestByCode(testCode);
      await this.updateJustOneTest(refreshedTest);
    } catch (error) {
      throw new Error(`Error on refreshing the test ${testCode}: ${error}`);
    }
  }

  @Action({ rawError: true })
  public async cancelTestExecution(testCode: string): Promise<void> {
    try {
      await speedActuatorService.cancelTestExecution(testCode);
      this.updateTests();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Action({ rawError: true })
  public async setTestExecutionToReady(testCode: string): Promise<void> {
    try {
      await speedActuatorService.setTestExecutionToReady(testCode);
      this.updateTests();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Action({ rawError: true })
  private async convertToModel(test: any): Promise<TestViewModel> {
    const converter = new TestModelConverter(test);
    const convertedTest = converter.convertToView();
    return convertedTest;
  }
}
export const speedActuatorStoreModule = getModule(SpeedActuatorModule);
