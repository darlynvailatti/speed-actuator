import { TestExecutionNode, TestExecutionTurn, TestExecutionEdge } from "src/models/execution/test.execution";
import { TestTemplate } from "src/models/template/test.template";
import { Test, TestState } from "src/models/execution/test";
import { Logger } from "@nestjs/common";
import { TestStateMachine } from "src/modules/test/impl/test-state-machine";

export class ProcessorMidleOfTurn {

    private readonly logger = new Logger(ProcessorMidleOfTurn.name)

    private testTemplate: TestTemplate;
    private executionNode: TestExecutionNode;
    private currentTurn: TestExecutionTurn;
    private test: Test;
    private executionEdge: TestExecutionEdge;


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

    async execute() {
        
        this.checkCurrentTurn() 
        
        // Find last execution edge
        this.executionEdge = this.findLastExecutionEdge()

        const edgeSequence = this.executionEdge.edge.sequence
        const edgeTemplate = this.findEdgeOnTemplateBySequence(edgeSequence)

        const expectedNodeCode = edgeTemplate.endNode.code

        const isMatchExpectedNode = expectedNodeCode === this.executionNode.node.code
        if (!isMatchExpectedNode){
            this.logger.log(`Node ${this.executionNode.node.code} don't match the expected Node ${expectedNodeCode}`)
            return;
        }

        this.executionEdge.endNode = this.executionNode

        const edgeDistance = edgeTemplate.distance

        const edgeRecordedStartTime = Number.parseInt(this.executionEdge.startNode.recordedTimeStamp)
        const edgeRecordedEndTime = Number.parseInt(this.executionEdge.endNode.recordedTimeStamp)
        const totalTime = (edgeRecordedEndTime - edgeRecordedStartTime) / 1000

        this.executionEdge.totalTime = totalTime
        this.executionEdge.velocity = edgeDistance / totalTime

        this.logger.log(`Last execution edge: ${this.executionEdge}`)


        const lastEdgeInGraphBySequence = this.testTemplate.graph.edges.sort((a, b) => a.sequence - b.sequence).reverse()[0]
        this.logger.log(`Last Edge in Graph by sequence: ${lastEdgeInGraphBySequence}`)

        const isEndOfTurn = this.executionEdge.edge.sequence === lastEdgeInGraphBySequence.sequence

        if (isEndOfTurn) {
            this.processEndOfTurn()
        } else {
            this.processMidleOfTurn()
            
        }

    }

    private findLastExecutionEdge() : TestExecutionEdge{
        return this.currentTurn.executionEdges
            .sort((a, b) => a.edge.sequence - b.edge.sequence)
            .reverse()[0]
    }

    private processMidleOfTurn() {
        const nextSequence = this.executionEdge.edge.sequence + 1
        const nextEdge = this.findEdgeOnTemplateBySequence(nextSequence)

        const isLastNodeEqualsToNextNode = nextEdge.startNode.code === this.executionEdge.endNode.node.code

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

            // Update execution edges, adding the new
            this.currentTurn.executionEdges.push(nextExecutionEdge)
        }
    }

    private processEndOfTurn() {
        this.logger.log(`End of turn`)
        const isFinalTurn = this.currentTurn.number === this.test.numberOfTurns

        this.logger.log(`Is final turn? ${isFinalTurn}`)
        if(isFinalTurn){
            const doneState = TestState.DONE
            this.logger.log(`Is final turn, changing test state to ${doneState}`)
            TestStateMachine.change(this.test, doneState)
            return
        }

        // Create new turn
        const endRecordedTimeStamp = this.executionNode.recordedTimeStamp
        this.currentTurn.endTimeStamp = endRecordedTimeStamp
        const newTurn = this.currentTurn.number + 1

        // Find first ege of graph
        const firstEdgeOfGraph = this.testTemplate.graph.edges.sort((a,b) => a.sequence - b.sequence)[0]

        if(!firstEdgeOfGraph)
            throw new Error(`Can't found the first edge of the graph`)

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
      
    }
    
    private checkCurrentTurn() {
        this.logger.log(`Checking current turn`)

        if(!this.currentTurn)
            throw new Error(`Current turn can't be undefined`)

        const turnDontHaveValidNumber = this.currentTurn.number < 0
        const turnDontHaveExecutionEdges = !this.currentTurn.executionEdges || this.currentTurn.executionEdges.length <= 0;
        if(turnDontHaveValidNumber || turnDontHaveExecutionEdges){
            throw new Error(`Current turn is not valid`)
        }

    }

    private findEdgeOnTemplateBySequence(edgeSequence: number){
        return this.testTemplate.graph.edges.find(e => e.sequence === edgeSequence)
    }

}