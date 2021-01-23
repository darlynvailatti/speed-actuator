<template>
  <div>{{ formattedRemainingTime }}</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { StopwatchProcess } from '../models/stopwatch-model';

@Component({ name: 'TestViewStopwatchProcess' })
export default class TestViewStopwatchProcess extends Vue {
  @Prop()
  private stopwatchProcess!: StopwatchProcess;

  private elapsedTime = 0;
  private baseFormattedTime = '';
  private timer: any = null;

  mounted() {
    this.start();
  }

  get formattedRemainingTime() {
    const remainingTime = this.stopwatchProcess.baseTime - this.elapsedTime;
    return this.formatFromMillisecondsToStopwatchFormat(remainingTime);
  }

  get formattedElapsedTime() {
    return this.formatFromMillisecondsToStopwatchFormat(this.elapsedTime);
  }

  private formatFromMillisecondsToStopwatchFormat(timeInMilliseconds: number) {
    const minutes = Math.floor((timeInMilliseconds / 1000 / 60) % 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor((timeInMilliseconds / 1000) % 60)
      .toString()
      .padStart(2, '0');
    const milliseconds = Math.ceil(timeInMilliseconds % 1000)
      .toString()
      .padStart(3, '0');
    return `${minutes}:${seconds}:${milliseconds.toString().toString()}`;
  }

  start() {
    console.log('Starting stopwatch...');
    const now = Date.now();
    this.elapsedTime = now - this.stopwatchProcess.startTimeStamp;
    this.baseFormattedTime = this.formatFromMillisecondsToStopwatchFormat(
      this.stopwatchProcess.baseTime,
    );
    this.timer = setInterval(() => {
      this.elapsedTime += 5;
    }, 5);
  }

  stop() {
    clearInterval(this.timer);
  }

  reset() {
    this.elapsedTime = 0;
  }
}
</script>
