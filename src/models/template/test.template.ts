import { Document } from "mongoose";
import { Graph } from "./graph";

export interface TestTemplate {
    code?: string,
    description: string,
    numberOfTurns?: number,
    graph?: Graph,
}

export class TestTemplateFactory {

    static build(
        {
            description,
            numberOfTurns = 0
        }:
            {
                description: string,
                numberOfTurns?: number
            }
    ): TestTemplate {
        return {
            description: description,
            numberOfTurns: numberOfTurns
        }
    }
}

// Mongo - model
export interface TestTemplateDocument extends Document, TestTemplate {
    
}