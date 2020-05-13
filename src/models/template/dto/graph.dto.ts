import { NodeDTO, NodeDTOConverter } from "./node.dto";
import { EdgeDTO, EdgeDTOConverter } from "./edge.dto";
import { Graph } from "../graph";
import { Node } from "../node";
import { Edge } from "../edge";

export interface GraphDTO {
    code: string,
    description: string,
    edges?: EdgeDTO[],
    nodes?: NodeDTO[]
}

export class GraphDTOConverter {

    static convertToModel(graphDTO: GraphDTO) : Graph {

        const nodes: Node[] = []
        graphDTO.nodes.forEach(n => 
            nodes.push(NodeDTOConverter.convertToModel(n))    
        )

        const edges: Edge[] = []
        graphDTO.edges.forEach(e => 
            edges.push(EdgeDTOConverter.convertToModel(e))    
        )

        return {
            code: graphDTO.code,
            description: graphDTO.description,
            nodes: nodes,
            edges: edges
        }

    }

}