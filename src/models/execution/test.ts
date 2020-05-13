import { Document } from "mongoose";
import { TestExecution } from "./test.execution";

export interface Test {
    code?: string,
    description: string,
    numberOfTurns: number,
    template: {
        code: string
    },
    athlete: {
        code: string
    },
    state: TestState,
    testExecution?: TestExecution
}

export enum TestState {
    IDLE = 'IDLE',
    READY = 'READY',
    STARTED = 'STARTED',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED'
}

export interface TestDocument extends Document, Test {
    
}