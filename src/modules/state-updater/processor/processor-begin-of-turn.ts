import { TestTemplate } from "src/models/template/test.template";
import { TestExecutionNode, TestExecutionTurn, TestExecutionEdge } from "src/models/execution/test.execution";
import { TestState, Test } from "src/models/execution/test";
import { TestStateMachine } from "src/modules/test/impl/test-state-machine";
import { Logger } from "@nestjs/common";


export class ProcessorBeginOfTurn {

    private readonly logger = new Logger(ProcessorBeginOfTurn.name)
    
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

    execute() : void {

        const firstEdgeTemplate = this.testTemplate.graph.edges.find(e => e.sequence === 1)
        const startNodeOfFirstEdgeTemplate = firstEdgeTemplate.startNode

        const isMatchExpectedNode = startNodeOfFirstEdgeTemplate.code === this.executionNode.node.code
        if (!isMatchExpectedNode)
            throw new Error(`Node ${this.executionNode.node.code} It's not expected Node: ${startNodeOfFirstEdgeTemplate.code}`)

        // Create new TestExecutionEdge
        const executionEdge: TestExecutionEdge = {
            edge: {
                sequence: firstEdgeTemplate.sequence
            },
            startNode: this.executionNode
        }

        this.logger.log(`Pushing new execution edge ${executionEdge.edge.sequence}`)
        this.currentTurn.executionEdges = [executionEdge]

        const isFirstTurn = this.currentTurn.number === 1
        if (isFirstTurn) {
            this.logger.log(`Starting test ${this.test.code}`)
            TestStateMachine.change(this.test, TestState.STARTED)
        }

    }

}