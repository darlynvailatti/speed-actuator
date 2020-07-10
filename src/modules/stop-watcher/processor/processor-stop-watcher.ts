import { Logger } from "@nestjs/common";
import { EnsureThat } from "src/common/validate";
import { StopwatchTestDTO } from "src/models/view/dto/stop-watcher.dto";


export interface StopWatcherRequestToProcess {
    timeoutCallback: any,
    isDoneCallback: any,
    stopwatchTest: StopwatchTestDTO
}

export class ProcessorStopWatcher {
    
    private readonly logger = new Logger(ProcessorStopWatcher.name)

    private timeoutStopWatchCallBack: any;
    private isDoneFunction: any;
    private stopwatchTest: StopwatchTestDTO;

    constructor(
        request: StopWatcherRequestToProcess){
        this.timeoutStopWatchCallBack = request.timeoutCallback;
        this.isDoneFunction = request.isDoneCallback;
        this.stopwatchTest = request.stopwatchTest
    }

    async execute(){
        EnsureThat.isNotNull(this.stopwatchTest.baseTime, 'Base time of edge')
        const stopWatchProcessor = this.stopWatchProcessor(this.stopwatchTest.baseTime, this.stopwatchTest.lastTimeStamp)
        this.stopWatchAsyncProxyWrapper(stopWatchProcessor)
    }

    private * stopWatchProcessor(baseTime: number, startTimeStamp: number) {
       
        let elapsedTime = Date.now() - startTimeStamp;

        const processingFor = {
            testCode: this.stopwatchTest.testCode,
            edgeSequence: this.stopwatchTest.edgeSequence,
            turnNumber: this.stopwatchTest.turnNumber,
            lastTimeStamp: this.stopwatchTest.lastTimeStamp
        }

        while (true) {
            elapsedTime = Date.now() - startTimeStamp;
            this.logger.log(`time elapsed: ${elapsedTime}`);

            if(this.isDoneFunction(processingFor)){
                this.logger.log(`Stopwatch done!`)
                return;
            }

            if(elapsedTime > baseTime){
                this.logger.log(`Calling stopwatch timeout callback...`)
                this.timeoutStopWatchCallBack(this.stopwatchTest)
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