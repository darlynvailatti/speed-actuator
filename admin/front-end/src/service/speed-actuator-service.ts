import { TestModel } from '@/models/test-mode';
import axios from 'axios';

class SpeedActuatorService {
  private URL = 'http://localhost:3001';

  async getAllTests(): Promise<TestModel> {
    const endpoint = `${this.URL}/test-view`;
    return (await axios.get<TestModel>(endpoint)).data;
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
}

export const speedActuatorService = new SpeedActuatorService();
