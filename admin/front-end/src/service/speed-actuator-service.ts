import { TestModel } from '@/models/test-mode';
import axios from 'axios';

class SpeedActuatorService {
  private URL = 'http://localhost:3001';

  async getAllTests(): Promise<Array<TestModel>> {
    const endpoint = `${this.URL}/test-view`;
    const tests = (await axios.get<Array<TestModel>>(endpoint)).data;
    return tests;
  }

  async cancelTestExecution(testCode: string) {
    const endpoint = `${this.URL}/test/${testCode}/execution/cancel`;
    return axios.put(endpoint).catch(error => {
      throw error.response.data.error;
    });
  }

  async setTestExecutionToReady(testCode: string) {
    const endpoint = `${this.URL}/test/${testCode}/execution/ready`;
    return axios.put(endpoint).catch(error => {
      throw error.response.data.error;
    });
  }

  async getTestByCode(testCode: string) {
    const endpoint = `${this.URL}/test-view/${testCode}`;
    return (await axios.get<TestModel>(endpoint)).data;
  }
}

export const speedActuatorService = new SpeedActuatorService();
