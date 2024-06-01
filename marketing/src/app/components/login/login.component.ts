import { Component, OnInit, inject } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { UserModel } from 'src/app/models/user.model';
import { first } from 'rxjs';
import { SuccessService } from 'src/app/services/success.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
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
    email: ['testuser@gmail.com', Validators.required],
    password: ['123123', Validators.required],
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
    this.authService
      .loginByApi(data)
      .pipe(first())
      .subscribe(
        (res) => {
          console.log(res);
          if (res == null) {
            // Bilgiler hatalıysa
            this.errorService.errorHandler(0);
          } else {
            // Giriş başarılıysa
            this.successService.successHandler(201);
          }
          
        },
        (err) => {
          // API'ye erişilemiyorsa...
          this.errorService.errorHandler(404);
        }
      );
  }
  //https://tailwindcomponents.com/component/login-page-with-image
}
