import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { initFlowbite } from 'flowbite';
import {
  Subscription,
  catchError,
  filter,
  of,
  repeat,
  switchMap,
  timer,
} from 'rxjs';
import { AltinModel } from 'src/app/models/altin.model';
import { BistModel } from 'src/app/models/bist.model';
import { DolarModel } from 'src/app/models/dolar.model';
import { EuroModel } from 'src/app/models/euro.model';
import { NewsModel } from 'src/app/models/news.model';
import { SharedModule } from 'src/app/modules/shared.module';
import { ErrorService } from 'src/app/services/error.service';
import { MarketService } from 'src/app/services/market.service';
import { NewsService } from 'src/app/services/news.service';
import { SuccessService } from 'src/app/services/success.service';

// Pie-Chart Model
interface ChartOptions {
  series: number[];
  colors: string[];
  chart: {
    height: number;
    width: string;
    type: string;
  };
  stroke: {
    colors: string[];
    lineCap: string;
  };
  plotOptions: {
    pie: {
      labels: {
        show: boolean;
      };
      size: string;
      dataLabels: {
        offset: number;
      };
    };
  };
  labels: string[];
  dataLabels: {
    enabled: boolean;
    style: {
      fontFamily: string;
    };
  };
  legend: {
    position: string;
    fontFamily: string;
  };
  yaxis: {
    labels: {
      formatter: (value: number) => string;
    };
  };
  xaxis: {
    labels: {
      formatter: (value: number) => string;
    };
    axisTicks: {
      show: boolean;
    };
    axisBorder: {
      show: boolean;
    };
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor() {}
  marketService = inject(MarketService);
  errorService = inject(ErrorService);
  successService = inject(SuccessService);
  newsService = inject(NewsService);

  subscriptionBist!: Subscription;
  subscriptionDolar!: Subscription;
  subscriptionEuro!: Subscription;
  subscriptionAltin!: Subscription;

  bist!: BistModel[];
  dolar!: DolarModel[];
  euro!: EuroModel[];
  altin!: AltinModel[];
  news!: NewsModel[];

  bistValue: any = '';
  degisimBistValue: any = '';
  dolarValue: any = '';
  degisimDolarValue: any = '';
  euroValue: any = '';
  degisimEuroValue: any = '';
  altinValue: any = '';
  degisimAltinValue: any = '';

  ngOnInit(): void {
    initFlowbite();
    this.getBistData();
    this.getDolarData();
    this.getEuroData();
    this.getAltinData();
    this.getNews();

    // Pie-Chart
    if (
      document.getElementById('pie-chart') &&
      typeof ApexCharts !== 'undefined'
    ) {
      const chart = new ApexCharts(
        document.getElementById('pie-chart'),
        this.getChartOptions()
      );
      chart.render();
    }
  }

  // Bist
  getBistDataByService() {
    return this.marketService.getBist(1);
  }

  getBistData() {
    this.subscriptionBist = timer(1000, 1000)
      .pipe(
        switchMap(() => {
          return this.getBistDataByService().pipe(
            catchError((err) => {
              // Handle errors
              console.error(err);
              return of(null);
            })
          );
        }),
        filter((data) => data !== undefined)
      )
      .subscribe(
        (data) => {
          if (data![0].bist != undefined && data![0].bist !== null) {
            this.bistValue = data![0].bist;
            this.degisimBistValue = data![0].degisimBist;
          }
        },
        (err) => {
          // API'ye erişilemiyorsa...
          this.errorService.errorHandler(404);
        }
      );
  }

  // Dolar
  getDolarDataByService() {
    return this.marketService.getDolar(2);
  }

  getDolarData() {
    this.subscriptionDolar = timer(1000, 1000)
      .pipe(
        switchMap(() => {
          return this.getDolarDataByService().pipe(
            catchError((err) => {
              // Handle errors
              console.error(err);
              return of(null);
            })
          );
        })
        //filter((data) => data !== undefined)
      )
      .subscribe(
        (data) => {
          if (data![0].dolar != undefined && data![0].dolar !== null) {
            this.dolarValue = data![0].dolar;
            this.degisimDolarValue = data![0].degisimdolar;
          }
        },
        (err) => {
          // API'ye erişilemiyorsa...
          this.errorService.errorHandler(404);
        }
      );
  }

  // Euro
  getEuroDataByService() {
    return this.marketService.getEuro(3);
  }

  getEuroData() {
    this.subscriptionEuro = timer(1000, 1000)
      .pipe(
        switchMap(() => {
          return this.getEuroDataByService().pipe(
            catchError((err) => {
              // Handle errors
              console.error(err);
              return of(null);
            })
          );
        })
        //filter((data) => data !== undefined)
      )
      .subscribe(
        (data) => {
          if (data![0].euro != undefined && data![0].euro !== null) {
            this.euroValue = data![0].euro;
            this.degisimEuroValue = data![0].degisimeuro;
          }
        },
        (err) => {
          // API'ye erişilemiyorsa...
          this.errorService.errorHandler(404);
        }
      );
  }

  // Altın
  getAltinDataByService() {
    return this.marketService.getAltin(4);
  }

  getAltinData() {
    this.subscriptionAltin = timer(1000, 1000)
      .pipe(
        switchMap(() => {
          return this.getAltinDataByService().pipe(
            catchError((err) => {
              // Handle errors
              console.error(err);
              return of(null);
            })
          );
        })
        //filter((data) => data !== undefined)
      )
      .subscribe(
        (data) => {
          if (data![0].altin != undefined && data![0].altin !== null) {
            this.altinValue = data![0].altin;
            this.degisimAltinValue = data![0].degisimaltin;
          }
        },
        (err) => {
          // API'ye erişilemiyorsa...
          this.errorService.errorHandler(404);
        }
      );
  }

  // Haberler
  getNews() {
    this.newsService.getNews().subscribe((data) => {
      this.news = data;
    });
  }

  // Pie-Chart Properties
  getChartOptions = (): ChartOptions => {
    return {
      series: [52.8, 26.8, 20.4],
      colors: ['#1C64F2', '#16BDCA', '#9061F9'],
      chart: {
        height: 420,
        width: '100%',
        type: 'pie',
      },
      stroke: {
        colors: ['white'],
        lineCap: '',
      },
      plotOptions: {
        pie: {
          labels: {
            show: true,
          },
          size: '100%',
          dataLabels: {
            offset: -25,
          },
        },
      },
      labels: ['Direct', 'Organic search', 'Referrals'],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: 'Inter, sans-serif',
        },
      },
      legend: {
        position: 'bottom',
        fontFamily: 'Inter, sans-serif',
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return value + '%';
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value: number) {
            return value + '%';
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };

  ngOnDestroy() {
    this.subscriptionBist.unsubscribe();
    this.subscriptionDolar.unsubscribe();
    this.subscriptionEuro.unsubscribe();
    this.subscriptionAltin.unsubscribe();
  }

  //https://tailwindcomponents.com/component/form-29
  //https://tailwindcomponents.com/component/tailwind-css-cards-social
  //https://tailwindcomponents.com/component/simple-gradient-stats-card
}
