import { TestModel } from '@/models/test-mode';
import { TestModelConverter } from '@/converter/convert-test-to-view';
import { speedActuatorServiceInstance } from '@/service/speed-actuator-service';
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store/index';
import { TestViewModel } from '@/models/test-view-model';
import { StopwatchProcess } from '@/models/stopwatch-model';

export interface InterfaceSpeedActuatorState {
  baseUrl: string;
  tests: Array<TestViewModel>;
  testViewCode: string;
  stopwatchProcesses: Array<StopwatchProcess>;
}

@Module({
  dynamic: true,
  name: 'speed-actuator-module',
  store,
})
class SpeedActuatorModule extends VuexModule
  implements InterfaceSpeedActuatorState {
  public baseUrl!: string;
  public stopwatchProcesses: Array<StopwatchProcess> = [];
  public tests: Array<TestViewModel> = [];
  public testViewCode = '';

  get getTestView(): TestViewModel {
    const testView = this.tests.find(t => t.code === this.testViewCode);
    if (testView) return testView;
    else
      return {
        code: '',
        description: '',
        numberOfTurns: 0,
        state: '',
        turns: [],
        stopwatchDefinitions: [],
      };
  }

  get getTests() {
    return this.tests;
  }

  get stopwatchProcessesOfTestView(): Array<StopwatchProcess> {
    const found = this.stopwatchProcesses.filter(s => {
      return s.testCode === this.testViewCode;
    });

    return found;
  }

  @Mutation
  public setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  @Mutation
  public setTests(tests: Array<TestViewModel>): void {
    this.tests = tests;
  }

  @Mutation
  public setTestViewCode(testCode: string): void {
    this.testViewCode = testCode;
  }

  @Mutation
  public setStopwatchProcesses(stopwatchProcesses: Array<StopwatchProcess>) {
    this.stopwatchProcesses = stopwatchProcesses;
  }

  @Action({ rawError: true })
  public async viewTestByCode(testCode: string) {
    await this.updateTests();
    await this.updateStopwachProcesses();
    this.context.commit('setTestViewCode', testCode);
  }

  @Action({ rawError: true })
  public async updateTests(): Promise<void> {
    const allTests: Array<TestModel> = await speedActuatorServiceInstance.getAllTests();
    const convertedTests: Array<TestViewModel> = [];
    allTests.forEach(t => {
      const converter = new TestModelConverter(t);
      const convertedTest = converter.convertToView();
      convertedTests.push(convertedTest);
    });
    this.context.commit('setTests', convertedTests);
  }

  @Action({ rawError: true })
  public async updateStopwachProcesses(): Promise<void> {
    const stopwatchProcesses = await speedActuatorServiceInstance.getStopwatchProcesses();
    this.context.commit('setStopwatchProcesses', stopwatchProcesses);
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
      const refreshedTest = await speedActuatorServiceInstance.getTestByCode(
        testCode,
      );
      await this.updateJustOneTest(refreshedTest);
    } catch (error) {
      throw new Error(`Error on refreshing the test ${testCode}: ${error}`);
    }
  }

  @Action({ rawError: true })
  public async cancelTestExecution(testCode: string): Promise<void> {
    try {
      await speedActuatorServiceInstance.cancelTestExecution(testCode);
      this.updateTests();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @Action({ rawError: true })
  public async setTestExecutionToReady(testCode: string): Promise<void> {
    try {
      await speedActuatorServiceInstance.setTestExecutionToReady(testCode);
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

  @Action({ rawError: true })
  async receiveTestStateUpdateEvent(testAsJson: any) {
    this.updateJustOneTest(testAsJson);
    this.updateStopwachProcesses();
  }
}
export const speedActuatorStoreModule = getModule(SpeedActuatorModule);
