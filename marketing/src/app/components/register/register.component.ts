import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { first } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { SuccessService } from 'src/app/services/success.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  constructor() {}
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  errorService = inject(ErrorService);
  successService = inject(SuccessService);
  user: UserModel = new UserModel();

  ngOnInit(): void {
    initFlowbite();
  }

  form = this.fb.nonNullable.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
    repassword: [null, Validators.required],
  });

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    const data = {
      email: rawForm.email,
      password: rawForm.password,
    };
    if (rawForm.email === '' || rawForm.password === '') {
      this.errorService.errorHandler(0);
    }
    if(rawForm.password !== rawForm.repassword) {
      this.errorService.errorHandler(1);
    }
    this.authService
      .registerByApi(data)
      .pipe(first())
      .subscribe(
        (res) => {
          //console.log(res);
          if (res == null) {
            // Bilgiler hatalıysa
            this.errorService.errorHandler(0);
          } else {
            // Kayıt başarılıysa
            this.successService.successHandler(202);
          }
          
        },
        (err) => {
          // API'ye erişilemiyorsa...
          this.errorService.errorHandler(404);
        }
      );
  }
}
