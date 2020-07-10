import { GraphDTO } from "./graph.dto";
import { TestTemplate } from "../test.template";
import { NodeDTO } from "./node.dto";
import { EdgeDTO } from "./edge.dto";
import { ApiProperty } from "@nestjs/swagger";

export class TestTemplateFullDTO {

    @ApiProperty()
    code: string

    @ApiProperty()
    description: string

    @ApiProperty()
    numberOfTurns: number

    @ApiProperty()
    graph?: GraphDTO
}

export class TestTemplateFullDTOConverter {
    
    static convertToDTO(testTemplate: TestTemplate): TestTemplateFullDTO {
        const nodes: NodeDTO[] = []
       
        testTemplate.graph.nodes.forEach(n => 
            nodes.push({
                code: n.code,
                sensor:{
                    code: n.sensor.code,
                } 
            })    
        )

        const edges : EdgeDTO[] = []
        testTemplate.graph.edges.forEach(e => 
            edges.push({
                sequence: e.sequence,
                description: e.description,
                distance: e.distance,
                baseTime: e.baseTime,
                stopWatch: e.stopWatch,
                startNode: e.startNode.code,
                endNode: e.endNode.code,
            })
        )

        const graphDTO : GraphDTO = {
            code: testTemplate.graph.code,
            description: testTemplate.graph.description,
            edges: edges,
            nodes: nodes
        }

        return {
            description: testTemplate.description,
            code: testTemplate.code,
            numberOfTurns: testTemplate.numberOfTurns,
            graph: graphDTO
        }
    }

}