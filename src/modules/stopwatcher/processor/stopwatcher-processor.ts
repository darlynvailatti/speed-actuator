import { Logger } from '@nestjs/common';
import { EnsureThat } from 'src/common/validate';
import { StopwatchProcess } from 'src/models/execution/stopwatcher-processor';

export interface StopwatchProcessorRequest {
  timeoutCallback: any;
  isDoneCallback: any;
  stopwatchProcess: StopwatchProcess;
}

export class StopwatchProcessorImplementation {
  private readonly logger = new Logger(StopwatchProcessorImplementation.name);

  private timeoutStopWatchCallBack: any;
  private isDoneFunction: any;
  private stopwatchProcess: StopwatchProcess;

  constructor(request: StopwatchProcessorRequest) {
    this.timeoutStopWatchCallBack = request.timeoutCallback;
    this.isDoneFunction = request.isDoneCallback;
    this.stopwatchProcess = request.stopwatchProcess;
  }

  async execute() {
    EnsureThat.isNotNull(this.stopwatchProcess.baseTime, 'Base time of edge');
    const stopWatchProcessor = this.stopWatchProcessor(
      this.stopwatchProcess.baseTime,
      this.stopwatchProcess.startTimeStamp,
    );
    this.stopWatchAsyncProxyWrapper(stopWatchProcessor);
  }

  private *stopWatchProcessor(baseTime: number, startTimeStamp: number) {
    let elapsedTime = Date.now() - startTimeStamp;

    while (true) {
      elapsedTime = Date.now() - startTimeStamp;
      this.logger.log(`time elapsed: ${elapsedTime}`);

      if (this.isDoneFunction(this.stopwatchProcess)) {
        this.logger.log(`Stopwatch done!`);
        return;
      }

      if (elapsedTime > baseTime) {
        this.logger.log(`Calling stopwatch timeout callback...`);
        this.timeoutStopWatchCallBack(this.stopwatchProcess);
        return;
      }
      yield false;
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
