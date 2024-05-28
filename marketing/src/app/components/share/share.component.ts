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
import { Subscription } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ShareService } from 'src/app/services/share.service';
import { MatDialog } from '@angular/material/dialog';

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
  authService = inject(AuthService);
  share!: any[];
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
    'fav'
  ];
  subscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  spinner = inject(NgxSpinnerService);
  constructor(public dialog: MatDialog) {
    var currentUser = this.authService.userValues();
  }

  ngAfterViewInit(): void {
    initFlowbite();
    //var currentUser = this.authService.userValues();

    this.spinner.show('share');
    this.subscription = this.shareService.getShare().subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
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
  tooltipContent(data:any){
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

  exportData(){}
}
