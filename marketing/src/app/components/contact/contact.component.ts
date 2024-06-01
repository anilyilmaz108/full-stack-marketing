import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { SharedModule } from 'src/app/modules/shared.module';
import { ContactService } from 'src/app/services/contact.service';
import { ErrorService } from 'src/app/services/error.service';
import { SuccessService } from 'src/app/services/success.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  successService = inject(SuccessService);
  errorService = inject(ErrorService);
  fb = inject(FormBuilder);
  contactService = inject(ContactService);

  form!: FormGroup;
  constructor(){}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    const data = {
      name: rawForm.name,
      email: rawForm.email,
      subject: rawForm.subject,
      message: rawForm.message
    };
    this.contactService
      .sendEmail(data)
      .pipe(first())
      .subscribe(
        (res) => {
          // Form gönderilmişse...
          console.log(res);
          if(res == "success") {
            this.successService.successHandler(205);
            this.form.reset();
          } else {
            this.errorService.errorHandler(5);
            this.form.reset();
          } 
        },
        (err) => {
          // API'ye erişilemiyorsa...
          this.errorService.errorHandler(404);
        }
      );
  }

}
