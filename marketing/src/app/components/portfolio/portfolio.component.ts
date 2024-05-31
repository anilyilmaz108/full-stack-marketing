import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { initFlowbite } from 'flowbite';
import { ChartComponent } from 'ng-apexcharts';
import { Observable, timeout } from 'rxjs';
import { PortfolioModel } from 'src/app/models/portfolio.model';
import { ShareModel } from 'src/app/models/share.model';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { ShareService } from 'src/app/services/share.service';
import { SuccessService } from 'src/app/services/success.service';
import { NewPortfolioComponent } from './new-portfolio/new-portfolio.component';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: any;
  responsive: ApexResponsive[];
  labels: any;
  colors: any[];
};

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  user: any;
  portfolio: PortfolioModel[] = [];
  portfolioService = inject(PortfolioService);
  authService = inject(AuthService);
  shareService = inject(ShareService);
  successService = inject(SuccessService);
  errorService = inject(ErrorService);
  router = inject(Router);
  spinner = inject(NgxSpinnerService);

  constructor(public dialog: MatDialog) {
    this.chartOptions = {
      series: [20, 40, 20, 10, 10],
      colors: [
        '#1C64F2',
        '#16BDCA',
        '#9061F9',
        '#23D8BA',
        '#CEDA1A',
        '#C73523',
      ],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['EUR', 'USD', 'XAU', 'TL', 'Hisse1', 'Hisse2'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  usd: number = 32;
  eur: number = 35;
  gold: number = 2428;

  share: any;
  temp: ApexNonAxisChartSeries = [];
  tempLabel: any = [];
  isLoading: boolean = false;

  ngOnInit(): void {
    initFlowbite();
    this.portfolio[0] != null ? this.spinner.show('portfolio') : null;
    var currentUser = this.authService.userValues();
    this.getPortfolio(currentUser.id!);
    this.user = currentUser.id;
  }

  shareArr: any = [];
  shareLotArr: any = [];

  // Bist100 Veri Arama
  searchDataBist(shareSymbol: string): Observable<ShareModel> {
    return this.shareService.getShareById(shareSymbol);
  }

  // Portfolio
  getPortfolio(user: number) {
    this.tempLabel = [];
    this.temp= [];
    this.portfolio= [];
    this.shareArr= [];
    this.shareLotArr= [];
    this.share= [];
    this.portfolioService
      .getPortfolio(user)
      .pipe(
        timeout({
          each: 1000,
        })
      )
      .subscribe({
        next: (item) => {
          this.portfolio = item;
          this.temp.push(Number(item[0].dolar) * this.usd);
          this.tempLabel.push('USD');
          this.temp.push(Number(item[0].euro) * this.eur);
          this.tempLabel.push('EUR');
          this.temp.push(Number(item[0].altin) * this.gold);
          this.tempLabel.push('XAU');
          this.temp.push(Number(item[0].lira));
          this.tempLabel.push('TL');
          for (let index = 0; index < item[0].hisse!.length; index++) {
            var hisse = item[0].hisse![index];
            var lot = Number(item[0].hisseLot![index]);
            this.searchDataBist(hisse)
              .pipe(
                timeout({
                  each: 3000,
                })
              )
              .subscribe({
                next: (data) => {
                  this.share = data;
                  setTimeout(() => {
                    this.shareArr.push(this.share[index].fiyat);
                    this.shareLotArr.push(this.portfolio[0].hisseLot![index]);
                    this.tempLabel.push(this.share[index].hisse);
                    this.temp.push(
                      Number(this.share[0].fiyat) *
                        Number(item[0].hisseLot![index])
                    );
                    console.log(this.share[index].hisse);
                  }, 5000);
                },
                complete: () => {
                  this.spinner.hide('portfolio');
                  //console.log(this.temp);
                  //console.log(this.tempLabel);
                },
              });
          }
        },
        complete: () => {
          setTimeout(() => {
            console.log(this.shareArr);
            console.log(this.shareLotArr);
            this.isLoading = true;
          }, 10000);
        },
      });
  }

  // Portfolyo Güncelleme
  updatePortfolio(data:any){
    if(this.portfolio == undefined || this.portfolio == null){
      data = null;
    }
      const dialogRef = this.dialog.open(NewPortfolioComponent, {
        width: '380px',
        height: '100%',
        // disableClose: true,
        data: { data },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if(res == "success"){
          this.getPortfolio(Number(this.user));
          this.successService.successHandler(200);
        } else {
          //this.errorService.errorHandler(4);
        }
      });
  }
}
