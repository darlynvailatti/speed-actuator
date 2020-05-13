import { Edge } from "./edge";
import { Node } from "./node";

export interface Graph {
    code?: string,
    description: string,
    edges?: Edge[],
    nodes?: Node[]
}

export class GraphBuilder {

    static build(description: string) : Graph {
        return {
            description: description
        }
    }

}