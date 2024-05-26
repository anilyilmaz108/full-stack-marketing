import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared.module';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit{
  constructor(){}
  ngOnInit(): void {
    
  }

}
