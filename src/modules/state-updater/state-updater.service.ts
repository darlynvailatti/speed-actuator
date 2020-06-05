import { Injectable, Logger } from "@nestjs/common";
import { TestRepositoryService } from "../database/test-repository.service";
import { TestTemplateRepository } from "../database/test-template-repository.service";
import { Test, TestState } from "src/models/execution/test";
import { TestTemplate } from "src/models/template/test.template";
import { TestExecutionNode, TestExecutionTurn, TestExecution } from "src/models/execution/test.execution";
import { SensorDetectionMessage } from "src/models/sensor/sensor-message";
import { Constants } from "src/constants/constants";
import { RedisDatabase } from "../database/redis.service";
import { TestViewService } from "../test-view/test-view.service";
import { ProcessorBeginOfTurn } from "./processor/processor-begin-of-turn";
import { ProcessorMidleOfTurn } from "./processor/processor-midle-of-turn";
import ProcessorConvertDetectionToExecutionNode from "./processor/processor-convert-detection-to-execution-node";
import { ProcessorGetCurrentTurnOrCreateOne } from "./processor/processor-get-current-turn-or-create-one";


@Injectable()
export class StateUpdaterService {

    private readonly logger = new Logger(StateUpdaterService.name)

    private test: Test
    private testTemplate: TestTemplate
    private sensorDetectionMessage: SensorDetectionMessage
    private executionNode: TestExecutionNode
    private currentTurn: TestExecutionTurn;
    private receivedDetectionMessage: string;

    constructor(
        private readonly redisDatabase: RedisDatabase,
        private readonly testeViewService: TestViewService,
        private readonly testRespositoryService: TestRepositoryService,
        private readonly testTemplateRepositoryService: TestTemplateRepository
    ) { }

    async processDetection(message: string) {

        try {
            this.receivedDetectionMessage = message
            this.logger.log(`Process detection message: ${message}`)

            this.findReadyTestOrThrowError()
            this.createNewExecutionTestIfNotExist()
            this.findTestTemplateFor()
            this.parseDetectionMessage()
            this.convertDetectionToExecutionNode()
            this.getCurrentTurnOrCreateOne()

            const isBeginOfTurn = this.test.state === TestState.READY

            if (isBeginOfTurn) {
                this.processBeginOfTurn()
            } else {
                this.processMidleOrEndOfTurn()
            }

            this.setCurrentTurnOnTestExecution()
            this.testRespositoryService.update(this.test)
            this.publish()

        } catch (error) {
            const formattedMessageError = `Process detection fail: ${error.message}`
            this.logger.error(formattedMessageError)
            throw new Error(formattedMessageError)
        }
    }
    
    private parseDetectionMessage() {
        if (!this.receivedDetectionMessage)
            throw new Error(`Detection message cat't be empty`)
        const sensorDetectionMessageDTO: SensorDetectionMessage = JSON.parse(this.receivedDetectionMessage)
        this.sensorDetectionMessage = sensorDetectionMessageDTO
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

    private async findReadyTestOrThrowError() {
        this.logger.log(`Finding ready test...`)
        const readyTest = await this.testRespositoryService.findReadyOrStarted()
        if (!readyTest)
            throw new Error(`None Test ready to execution`)

        this.logger.log(`Found ready Test ${readyTest}`)
        this.test = readyTest
    }

    private async findTestTemplateFor() {
        this.logger.log(`Searching template for test ${this.test.code}`)
        const template = this.test.template
        if (!template)
            throw new Error(`Test ${this.test.code} doesn't have template`)
        const templateCode = template.code
        this.testTemplate = await this.testTemplateRepositoryService.findOne(templateCode)
    }


    private convertDetectionToExecutionNode() {
        this.executionNode = new ProcessorConvertDetectionToExecutionNode(
            this.sensorDetectionMessage,
            this.testTemplate
        ).execute()
    }

    private getCurrentTurnOrCreateOne() {
        
        this.currentTurn = new ProcessorGetCurrentTurnOrCreateOne(
            this.test,
            this.executionNode
        ).execute()

        this.logger.log(`Current turn number:  ${this.currentTurn.number}`)
    }

    private processBeginOfTurn() {
        const processor = new ProcessorBeginOfTurn(
            this.test,
            this.testTemplate,
            this.executionNode,
            this.currentTurn
        )
        processor.execute()
    }

    private processMidleOrEndOfTurn() {
        const processor = new ProcessorMidleOfTurn(
            this.test,
            this.testTemplate,
            this.executionNode,
            this.currentTurn
        )
        processor.execute()

    }

    setCurrentTurnOnTestExecution() {
        this.test.testExecution.turns = this.test.testExecution.turns.filter(t => t.number != this.currentTurn.number)
        this.test.testExecution.turns.push(this.currentTurn)
    }

    private async publish() {
        this.logger.log(`Publishing in update state channel...`)
        const testViewDTO = await this.testeViewService.convertTestToView(this.test)
        const redisPubClient = this.redisDatabase.getPublisherClient()
        redisPubClient.publish(Constants.TEST_UPDATE_STATE_CHANELL, JSON.stringify(testViewDTO));
    }

}