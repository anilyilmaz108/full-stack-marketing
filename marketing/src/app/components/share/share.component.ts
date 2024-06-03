import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, first } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ShareService } from 'src/app/services/share.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessService } from 'src/app/services/success.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [SharedModule, CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './share.component.html',
  styleUrl: './share.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareComponent implements AfterViewInit {
  shareService = inject(ShareService);
  errorService = inject(ErrorService);
  successService = inject(SuccessService);
  authService = inject(AuthService);
  share!: any[];
  follow!: any[];
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'hisseSembolu',
    'fiyat',
    'tavan',
    'taban',
    'yuzde',
    'dunKapanis',
    'fark',
    'status',
    'info',
    'fav',
  ];
  subscription!: Subscription;
  user: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  spinner = inject(NgxSpinnerService);
  constructor(public dialog: MatDialog) {
    var currentUser = this.authService.userValues();
    this.user = currentUser;
  }

  ngAfterViewInit(): void {
    initFlowbite();
    var currentUser = this.authService.userValues();
    this.getFollow(currentUser.id!);
    this.spinner.show('share');
    this.subscription = this.shareService.getShare().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.share = data;
        this.spinner.hide('share');
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
  tooltipContent(data: any) {
    return `
    Hisse: ${data.hisseSembolu} \n 
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

  createFollow(data: any, userId: any, shareSymbol: any) {
    var isFollow = true;
    var hasFound = 0;
    console.log(data.hisseSembolu);
    console.log(this.follow);

    for (let index = 0; index < this.follow.length; index++) {
      const element = this.follow[index];
      if (element.hisse === data.hisseSembolu) {
        hasFound++;
      }
    }
    if (hasFound == 0) {
      console.log('Listede yok');
      this.shareService
        .createFollow(userId, shareSymbol)
        .pipe(first())
        .subscribe(
          (res) => {
            console.log(res);
            if (res == null) {
              // Bilgiler hatalıysa
              this.errorService.errorHandler(2);
            } else {
              // Kayıt başarılıysa
              this.successService.successHandler(203);
            }
          },
          (err) => {
            // API'ye erişilemiyorsa...
            this.errorService.errorHandler(404);
          }
        );
    }
  }

  getFollow(id: number) {
    return this.shareService.getFollowList(id).subscribe(
      (data) => {
        this.follow = data;
        console.log(data);
      },
      (err) => {
        // API'ye erişilemiyorsa...
        this.errorService.errorHandler(2);
      }
    );
  }

  // Excel'e veri aktarma
  exportData() {
    /* pass here the table id */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.share);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'Bist100.xlsx');
  }
}
