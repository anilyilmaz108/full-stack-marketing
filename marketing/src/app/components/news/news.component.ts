import { Component, OnInit, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { map, take } from 'rxjs';
import { NewsModel } from 'src/app/models/news.model';
import { SharedModule } from 'src/app/modules/shared.module';
import { AuthService } from 'src/app/services/auth.service';
import { NewsService } from 'src/app/services/news.service';
import { TypewriterService } from 'src/app/services/typewritter.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  newsService = inject(NewsService);
  authService = inject(AuthService);
  typewriterService = inject(TypewriterService);

  news!: NewsModel[];
  finance!: NewsModel[];
  tech!: NewsModel[];
  culture!: NewsModel[];
  health!: NewsModel[];

  currentDate = new Date();

  constructor() {
    var currentUser = this.authService.userValues();
  }
  ngOnInit(): void {
    initFlowbite();
    this.getNews();
    this.getFinance();
    this.getTech();
    this.getCulture();
    this.getHealth();
  }

  titles = ['Piyasam Haberler'];

  // Typewritter effect
  typedText$ = this.typewriterService
    .getTypewriterEffect(this.titles)
    .pipe(map((text) => text));

  // Ekonomi Haberleri
  getNews() {
    this.newsService.getNews().subscribe((data) => {
      this.news = data;
    });
  }

  // Finans Haberleri
  getFinance() {
    this.newsService.getFinance().subscribe((data) => {
      this.finance = data;
    });
  }

  // Teknoloji Haberleri
  getTech() {
    this.newsService.getTech().pipe(take(1)).subscribe((data) => {
      this.tech = data;
    });
  }

  // Kültür-Sanat Haberleri
  getCulture() {
    this.newsService.getCulture().subscribe((data) => {
      this.culture = data;
    });
  }

  // Teknoloji Haberleri
  getHealth() {
    this.newsService.getHealth().subscribe((data) => {
      this.health = data;
    });
  }
}
