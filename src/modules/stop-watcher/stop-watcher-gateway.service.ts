import { OnApplicationBootstrap, Injectable, Logger, Scope } from "@nestjs/common";
import { RedisDatabase } from "../database/redis.service";
import { Constants } from "src/constants/constants";
import { TestTemplateRepository } from "../database/test-template-repository.service";
import { TestViewDTO } from "src/models/view/dto/test-view.dto";
import { TestRepositoryService } from "../database/test-repository.service";
import { Test, TestState } from "src/models/execution/test";
import { ProcessorStopWatcher, StopWatcherRequestToProcess } from "./processor/processor-stop-watcher";
import { TestTemplate } from "src/models/template/test.template";
import { TestExecutionTurn, TestExecutionEdge } from "src/models/execution/test.execution";
import { EnsureThat } from "src/common/validate";
import { TestService } from "../test/test.service";

@Injectable()
export class StopWatcherGatewayService implements OnApplicationBootstrap {
    
    private readonly logger = new Logger(StopWatcherGatewayService.name)
    
    private test: Test;

    // Local cache
    private executionStack: Array<StopwatchTest>;

    constructor(
        private readonly redisDatabase: RedisDatabase,
        private readonly testTemplateRepositoryService: TestTemplateRepository,
        private readonly testRespositoryService: TestRepositoryService,
        private readonly testService: TestService,
    ) { 
        console.log('Bulding StopWatcherGatewayService!!!!!!')
    }

    onApplicationBootstrap() {
        this.logger.log(`Initializing...`)
        this.executionStack = []
        const channel = Constants.TEST_UPDATE_STATE_CHANNEL;
        const callBack = this.handle.bind(this)
        this.redisDatabase.subscribeOnChannelAndRegisterCallback(channel, callBack)
    }

    private async handle(message: string){
        this.logger.log(`Handle stop watch: ${message}`)
    
        await this.receiveAndParseMessage(message)  
            
        const templateCode = this.test.template.code;
        const template : TestTemplate = await this.testTemplateRepositoryService.findOne(templateCode)
        
        const lastTurn : TestExecutionTurn = this.test.testExecution.turns.sort((x,y) => x.number - y.number).reverse()[0]
        const lastExecutionEdge : TestExecutionEdge = lastTurn.executionEdges.sort((x,y) => x.edge.sequence - y.edge.sequence).reverse()[0]
        
        
        let lastTimeStamp = Number(lastExecutionEdge.startNode.recordedTimeStamp)
        if(lastExecutionEdge.endNode && lastExecutionEdge.endNode.recordedTimeStamp)
            lastTimeStamp = Number(lastExecutionEdge.endNode.recordedTimeStamp)
        
        const edge = template.graph.edges.find(e => e.sequence === lastExecutionEdge.edge.sequence);
        EnsureThat.isNotNull(edge, `Can't find edge sequence ${lastExecutionEdge.edge.sequence} in graph of template ${template.code}`)

        if(!edge.stopWatch){
            this.logger.log(`Edge ${edge.description} is not stopWatch`)
            return;
        }

        const stopwatchTest : StopwatchTest = {
            testCode: this.test.code,
            edgeSequence: edge.sequence,
            turnNumber: lastTurn.number,
            lastTimeStamp: lastTimeStamp,
            baseTime: edge.baseTime
        }

        // add or update executionEdgeQueue
        const foundStopwatchTest = this.findOnStack(stopwatchTest)  
        if(foundStopwatchTest){
            this.logger.log(`Test already in stack, updating...`)
            this.executionStack = this.executionStack.filter(s => s.testCode != foundStopwatchTest.testCode)
            this.executionStack.push(stopwatchTest)
            return;
        }else{
            this.logger.log(`Test is not in stack yet, pushing...`)
            this.executionStack.push(stopwatchTest)

            // Request new stop watch processor instance
            const timeoutFunction = this.timeoutCallback.bind(this);
            const checkIfPassFunction = this.isDone.bind(this);

            const request : StopWatcherRequestToProcess = {
                isDoneCallback: checkIfPassFunction,
                timeoutCallback: timeoutFunction,
                stopwatchTest: stopwatchTest
            }

            const processorCheckIfNeedStopWatch = new ProcessorStopWatcher(request)
            processorCheckIfNeedStopWatch.execute()
        }

        
    }
    
    

    private async receiveAndParseMessage(message: string) {
        
        this.test = null

        if(!message || message.length <= 0)
            return;

        const testViewDTO : TestViewDTO = JSON.parse(message)
        this.test = await this.testRespositoryService.findOne(testViewDTO.code)
        EnsureThat.isNotNull(this.test, `Can't find test with code ${testViewDTO.code}`)
    }

    private isDone({testCode, edgeSequence, turnNumber, lastTimeStamp}){

        const stopwatchTest = this.executionStack.find(s => s.testCode === testCode)
        let isDone = false;

        if(!stopwatchTest)
            return true

        // When stop watch is processing a turn already finished
        if(turnNumber < stopwatchTest.turnNumber){
            isDone = edgeSequence > stopwatchTest.edgeSequence;
        }

        // When is the same turn but another edge
        if(turnNumber === stopwatchTest.turnNumber){
            isDone = edgeSequence < stopwatchTest.edgeSequence;
        }

        if(lastTimeStamp < stopwatchTest.lastTimeStamp)
            isDone = true

        // if is done, remove test from execution queue
        if(isDone)
            this.removeStopwatchTest(stopwatchTest)

        return isDone;
    }

    private timeoutCallback(event: {stopwatchTest: StopwatchTest}){

        // search test on execution queue
        const testCode = event.stopwatchTest.testCode;
        this.testService.changeState(testCode, TestState.DONE);

        // remove from execution queue
        this.removeStopwatchTest(event.stopwatchTest)
    }

    private findOnStack(stopwatchTest: StopwatchTest) {
        return this.executionStack.find(s => s.testCode === stopwatchTest.testCode)
    }

    private addOrUpdateStack(stopwatchTest: StopwatchTest) {
        let foundStopwatchTest = this.findOnStack(stopwatchTest)  
        if(foundStopwatchTest){
            this.logger.log(`Test already in stack, updating...`)
            foundStopwatchTest = stopwatchTest
        }else{
            this.logger.log(`Test is not in stack yet, pushing...`)
            this.executionStack.push(stopwatchTest)
        }
    }

    private removeStopwatchTest(stopwatchTest: StopwatchTest) {
        const testCode = stopwatchTest.testCode
        const allStopwatchTestsExceptOne = this.executionStack
            .filter(s => s.testCode != testCode)
        this.executionStack = allStopwatchTestsExceptOne
    }

    public getAllInStack() {
        return this.executionStack;
    }

}

export interface StopwatchTest {

    testCode: string
    turnNumber: number,
    edgeSequence: number,
    baseTime: number,
    lastTimeStamp: number

}


