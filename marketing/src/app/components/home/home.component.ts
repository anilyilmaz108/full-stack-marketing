import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { initFlowbite } from 'flowbite';
import {
  Observable,
  Subscription,
  catchError,
  filter,
  of,
  repeat,
  switchMap,
  timeout,
  timer,
} from 'rxjs';
import { AltinModel } from 'src/app/models/altin.model';
import { BistModel } from 'src/app/models/bist.model';
import { DolarModel } from 'src/app/models/dolar.model';
import { EuroModel } from 'src/app/models/euro.model';
import { NewsModel } from 'src/app/models/news.model';
import { PortfolioModel } from 'src/app/models/portfolio.model';
import { ShareModel } from 'src/app/models/share.model';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { MarketService } from 'src/app/services/market.service';
import { NewsService } from 'src/app/services/news.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { ShareService } from 'src/app/services/share.service';
import { SuccessService } from 'src/app/services/success.service';
import { ChartComponent } from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: any;
  responsive: ApexResponsive[];
  labels: any;
  colors: any[];
};


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  isLoading: boolean = false;
  constructor() {
    var currentUser = this.authService.userValues();
    this.chartOptions = {
      series: [
        20, 40, 20, 10, 10
      ],
      colors: ["#1C64F2", "#16BDCA", "#9061F9", "#23D8BA", "#CEDA1A", "#C73523"],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["EUR", "USD", "XAU", "TL", "Hisse1", "Hisse2"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  marketService = inject(MarketService);
  errorService = inject(ErrorService);
  successService = inject(SuccessService);
  newsService = inject(NewsService);
  portfolioService = inject(PortfolioService);
  authService = inject(AuthService);
  shareService = inject(ShareService);

  subscriptionBist!: Subscription;
  subscriptionDolar!: Subscription;
  subscriptionEuro!: Subscription;
  subscriptionAltin!: Subscription;

  bist!: BistModel[];
  dolar!: DolarModel[];
  euro!: EuroModel[];
  altin!: AltinModel[];
  news!: NewsModel[];
  portfolio: PortfolioModel[] = [];
  share: any;

  bistValue: any = '';
  degisimBistValue: any = '';
  dolarValue: any = '';
  degisimDolarValue: any = '';
  euroValue: any = '';
  degisimEuroValue: any = '';
  altinValue: any = '';
  degisimAltinValue: any = '';

  usd: number = 32;
  eur: number = 35;
  gold: number = 2428;

  temp: ApexNonAxisChartSeries = [];
  tempLabel: any = [];

  ngOnInit(): void {
    initFlowbite();
    var currentUser = this.authService.userValues();
    this.getPortfolio(currentUser.id!);
    this.getBistData();
    this.getDolarData();
    this.getEuroData();
    this.getAltinData();
    this.getNews();

    //this.getOneTimeDolar();
    //this.getOneTimeEuro();
    //this.getOneTimeGold();
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
              //console.error(err);
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
              //console.error(err);
              return of(null);
            })
          );
        }),
        filter((data) => data !== undefined)
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

/**  // Dolar sadece 1 kez
  getOneTimeDolar(){
    this.getDolarDataByService().subscribe( 
      (val)=> {
        this.usd = Number(val![0].dolar);
      }
    );
  }

    // Euro sadece 1 kez
    getOneTimeEuro(){
      this.getEuroDataByService().subscribe( 
        (val)=> {
          this.eur = Number(val![0].euro);
        }
      );
    }

        // Altın sadece 1 kez
        getOneTimeGold(){
          this.getAltinDataByService().subscribe( 
            (val)=> {
              this.gold = Number(val![0].altin);
            }
          );
        } */

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
              //console.error(err);
              return of(null);
            })
          );
        }),
        filter((data) => data !== undefined)
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
              //console.error(err);
              return of(null);
            })
          );
        }),
        filter((data) => data !== undefined)
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

  shareArr: any = [];
  shareLotArr: any = [];
  // Portfolio
  getPortfolio(user: number){
    this.portfolioService.getPortfolio(user).pipe(
      timeout({
        each: 1000,
      })
    ).subscribe({
      next: (item) => {
        this.portfolio = item;
        this.temp.push(Number(item[0].dolar) * this.usd);
        this.tempLabel.push("USD");
        this.temp.push(Number(item[0].euro) * this.eur);
        this.tempLabel.push("EUR");
        this.temp.push(Number(item[0].altin) * this.gold);
        this.tempLabel.push("XAU");
        this.temp.push(Number(item[0].lira));
        this.tempLabel.push("TL");
        for (let index = 0; index < item[0].hisse!.length; index++) {
          var hisse = item[0].hisse![index];
          var lot = Number(item[0].hisseLot![index]);
          this.searchDataBist(hisse).pipe(
            timeout({
              each: 3000,
            })
          ).subscribe({
            next: (data) => {
              this.share = data;             
              //debugger;
              setTimeout(()=>{     
                this.shareArr.push(this.share[index].fiyat);
                this.shareLotArr.push(this.portfolio[0].hisseLot![index]);
                //debugger;
                this.tempLabel.push(this.share[index].hisse);
                this.temp.push(Number(this.share[0].fiyat) * Number(item[0].hisseLot![index]));
                console.log(this.share[index].hisse);          
            }, 5000);
          
            },
            complete: () => {
             
              //console.log(this.temp);
              //console.log(this.tempLabel);  
   
            }
          });
          //debugger;
          
        }
      
        
      },
      complete: () => {
        setTimeout(()=>{     
          console.log(this.shareArr);
          console.log(this.shareLotArr);   
            this.isLoading = true
            
          
          
      }, 10000);
   
      }
    });

  }

  // Bist100 Veri Arama
   searchDataBist(shareSymbol: string) : Observable<ShareModel>{
    return this.shareService.getShareById(shareSymbol);
  }

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
