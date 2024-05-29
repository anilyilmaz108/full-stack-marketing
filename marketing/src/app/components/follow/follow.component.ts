import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription} from 'rxjs';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ShareService } from 'src/app/services/share.service';
import { SuccessService } from 'src/app/services/success.service';

@Component({
  selector: 'app-follow',
  standalone: true,
  imports: [SharedModule, CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './follow.component.html',
  styleUrl: './follow.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowComponent implements AfterViewInit, OnDestroy {
  shareService = inject(ShareService);
  errorService = inject(ErrorService);
  successService = inject(SuccessService);
  authService = inject(AuthService);
  userID: any;
  share!: any[];
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'hisse',
    'fiyat',
    'tavan',
    'taban',
    'yuzde',
    'dunKapanis',
    'fark',
    'status',
    'info',
    'del'
  ];
  subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  spinner = inject(NgxSpinnerService);
  constructor(public dialog: MatDialog) {
    var currentUser = this.authService.userValues();
    this.userID = currentUser.id;
  }

  ngAfterViewInit(): void {
    var currentUser = this.authService.userValues();
    initFlowbite();
    this.spinner.show('follow');
    this.subscription = this.shareService.getFollowList(currentUser.id!).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.spinner.hide('follow');
      },
      (err) => {
        // API'ye erişilemiyorsa...
        this.errorService.errorHandler(2);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Düşük Fiyat: ${data.dusukFiyat} \n 
  // Son Fiyat ${data.sonFiyat} \n 
  // Satış Fiyat: ${data.satisFiyat} \n 
  tooltipContent(data:any){
    return `
    Hisse: ${data.hisse} \n 
    Fiyat: ${data.fiyat} \n 
    Ortalama: ${data.ortalama} \n 
    Yüzde: ${data.yuzde} \n 
    Önceki Kapanış: ${data.dunKapanis} \n 
    Fark: ${data.fark} \n 
    En Düşük: ${data.taban} \n 
    En Yüksek: ${data.tavan} \n 
    Hacim: ${data.hacim} \n 
    Lot Hacmi: ${data.hacimLot} \n 
    Son Veri: ${data.saat} \n 
    `;
  }

  deleteFollow(shareSymbol: any) {
    this.shareService.deleteFollow(this.userID, shareSymbol).subscribe(
      (res) => {
          this.successService.successHandler(204);
          this.subscription = this.shareService.getFollowList(this.userID).subscribe(
            (data) => {
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
            },
            (err) => {
              // API'ye erişilemiyorsa...
              this.errorService.errorHandler(2);
            }
          );
        
      },
      (err) => {
        this.errorService.errorHandler(404);
      }
    );
  }

  exportData(){}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
