import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SharedModule } from 'src/app/modules/shared.module';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css'
})
export class SkeletonComponent {
  constructor(){}
  ngOnInit(): void {
    initFlowbite();
    
  }
}
