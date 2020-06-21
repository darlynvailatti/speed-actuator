import { OnApplicationBootstrap, Injectable, Logger } from "@nestjs/common";
import { RedisDatabase } from "../database/redis.service";
import { Constants } from "src/constants/constants";
import { TestTemplateRepository } from "../database/test-template-repository.service";
import { TestViewDTO } from "src/models/view/dto/test-view.dto";
import { TestRepositoryService } from "../database/test-repository.service";
import { Test, TestState } from "src/models/execution/test";
import { ProcessorStopWatcher, StopWatcherRequestToProcess } from "./processor/processor-stop-watcher";
import { TestTemplate } from "src/models/template/test.template";
import { TestExecution, TestExecutionTurn, TestExecutionEdge } from "src/models/execution/test.execution";
import { EnsureThat } from "src/common/validate";
import { TestService } from "../test/test.service";

@Injectable()
export class StopWatcherGatewayService implements OnApplicationBootstrap {

    private readonly logger = new Logger(StopWatcherGatewayService.name)
    
    private lastTestExecutionProcessed: TestExecution;
    private test: Test;
    lastTurnNumber: number;
    lastEdgeSequence: number;

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
        const startedTimeStamp = Number(lastExecutionEdge.startNode.recordedTimeStamp)

        const edge = template.graph.edges.find(e => e.sequence === lastExecutionEdge.edge.sequence);
    
        this.lastTurnNumber = lastTurn.number;
        this.lastEdgeSequence = edge.sequence

        if(!edge.stopWatch){
            this.logger.log(`Edge ${edge.description} is not stopWatch`)
            return;
        }


        // Request new stop watch procesor instance
        const timeoutFunction = this.timeoutCallback.bind(this);
        const checkIfPassFunction = this.isDone.bind(this);

        const request : StopWatcherRequestToProcess = {
            isDoneCallback: checkIfPassFunction,
            timeoutCallback: timeoutFunction,
            baseTime: edge.baseTime,
            startedTime: startedTimeStamp,
            edgeSequence: edge.sequence,
            turnNumber: lastTurn.number
        }
        const processorCheckIfNeedStopWatch = new ProcessorStopWatcher(request)
        processorCheckIfNeedStopWatch.execute()

        
    }

    private async receiveAndParseMessage(message: string) {
        
        this.test = null

        if(!message || message.length <= 0)
            return;

        const testViewDTO : TestViewDTO = JSON.parse(message)
        this.test = await this.testRespositoryService.findOne(testViewDTO.code)
        EnsureThat.isNotNull(this.test, `Can't find test with code ${testViewDTO.code}`)
    }

    private isDone({edgeSequence, turnNumber}){

        // When stop watch is processing a turn already finished
        if(turnNumber < this.lastTurnNumber){
            return edgeSequence > this.lastEdgeSequence;
        }

        // When is the same turn but another edge
        if(turnNumber === this.lastTurnNumber){
            return edgeSequence < this.lastEdgeSequence;
        }
        return false;
    }

    private timeoutCallback(){
        const testCode = this.test.code;
        this.testService.changeState(testCode, TestState.DONE);
    }



}


