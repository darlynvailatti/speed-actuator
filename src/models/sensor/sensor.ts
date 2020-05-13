import { Document } from "mongoose";

export interface Sensor {
    code: string,
    description?: string
}

export class SensorBuilder {
    
    static build(code: string, description?: string){
        return {
            code: code,
            description: description
        }
    }

}

export interface SensorDocument extends Document {
    readonly code: string
    readonly description: string
}