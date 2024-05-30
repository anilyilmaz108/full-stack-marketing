import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { SuccessService } from 'src/app/services/success.service';
import { NewProfileComponent } from './new-profile/new-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(public dialog: MatDialog){}

  spinner = inject(NgxSpinnerService);
  authService = inject(AuthService);
  portfolioService = inject(PortfolioService);
  successService = inject(SuccessService);
  errorService = inject(ErrorService);

  user: any;
  portfolio: any;

  ngOnInit(): void {
    initFlowbite();
    this.spinner.show('profile');
    var currentUser = this.authService.userValues();
    this.user = currentUser;
    this.getPortfolio();
  }

  // Portfolio
  getPortfolio() {
    this.portfolioService
      .getPortfolio(this.user.id)
      .subscribe({
        next: (item) => {
          this.portfolio = item;
        },
      });
  }

  // User Güncelleme
  updateProfile(){
      const dialogRef = this.dialog.open(NewProfileComponent, {
        width: '380px',
        // disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if(res == "success"){
          this.successService.successHandler(200);
          this.user = this.authService.userValues();
        } else {
          //this.errorService.errorHandler(4);
        }
      });
    }  

    // User Silme
    deleteProfile() {
      this.authService.deleteUser(this.user.id).subscribe(
        (res) => {
            this.successService.successHandler(204);
            this.user = this.authService.userValues();
        },
        (err) => {
          this.errorService.errorHandler(404);
        }
      );
    }
}
