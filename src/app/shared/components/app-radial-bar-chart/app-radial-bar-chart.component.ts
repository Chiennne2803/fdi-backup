import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ApexChart, ApexFill, ApexNonAxisChartSeries, ApexPlotOptions, ApexStroke, ChartComponent} from 'ng-apexcharts';
import {Score} from '../../../models/service';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    stroke: ApexStroke;
};

@Component({
    selector: 'app-radial-bar-chart',
    templateUrl: './app-radial-bar-chart.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
})
export class AppRadialBarChartComponent implements OnInit, OnChanges {
    @ViewChild('chart') chart: ChartComponent;

    @Input() title: string = '';
    @Input() color: string = '#4c84fc';
    @Input() height: number = 200;
    @Input() score: Score = {
        total: 0,
        value: 0,
        label: '',
    };
    @Input() hideLabel: boolean = false;

    public chartOptions: Partial<ChartOptions>;

    constructor(
    ) { }

    ngOnInit(): void {
        this.setChartOption();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.score && this.chart) {
            this.setChartOption();
        }
    }

    private setChartOption(): void {
        // this.chartOptions = {
        //     series: [this.getPercent()],
        //     chart: {
        //         height: this.height,
        //         type: 'radialBar',
        //     },
        //     plotOptions: {
        //         radialBar: {
        //             startAngle: -180,
        //             endAngle: 180,
        //             hollow: {
        //                 margin: 0,
        //                 size: '80%',
        //                 background: '#fff',
        //                 image: undefined,
        //                 position: 'back',
        //                 dropShadow: {
        //                     enabled: true,
        //                     top: 1,
        //                     left: 0,
        //                     blur: 1,
        //                     opacity: 0.24
        //                 }
        //             },
        //             track: {
        //                 background: '#fff',
        //                 strokeWidth: '67%',
        //                 margin: 0,
        //                 dropShadow: {
        //                     enabled: true,
        //                     top: -1,
        //                     left: 0,
        //                     blur: 1,
        //                     opacity: 0.35
        //                 }
        //             },

        //             dataLabels: {
        //                 show: true,
        //                 name: {
        //                     offsetY: 20,
        //                     show: true,
        //                     color: '#cfd3db',
        //                     fontSize: '20px'
        //                 },
        //                 value: {
        //                     formatter: (val): string => this.score.value.toString(),
        //                     offsetY: this.hideLabel ? -5 : -15,
        //                     color: '#111',
        //                     fontSize: '28px',
        //                     show: true
        //                 }
        //             }
        //         }
        //     },
        //     fill: {
        //         colors: ['#FF0000FF'],
        //         type: 'gradient',
        //         gradient: {
        //             type: 'diagonal2',
        //             gradientToColors: ['#BBFFA7FF'],
        //             stops: [0, this.score.total],
        //         }
        //     },
        //     stroke: {
        //         lineCap: 'round',
        //         curve: 'stepline',
        //     },
        //     labels: [this.hideLabel ? '' : this.score.label]
        // };
        this.chartOptions = {
            series: [this.getPercent()],
            chart: {
                height: 250, // to hơn
                type: 'radialBar',
                offsetY: 0,
            },
            plotOptions: {
                radialBar: {
                startAngle: 0,
                endAngle: 360,
                hollow: {
                    size: '70%',
                    background: '#fff',
                },
                track: {
                    background: '#f3f3f3',
                    strokeWidth: '100%', // to viền
                },
                dataLabels: {
                    name: {
                    show: true,
                    color: '#333',
                    fontSize: '14px',
                    offsetY: -10,
                    },
                    value: {
                    show: true,
                    fontSize: '22px',
                    fontWeight: 600,
                    offsetY: -2, // gần hơn với name
                    color: this.color,
                    formatter: () => `${this.score.value}/${this.score.total}`,
                    }
                }
                }
            },
            fill: {
                type: 'solid',
                colors: [this.color], // mã màu truyền vào
            },
            stroke: {
                lineCap: 'butt',
            },
            labels: [this.title]
        };

    }

    private getPercent(): number {
        if (this.score.value == 0) return 0;
        return Math.round((this.score.value / this.score.total) * 100);
    }
}
