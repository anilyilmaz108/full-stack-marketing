import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { SharedModule } from 'src/app/modules/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(){}
  ngOnInit(): void {
    initFlowbite();
  }

}
