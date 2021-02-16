import { StopwatchProcess } from '@/models/stopwatch-model';
import { TestModel } from '@/models/test-mode';
import { getSpeedActuatorBackendUrl } from '../constants/utils';
import axios from 'axios';

class SpeedActuatorService {
  private URL = getSpeedActuatorBackendUrl();

  async getAllTests(): Promise<Array<TestModel>> {
    const endpoint = this.URL + `/test-view`;
    const tests = (await axios.get<Array<TestModel>>(endpoint)).data;
    return tests;
  }

  async cancelTestExecution(testCode: string) {
    const endpoint = this.URL + `/test/${testCode}/execution/cancel`;
    return axios.put(endpoint).catch(error => {
      throw error.response.data.error;
    });
  }

  async setTestExecutionToReady(testCode: string) {
    const endpoint = this.URL + `/test/${testCode}/execution/ready`;
    return axios.put(endpoint).catch(error => {
      throw error.response.data.error;
    });
  }

  async getTestByCode(testCode: string) {
    const endpoint = this.URL + `/test-view/${testCode}`;
    return (await axios.get<TestModel>(endpoint)).data;
  }

  async getStopwatchProcesses() {
    const endpoint = this.URL + `/stopwatch/all`;
    return (await axios.get<StopwatchProcess>(endpoint)).data;
  }
}

export const speedActuatorServiceInstance = new SpeedActuatorService();
