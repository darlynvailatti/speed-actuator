import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SensorDocument, Sensor } from "src/models/sensor/sensor";

@Injectable()
export class SensorRepositoryService {

    constructor(@InjectModel('sensor') private sensorModel: Model<SensorDocument>) { }

    async create(sensor: Sensor): Promise<SensorDocument> {
        return await this.sensorModel.create(sensor)
    }

    async findAll(): Promise<SensorDocument[]> {
        return this.sensorModel.find().exec();
    }

}