<template>
  <v-container>
    <highcharts :options="executionChart"></highcharts>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TestViewModel } from '../models/test-view-model';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';

@Component({
  name: 'TestViewExecutionChart',
})
export default class TestViewExecutionChart extends Vue {
  get executionChart() {
    const testView: TestViewModel = speedActuatorStoreModule.getTestView;

    const categories: string[] = [];
    const xAxis = {
      categories: categories,
    };
    const yAxis = {
      title: {
        text: 'Velocity (m/s)',
      },
    };

    const plotOptions = {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    };

    const series: any = [];

    testView.turns[0].edges.forEach(e => xAxis.categories.push(e.description));
    testView.turns.forEach(t => {
      const data: number[] = [];
      const serie = {
        name: `Turn ${t.number}`,
        data: data,
      };
      t.edges.forEach(e => serie.data.push(e.velocity));
      series.push(serie);
    });
    return {
      chart: {
        type: 'line',
        height: '250',
      },
      title: {
        text: 'Velocity per Turn x Edge',
      },
      yAxis: yAxis,
      xAxis: xAxis,
      series: series,
      plotOptions: plotOptions,
    };
  }
}
</script>
