import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { initFlowbite } from 'flowbite';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-new-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './new-profile.component.html',
  styleUrl: './new-profile.component.css'
})
export class NewProfileComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  errorService = inject(ErrorService);
  
  form!: FormGroup;
  user: any;

  constructor(
    public dialogRef: MatDialogRef<NewProfileComponent>,
    public dialog: MatDialog,
  ){}

  ngOnInit(): void {
    initFlowbite();
    var currentUser = this.authService.userValues();
    this.user = currentUser;
    this.buildForm();
  }

  buildForm(){
    this.form = this.fb.nonNullable.group({
      email: [this.user.email, Validators.required],
      password: [null, Validators.required],
      repassword: [null, Validators.required]
    });
  }

  save(){
    const rawForm = this.form.getRawValue();
    const body = {
      "email": rawForm.email,
      "password": rawForm.password
    };
    //console.log(this.user);
      this.authService.updateUser(this.user.id, body).subscribe(
        (res) => {
          this.dialogRef.close('success');
        },
        (err) => {
          this.errorService.errorHandler(4);
        }
      );
  
  
  }
}
