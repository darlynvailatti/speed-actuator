import { Injectable } from '@nestjs/common';
import { Sensor } from 'src/models/sensor/sensor';

@Injectable()
export class SensorRepositoryService {
  // async create(sensor: Sensor): Promise<SensorDocument> {
  //   return await this.sensorModel.create(sensor);
  // }
  // async findAll(): Promise<SensorDocument[]> {
  //   return this.sensorModel.find().exec();
  // }
}
