import { SensorDetectionMessage, SensorMessageBuilder } from "src/models/sensor/sensor-message";
import { SensorBuilder, Sensor } from "src/models/sensor/sensor";
import { IsNotEmpty } from 'class-validator';

export abstract class SensorMessageDTO {
    @IsNotEmpty()
    createdTimeStamp: string;

    @IsNotEmpty()
    sensorCode: string;
}

export class SensorDetectionMessageDTO extends SensorMessageDTO{

    @IsNotEmpty()
    timeStamp: string;
}

export class SensorChangeStateMessageDTO extends SensorMessageDTO {
    
    @IsNotEmpty()
    state: string;
}

export class ConverterSensorDetectionMessageDTO {

    static convert(sensorMessageDetectionDTO: SensorDetectionMessageDTO) : SensorDetectionMessage{
        const createdTimeStamp = sensorMessageDetectionDTO.createdTimeStamp;
        const sensorCode = sensorMessageDetectionDTO.sensorCode
        const timeStamp = sensorMessageDetectionDTO.timeStamp

        const sensor : Sensor = SensorBuilder.build(sensorCode)

        return SensorMessageBuilder.buildSensorMessageDetection(
            createdTimeStamp,
            sensor,
            timeStamp
        )
    }

}
