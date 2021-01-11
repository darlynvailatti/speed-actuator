import { TestModel } from '@/models/test-mode';
import { speedActuatorService } from '@/service/speed-actuator-service';
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators';
import store from '@/store/index';

export interface InterfaceSpeedActuatorState {
  tests: Array<TestModel>;
}

@Module({
  dynamic: true,
  name: 'speed-actuator-module',
  store,
})
class SpeedActuatorModule extends VuexModule
  implements InterfaceSpeedActuatorState {
  public tests: Array<TestModel> = [];
  @Mutation
  public setTests(tests: Array<TestModel>): void {
    this.tests = tests;
  }

  @Action({ rawError: true })
  public async updateTests(): Promise<void> {
    const tests = await speedActuatorService.getAllTests();
    console.log(tests);
    this.context.commit('setTests', tests);
  }

  @Action({ rawError: true })
  public async updateJustOneTest(test: any) {
    console.log(test.code);
    const otherTests = this.tests.filter(t => t.code != test.code);

    otherTests.push(test);
    this.context.commit('setTests', otherTests);
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
}
export const speedActuatorStoreModule = getModule(SpeedActuatorModule);
