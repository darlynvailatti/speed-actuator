import { Logger } from "@nestjs/common";
import { EnsureThat } from "src/common/validate";

export interface StopWatcherRequestToProcess {
    timeoutCallback: any,
    isDoneCallback: any,
    baseTime: number,
    startedTime: number,
    edgeSequence: number,
    turnNumber: number,
}

export class ProcessorStopWatcher {
    
    private readonly logger = new Logger(ProcessorStopWatcher.name)

    private timeoutStopWatchCallBack: any;
    private isDoneFunction: any;
    private baseTime: number;
    private startedTime: number;
    private edgeSequence: number;
    private turnNumber: number;

    constructor(
        request: StopWatcherRequestToProcess){
        this.timeoutStopWatchCallBack = request.timeoutCallback;
        this.isDoneFunction = request.isDoneCallback;
        this.baseTime = request.baseTime;
        this.startedTime = request.startedTime;
        this.edgeSequence = request.edgeSequence;
        this.turnNumber = request.turnNumber;
    }

    async execute(){
        EnsureThat.isNotNull(this.baseTime, 'Base time of edge')
        const stopWatchProcessor = this.stopWatchProcessor(this.baseTime, this.startedTime)
        this.stopWatchAsyncProxyWrapper(stopWatchProcessor)
    }

    private * stopWatchProcessor(baseTime: number, startTimeStamp: number) {
       
       
        this.logger.log(`Init while`)
        let elapsedTime = Date.now() - startTimeStamp;

        const processingFor = {
            edgeSequence: this.edgeSequence,
            turnNumber: this.turnNumber
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