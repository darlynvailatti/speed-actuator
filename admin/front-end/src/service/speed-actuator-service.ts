import { StopwatchProcess } from '@/models/stopwatch-model';
import { TestModel } from '@/models/test-mode';
import { getBackendUrl } from '../constants/utils';
import axios from 'axios';

class SpeedActuatorService {
  private URL = getBackendUrl();

  constructor() {
    axios.defaults.baseURL = this.URL;
  }

  async getAllTests(): Promise<Array<TestModel>> {
    const endpoint = `/test-view`;
    const tests = (await axios.get<Array<TestModel>>(endpoint)).data;
    return tests;
  }

  async cancelTestExecution(testCode: string) {
    const endpoint = `/test/${testCode}/execution/cancel`;
    return axios.put(endpoint).catch(error => {
      throw error.response.data.error;
    });
  }

  async setTestExecutionToReady(testCode: string) {
    const endpoint = `/test/${testCode}/execution/ready`;
    return axios.put(endpoint).catch(error => {
      throw error.response.data.error;
    });
  }

  async getTestByCode(testCode: string) {
    const endpoint = `/test-view/${testCode}`;
    return (await axios.get<TestModel>(endpoint)).data;
  }

  async getStopwatchProcesses() {
    const endpoint = `/stopwatch/all`;
    return (await axios.get<StopwatchProcess>(endpoint)).data;
  }
}

export const speedActuatorServiceInstance = new SpeedActuatorService();
