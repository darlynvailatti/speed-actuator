<template>
  <div>
    {{ store.sensorRawData.length }}
    <v-container fluid class="pa-0 ma-0">
      <highcharts :options="rawDataChart"></highcharts>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { subscribeOnSensorRawDataChannel } from '../service/socket-service';
import { speedSensorGatewayStoreModule } from '../store/speed-sensor-gateway-store';

@Component({
  name: 'SensorRawDataView',
  components: {},
})
export default class SensorRawDataView extends Vue {
  created() {
    subscribeOnSensorRawDataChannel();
  }

  get store() {
    return speedSensorGatewayStoreModule;
  }

  get rawDataChart() {
    const sensorRawData = this.store.sensorRawData;

    if (!sensorRawData || sensorRawData.length <= 0) {
      return this.defaultChart;
    }

    const categories: string[] = [];
    categories.push('Distance');
    const xAxis = {
      categories: categories,
    };

    const series: any = [];

    const data: number[] = [];

    sensorRawData.forEach(s => data.push(s.distance));

    const serie = {
      name: `Distance`,
      data: data,
    };

    series.push(serie);

    const defaultChart = this.defaultChart;
    defaultChart.series = series;
    defaultChart.xAxis.categories = categories;

    console.log(defaultChart);

    return {
      chart: defaultChart.chart,
      title: defaultChart.title,
      xAxis: defaultChart.xAxis,
      yAxis: defaultChart.yAxis,
      series: defaultChart.series,
      plotOptions: defaultChart.plotOptions,
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
}
</script>
