import { Component } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared.module';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor(){}

  ngOnInit(): void {

  }
}
