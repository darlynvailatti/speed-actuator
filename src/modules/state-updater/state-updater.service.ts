import { Injectable, Logger } from "@nestjs/common";
import { TestRepositoryService } from "../database/test-repository.service";
import { TestTemplateRepository } from "../database/test-template-repository.service";
import { Test, TestState } from "src/models/execution/test";
import { TestTemplate } from "src/models/template/test.template";
import { TestExecutionNode, TestExecutionTurn, TestExecutionEdge, TestExecution } from "src/models/execution/test.execution";
import { SensorDetectionMessage } from "src/models/sensor/sensor-message";
import { TestStateMachine } from "../test/impl/test-state-machine";
import { Constants } from "src/constants/constants";
import { RedisDatabase } from "../database/redis.service";
import { TestViewService } from "../test-view/test-view.service";


@Injectable()
export class StateUpdaterService {

    private readonly logger = new Logger(StateUpdaterService.name)

    private test: Test
    private testTemplate: TestTemplate
    private sensorDetectionMessage: SensorDetectionMessage
    private executionNode: TestExecutionNode
    private currentTurn: TestExecutionTurn;

    constructor(
        private readonly redisDatabase: RedisDatabase,
        private readonly testeViewService: TestViewService,
        private readonly testRespositoryService: TestRepositoryService,
        private readonly testTemplateRepositoryService: TestTemplateRepository
    ) { }

    async processDetection(message: string) {

        try {
            this.logger.log(`process detection message: ${message}`)

            this.test = await this.findReadyTestOrThrowError()

            this.createNewExecutionTestIfNotExist()

            this.testTemplate = await this.findTestTemplateFor(this.test)
            this.sensorDetectionMessage = this.parseDetectionMessage(message)
            this.executionNode = this.convertDetectionToExecutionNode(this.sensorDetectionMessage)

            this.getCurrentTurnOrCreateOne()

            const isBeginOfTurn = this.test.state === TestState.READY

            if (isBeginOfTurn) {
                this.processBeginOfTurn()
            } else {
                this.processMidleOrEndOfTurn()
            }

            this.test.testExecution.turns = this.test.testExecution.turns.filter(t => t.number != this.currentTurn.number)
            this.test.testExecution.turns.push(this.currentTurn)

            this.testRespositoryService.update(this.test)
            this.publish()

        } catch (error) {
            console.log(error.stack)
            const formattedMessageError = `Process detection fail: ${error.message}`
            this.logger.error(formattedMessageError)
            throw new Error(formattedMessageError)
        }
    }

    private parseDetectionMessage(message: string): SensorDetectionMessage {
        if (!message)
            throw new Error(`Message cat't be empty`)
        const sensorDetectionMessageDTO: SensorDetectionMessage = JSON.parse(message)
        return sensorDetectionMessageDTO
    }

    private createNewExecutionTestIfNotExist() {
        if (!this.test.testExecution) {
            this.logger.log(`Creating new execution test for test ${this.test.code}`)
            const newTestExecution: TestExecution = {
                when: new Date(),
                who: 'user',
                turns: []
            }
            this.test.testExecution = newTestExecution
        }
    }

    private async findReadyTestOrThrowError(): Promise<Test> {
        this.logger.log(`Finding ready test...`)
        const readyTest = await this.testRespositoryService.findReadyOrStarted()
        if (!readyTest)
            throw new Error(`None Test ready to execution`)

        this.logger.log(`Found ready Test ${readyTest}`)
        return readyTest
    }

    private async findTestTemplateFor(startedTest: Test): Promise<TestTemplate> {
        this.logger.log(`Searching template for test ${startedTest.code}`)
        const template = startedTest.template
        if (!template)
            throw new Error(`Test ${startedTest.code} doesn't have template`)
        const templateCode = template.code
        return await this.testTemplateRepositoryService.findOne(templateCode)
    }


    private convertDetectionToExecutionNode(sensorDetectionMessage: SensorDetectionMessage): TestExecutionNode {

        const sensorCode = sensorDetectionMessage.sensor.code

        this.logger.log(`Finding Node with sensor code ${sensorCode}`)
        const graph = this.testTemplate.graph
        const node = graph.nodes.find(n => n.sensor.code === sensorCode)

        if (!node)
            throw Error(`The graph don't have Node with sensor code ${sensorCode}`)

        this.logger.log(`Node: ${node.code}`)

        return {
            node: {
                code: node.code
            },
            recordedTimeStamp: sensorDetectionMessage.timeStamp,
        }

    }

    private getCurrentTurnOrCreateOne() {
        let turns = this.test.testExecution.turns

        if (!turns || turns.length === 0) {
            turns = [
                {
                    number: 1,
                    startTimeStamp: this.executionNode.recordedTimeStamp
                }
            ]
        }

        this.currentTurn = turns.sort((a, b) => a.number - b.number).reverse()[0]

        this.logger.log(`Current turn number:  ${this.currentTurn.number}`)
    }

    private processBeginOfTurn() {

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

    private processMidleOrEndOfTurn() {
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
        const totalTime = edgeRecordedEndTime - edgeRecordedStartTime

        lastExecutionEdgeBySequence.totalTime = totalTime
        lastExecutionEdgeBySequence.velocity = edgeDistance / totalTime

        this.logger.log(`Last execution edge: ${lastExecutionEdgeBySequence}`)


        const lastEdgeInGraphBySequence = this.testTemplate.graph.edges.sort((a, b) => a.sequence - b.sequence).reverse()[0]
        this.logger.log(`Last Edge in Graph by sequence: ${lastEdgeInGraphBySequence}`)

        const isEndOfTurn = lastExecutionEdgeBySequence.edge.sequence === lastEdgeInGraphBySequence.sequence

        if (isEndOfTurn) {
            this.logger.log(`End of turn`)

        } else {
            const nextSequence = ++lastExecutionEdgeBySequence.edge.sequence
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

    private async publish() {
        this.logger.log(`Publishing in update state channel...`)
        const testViewDTO = await this.testeViewService.convertTestToView(this.test)
        const redisPubClient = this.redisDatabase.getPublisherClient()
        redisPubClient.publish(Constants.TEST_UPDATE_STATE_CHANELL, JSON.stringify(testViewDTO));
    }

}