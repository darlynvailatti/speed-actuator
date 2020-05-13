import { Sensor } from "./sensor";

export interface SensorMessage {
    createdTimeStamp: string,
    sensor: Sensor
}

export interface SensorDetectionMessage extends SensorMessage{
    timeStamp: string;
}

export interface SensorStateChangeMessage extends SensorMessage {
    state: SensorState,
}

export enum SensorState {
    UNKNOW,
    READY,
    STAND_BY
}

export class SensorMessageBuilder {

    static buildSensorMessageDetection(
        createdTimeStamp: string, 
        sensor: Sensor,
        timeStamp: string
        ) : SensorDetectionMessage{
        return {
            createdTimeStamp: createdTimeStamp,
            sensor: sensor,
            timeStamp: timeStamp
        }
    }

    static

}