import { Component, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
})
export class GraficoComponent {

  @ViewChild('chartWrapper') chartWrapper!: ElementRef;

  addHoverSync(container: HTMLElement) {
    container.addEventListener('mousemove', (e: MouseEvent) => {
      Highcharts.charts.forEach((chart) => {
        if (chart && chart.series.length > 0) {
          const event = chart.pointer.normalize(e);
          const point = chart.series[0].searchPoint(event, true);

          if (point) {
            (point as any).onMouseOver(); // tooltip
            chart.tooltip.refresh(point); // refresh tooltip
            chart.xAxis[0].drawCrosshair(event, point); // crosshair
          }
        }
      });
    });

    container.addEventListener('mouseleave', () => {
      Highcharts.charts.forEach((chart) => {
        if (chart) {
          chart.tooltip.hide();
          chart.xAxis[0].hideCrosshair();
        }
      });
    });
  }

  ngAfterViewInit() {
    this.addHoverSync(this.chartWrapper.nativeElement);
  }

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options[] = [];
  
  ngOnInit(): void {
    const xData = ['Lun', 'Mar', 'Mié', 'Jue', 'Vier', 'Sab', 'Dom'];

    const datasets = [
      { data: [7.2, 7.0, 6.5, 7.5, 7.0, 7.3, 7.5], type: 'line' as const },
      { data: [20, 24, 23, 20, 18, 28, 20], type: 'line' as const },
    ];

    this.chartOptions = datasets.map((dataset, i) => ({
      chart: {
        marginLeft: 50,
        spacingTop: 10,
        spacingBottom: 10,
        height: 150,
        zoomType: 'x',
        events: {
          selection: function (event) {
            const thisChart = this;
            if (event.xAxis) {
              Highcharts.charts.forEach(chart => {
                if (chart && chart !== thisChart) {
                  chart.xAxis[0].setExtremes(
                    event.xAxis[0].min!,
                    event.xAxis[0].max!,
                    true,
                    false
                  );
                }
              });
            }
            return false;
          }
        }
      },
      title: { text: undefined },
      legend: { enabled: false },
      xAxis: {
        crosshair: true,
        categories: xData,
        events: {
          setExtremes: function (e) {
            const thisChart = this.chart;
            if (e.trigger !== 'syncExtremes') {
              Highcharts.charts.forEach(chart => {
                if (chart && chart !== thisChart) {
                  chart.xAxis[0].setExtremes(e.min!, e.max!, true, false, {
                    trigger: 'syncExtremes',
                  });
                }
              });
            }
          }
        }
      },
      yAxis: { title: { text: undefined } },
      tooltip: {
        shared: true,
        crosshairs: true
      },
      series: [{
        name: i === 0 ? 'pH' : i === 1 ? 'Clima' : `Serie ${i + 1}`,
        color: i === 0 ? '#007bff' : i === 1 ? '#ff0000' : undefined,
        data: dataset.data,
        type: dataset.type
      }]
    }));
  }
}