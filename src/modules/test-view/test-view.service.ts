import { Injectable } from '@nestjs/common';
import { TestRepositoryService } from '../database/test-repository.service';
import { TestViewDTO, TurnDTO, EdgeDTO, TestViewDTOBuilder } from 'src/models/view/dto/test-view.dto';
import { TestTemplateRepository } from '../database/test-template-repository.service';
import { Test } from 'src/models/execution/test';


@Injectable()
export class TestViewService {

    constructor(
        readonly testRepositoryService: TestRepositoryService,
        readonly testTemplateRepositoryService: TestTemplateRepository
    ) { }

    async getTestView(testCode: string): Promise<TestViewDTO> {

        const test = await this.testRepositoryService.findOne(testCode)

        if (!test)
            throw new Error(`Can't find Test with code ${testCode}`)

        return await this.convertTestToView(test)

    }

    async convertTestToView(test: Test): Promise<TestViewDTO> {


        const testExecution = test.testExecution

        const testViewDTO = TestViewDTOBuilder.build(
            test.code,
            test.description,
            test.state,
            test.numberOfTurns
        )

        const testTemplate = await this.testTemplateRepositoryService.findOne(test.template.code)
        if (!testTemplate)
            throw new Error(`Test code ${test.code} don't have Template`)

        const turns: TurnDTO[] = testExecution.turns.map(turn => {

            const edges: EdgeDTO[] = []
            turn.executionEdges.map(executionEdge => {

                const edgeFromTemplate = testTemplate.graph.edges.find(e => e.sequence === executionEdge.edge.sequence)


                let velocity = 0
                let startTimeStamp = ""
                let endTimeStamp = ""
                let startNode = null
                let endNode = null

                if (executionEdge) {
                    velocity = executionEdge.velocity

                    if (executionEdge.startNode) {
                        startTimeStamp = executionEdge.startNode.recordedTimeStamp
                        startNode = {
                            code: edgeFromTemplate.startNode.code,
                            recordedTime: executionEdge.startNode.time
                        }
                    }

                    if (executionEdge.endNode) {
                        endTimeStamp = executionEdge.endNode.recordedTimeStamp
                        endNode = {
                            code: edgeFromTemplate.endNode.code,
                            recordedTime: executionEdge.endNode.time
                        }
                    }
                }



                const edgeDTO: EdgeDTO = {
                    code: edgeFromTemplate.code,
                    description: edgeFromTemplate.description,
                    velocity: velocity,
                    startTimeStamp: startTimeStamp,
                    endTimeStamp: endTimeStamp,
                    distance: edgeFromTemplate.distance,
                    startNode: startNode,
                    endNode: endNode,
                }
                edges.push(edgeDTO)
            })



            return {
                number: turn.number,
                startTimeStamp: turn.startTimeStamp,
                endTimeStamp: turn.endTimeStamp,
                recordedStartTime: turn.startTimeStamp,
                recordedEndTime: turn.endTimeStamp,
                totalTime: turn.totalTime,
                averageTime: turn.averageTime,
                edges: edges,

            }
        })

        testViewDTO.turns = turns
        return testViewDTO;
    }

}
