<template>
  <v-container fluid class="pa-0 ma-0">
    <highcharts :options="executionChart"></highcharts>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { TestViewModel } from '../models/test-view-model';
import { speedActuatorStoreModule } from '../store/speed-actuator-store';

@Component({
  name: 'TestViewTimeExecutionChart',
})
export default class TestViewTimeExecutionChart extends Vue {
  get executionChart() {
    const testView: TestViewModel = speedActuatorStoreModule.getTestView;

    if (!testView || !testView.turns || testView.turns.length <= 0) {
      return this.defaultChart;
    }

    const categories: string[] = [];
    const xAxis = {
      categories: categories,
    };

    const series: any = [];

    testView.turns[0].edges.forEach(e => xAxis.categories.push(e.description));
    testView.turns.forEach(t => {
      const data: number[] = [];
      const serie = {
        name: `Turn ${t.number}`,
        data: data,
      };
      t.edges.forEach(e => serie.data.push(e.totalTime));
      series.push(serie);
    });

    const defaultChart = this.defaultChart;
    defaultChart.series = series;
    defaultChart.xAxis.categories = categories;

    return {
      chart: defaultChart.chart,
      title: defaultChart.title,
      xAxis: defaultChart.xAxis,
      yAxis: defaultChart.yAxis,
      series: defaultChart.series,
      plotOptions: defaultChart.plotOptions,
    };
  }

  private get defaultChartPlotOptions() {
    return {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    };
  }

  private get defaultChart() {
    const cateogries: Array<string> = [];
    return {
      chart: {
        type: 'line',
        height: '250',
      },
      title: {
        text: null,
      },
      xAxis: {
        categories: cateogries,
      },
      yAxis: {
        title: {
          text: 'Total time (seconds)',
        },
      },
      series: [],
      plotOptions: this.defaultChartPlotOptions,
    };
  }
}
</script>
