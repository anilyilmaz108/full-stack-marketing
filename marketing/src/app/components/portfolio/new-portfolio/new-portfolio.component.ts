import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { initFlowbite } from 'flowbite';
import { Subscription } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { PortfolioService } from 'src/app/services/portfolio.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-new-portfolio',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-portfolio.component.html',
  styleUrl: './new-portfolio.component.css',
})
export class NewPortfolioComponent {
  fb = inject(FormBuilder);
  errorService = inject(ErrorService);
  portfolioService = inject(PortfolioService);
  authService = inject(AuthService);
  shareService = inject(ShareService);
  form!: FormGroup;
  user: any;
  share!: any[];
  subscription!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<NewPortfolioComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    var currentUser = this.authService.userValues();
    this.user = currentUser.id; 
   }

  ngOnInit(): void {
    initFlowbite();
    var currentUser = this.authService.userValues();
    this.user = currentUser.id;
    this.buildForm();
    this.subscription = this.shareService.getShare().subscribe(
      (data) => {
        this.share = data;
      },
      (err) => {
        // API'ye erişilemiyorsa...
        this.errorService.errorHandler(2);
      }
    );
  }

  buildForm() {
    if(this.data) {
      this.form = this.fb.group({
        euro: new FormControl(this.data.euro),
        dolar: new FormControl(this.data.dolar),
        altin: new FormControl(this.data.altin),
        hisse: this.fb.array([]),
        lira: new FormControl(this.data.lira),
        //hisseLot: new FormControl(''),
        //hisseLot: this.fb.array([]),
      });
    } else {
      this.form = this.fb.group({
        euro: new FormControl(''),
        dolar: new FormControl(''),
        altin: new FormControl(''),
        hisse: this.fb.array([]),
        lira: new FormControl(''),
        //hisseLot: new FormControl(''),
        //hisseLot: this.fb.array([]),
      });
    }

  }

  hisse(): FormArray {
    return this.form.get('hisse') as FormArray;
  }

  addHisse() {
    const hisse = this.fb.group({
      hisseSymbol: new FormControl(''),
      hisseLot: new FormControl(''),
    });
    this.hisse().push(hisse);
  }

  removeHisse(index: number) {
    this.hisse().removeAt(index);
  }

  save() {
    const rawForm = this.form.getRawValue();
    var hisseArr: any = [];
    var lotArr: any = [];

    for (let index = 0; index < rawForm.hisse.length; index++) {
      const hisse = rawForm.hisse[index].hisseSymbol;
      const lot = rawForm.hisse[index].hisseLot;
      hisseArr.push(hisse);
      lotArr.push(lot);
    }

    const body = {
      user: Number(this.user),
      dolar: rawForm.dolar,
      euro: rawForm.euro,
      altin: rawForm.altin,
      hisse: hisseArr,
      lira: rawForm.lira,
      hisseLot: lotArr,
    };

    if (this.data == null || this.data == undefined) {
      // Portfolio Oluşturma
      this.portfolioService.createPortfolio(body).subscribe(
        (res) => {
          console.log();
          if (res) {
            this.dialogRef.close('success');
          }
        },
        (err) => {
          //this.errorService.errorHandler(1)
        }
      );
    } else {
      // Portfolio Güncelleme
      this.portfolioService.updatePortfolio(this.user, body).subscribe(
        (res) => {
          if (res) {
            this.dialogRef.close('success');
          }
        },
        (err) => {
          //this.errorService.errorHandler(1)
        }
      );
    }
  }

  //https://medium.com/@stream2085/angular-form-array-an-easy-guide-1823a5bc6f3f
  //https://www.youtube.com/watch?v=hvL-Pnmd65M
}
