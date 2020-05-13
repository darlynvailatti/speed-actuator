import { Edge } from "../template/edge";
import { TestTemplate } from "../template/test.template";

export interface TestGroupBaseLine {
    testTemplate: TestTemplate
    totalTime: number
}

export interface EdgeGroupBaseLine {
    testGroupBaseLine: TestGroupBaseLine,
    edge: Edge,
    time:number
}