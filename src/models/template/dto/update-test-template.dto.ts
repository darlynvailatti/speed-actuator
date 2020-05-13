import { GraphDTO } from "./graph.dto";

export interface UpdateTestTemplateDTO {
    code: string
    description: string,
    numberOfTurns: number,
    graph: GraphDTO,
}