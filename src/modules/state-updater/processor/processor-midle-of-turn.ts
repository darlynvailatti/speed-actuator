import { TestExecutionNode, TestExecutionTurn, TestExecutionEdge } from "src/models/execution/test.execution";
import { TestTemplate } from "src/models/template/test.template";
import { Test, TestState } from "src/models/execution/test";
import { Logger } from "@nestjs/common";
import { TestStateMachine } from "src/modules/test/impl/test-state-machine";

export class ProcessorMidleOfTurn {

    private readonly logger = new Logger(ProcessorMidleOfTurn.name)

    testTemplate: TestTemplate;
    executionNode: TestExecutionNode;
    currentTurn: TestExecutionTurn;
    test: Test;

    constructor(
        test: Test,
        testTemplate: TestTemplate,
        executionNode: TestExecutionNode,
        currentTurn: TestExecutionTurn
        ){
        this.test = test
        this.testTemplate = testTemplate,
        this.executionNode = executionNode,
        this.currentTurn = currentTurn
    }

    execute(): void {
        // Find last execution Node
        const lastExecutionEdgeBySequence = this.currentTurn.executionEdges
            .sort((a, b) => a.edge.sequence - b.edge.sequence)
            .reverse()[0]

        const edgeSequence = lastExecutionEdgeBySequence.edge.sequence
        const edgeTemplate = this.testTemplate.graph.edges.find(e => e.sequence === edgeSequence)

        const expectedNodeCode = edgeTemplate.endNode.code

        const isMatchExpectedNode = expectedNodeCode === this.executionNode.node.code
        if (!isMatchExpectedNode)
            throw new Error(`Node ${this.executionNode.node.code} don't match the expected Node ${expectedNodeCode}`)

        lastExecutionEdgeBySequence.endNode = this.executionNode

        const edgeDistance = edgeTemplate.distance

        const edgeRecordedStartTime = Number.parseInt(lastExecutionEdgeBySequence.startNode.recordedTimeStamp)
        const edgeRecordedEndTime = Number.parseInt(lastExecutionEdgeBySequence.endNode.recordedTimeStamp)
        const totalTime = (edgeRecordedEndTime - edgeRecordedStartTime) / 1000

        lastExecutionEdgeBySequence.totalTime = totalTime
        lastExecutionEdgeBySequence.velocity = edgeDistance / totalTime

        this.logger.log(`Last execution edge: ${lastExecutionEdgeBySequence}`)


        const lastEdgeInGraphBySequence = this.testTemplate.graph.edges.sort((a, b) => a.sequence - b.sequence).reverse()[0]
        this.logger.log(`Last Edge in Graph by sequence: ${lastEdgeInGraphBySequence}`)

        const isEndOfTurn = lastExecutionEdgeBySequence.edge.sequence === lastEdgeInGraphBySequence.sequence

        if (isEndOfTurn) {
            this.logger.log(`End of turn`)
            const isFinalTurn = this.currentTurn.number === this.test.numberOfTurns

            this.logger.log(`Is final turn? ${isFinalTurn}`)

            if(!isFinalTurn){
                const endRecordedTimeStamp = this.executionNode.recordedTimeStamp
                this.currentTurn.endTimeStamp = endRecordedTimeStamp
                const newTurn = this.currentTurn.number + 1

                const firstEdgeOfGraph = this.testTemplate.graph.edges.sort((a,b) => a.sequence - b.sequence)[0]

                const newStartExecutionEdge : TestExecutionEdge = {
                    edge: {
                        sequence: firstEdgeOfGraph.sequence
                    },
                    startNode: {
                        recordedTimeStamp: this.executionNode.recordedTimeStamp,
                        node: {
                            code: firstEdgeOfGraph.startNode.code
                        }
                    },
                    endNode: {
                        node: {
                            code: firstEdgeOfGraph.endNode.code
                        }
                    }
                }

                this.test.testExecution.turns.push({
                    number: newTurn,
                    startTimeStamp: endRecordedTimeStamp,
                    executionEdges:[
                        newStartExecutionEdge
                    ]
                })  
            }else{
                const doneState = TestState.DONE
                this.logger.log(`Is final turn, changing test state to ${doneState}`)
                TestStateMachine.change(this.test, doneState)
            }

        } else {
            const nextSequence = lastExecutionEdgeBySequence.edge.sequence + 1
            const nextEdge = this.testTemplate.graph.edges.find(e => e.sequence === nextSequence)

            const isLastNodeEqualsToNextNode = nextEdge.startNode.code === lastExecutionEdgeBySequence.endNode.node.code

            if (isLastNodeEqualsToNextNode) {
                this.logger.log(`Last node is equal to next node, creating new execution edge`)
                const nextExecutionEdge: TestExecutionEdge = {
                    edge: {
                        sequence: nextEdge.sequence
                    },
                    startNode: {
                        node: {
                            code: nextEdge.startNode.code,
                        },
                        recordedTimeStamp: this.executionNode.recordedTimeStamp
                    }
                }
                this.currentTurn.executionEdges.push(nextExecutionEdge)
            }
        }

    }

}