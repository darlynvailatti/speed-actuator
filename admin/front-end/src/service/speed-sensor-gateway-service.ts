import { getSpeedSensorGatewayBackendUrl } from '../constants/utils';
import axios from 'axios';
import { SensorModel } from '@/models/sensor-gateway-model';

class SpeedSensorGatewayService {
  private URL = getSpeedSensorGatewayBackendUrl();

  async getAllSensors(): Promise<Array<SensorModel>> {
    const endpoint = this.URL + `/management`;
    const sensors = (await axios.get<Array<SensorModel>>(endpoint)).data;
    return sensors;
  }
}

export const speedSensorGatewayServiceInstance = new SpeedSensorGatewayService();
