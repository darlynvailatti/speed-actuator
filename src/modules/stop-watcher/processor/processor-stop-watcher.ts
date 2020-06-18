import { TestExecution, TestExecutionTurn, TestExecutionEdge } from "src/models/execution/test.execution";
import { TestTemplate } from "src/models/template/test.template";
import { Logger } from "@nestjs/common";
import { EnsureThat } from "src/common/validate";

export class ProcessorStopWatcher {
    
    private readonly logger = new Logger(ProcessorStopWatcher.name)

    private testExecution: TestExecution;
    private testTemplate: TestTemplate;
    private timeoutStopWatchCallBack: any;

    constructor(
        testExecution: TestExecution,
        testTemplate: TestTemplate,
        timeoutStopWatchCallBack: any){
        this.testExecution = testExecution;
        this.testTemplate = testTemplate;
        this.timeoutStopWatchCallBack = timeoutStopWatchCallBack;
    }

    async execute(){
        const lastTurn : TestExecutionTurn = this.testExecution.turns.sort((x,y) => x.number - y.number).reverse()[0]
        const lastExecutionEdge : TestExecutionEdge = lastTurn.executionEdges.sort((x,y) => x.edge.sequence - y.edge.sequence).reverse()[0]
        const startedTimeStamp = Number(lastExecutionEdge.startNode.recordedTimeStamp)


        const edge = this.testTemplate.graph.edges.find(e => e.sequence === lastExecutionEdge.edge.sequence);
    
        if(!edge.stopWatch){
            return;
        }

        const baseTime = edge.baseTime
        EnsureThat.isNotNull(baseTime, 'Base time of edge')

        const stopWatchProcessor = this.stopWatchProcessor(edge.baseTime, startedTimeStamp)
        this.stopWatchAsyncProxyWrapper(stopWatchProcessor)
       
    }

    private * stopWatchProcessor(baseTime: number, startTimeStamp: number) {
       
       
        this.logger.log(`Init while`)
        let elapsedTime = Date.now() - startTimeStamp;
        while (true) {
            elapsedTime = Date.now() - startTimeStamp;
            this.logger.log(`time elapsed: ${elapsedTime}`);

            if(elapsedTime > baseTime){
                this.logger.log(`Calling stowatch timeout callback...`)
                this.timeoutStopWatchCallBack()
                return;
            }
            yield false
        }

    }

    private stopWatchAsyncProxyWrapper(stopWatchProcessor) {
        const process = stopWatchProcessor.next();
        if (!process.done) {
            setTimeout(() => {
                this.stopWatchAsyncProxyWrapper(stopWatchProcessor);
            }, 0);
        }
    }

}