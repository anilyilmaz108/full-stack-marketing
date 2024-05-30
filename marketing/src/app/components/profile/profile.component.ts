import { Component, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedModule } from 'src/app/modules/shared.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  spinner = inject(NgxSpinnerService);

  ngOnInit(): void {
    initFlowbite();
    this.spinner.show('profile');
    this.spinner.hide('profile');
  }
}
