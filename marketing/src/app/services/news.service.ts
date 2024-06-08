import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { api } from '../constants';
import { NewsModel } from '../models/news.model';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor() {}
  httpClient = inject(HttpClient);

  // Haber Verileri
  getNews() {
    return this.httpClient.get<NewsModel[]>(api + '/news/economy/true');
  }

  // Finans Verileri
  getFinance() {
    return this.httpClient.get<NewsModel[]>(api + '/news/finance/true');
  }

  // Teknoloji Verileri
  getTech() {
    return this.httpClient.get<NewsModel[]>(api + '/news/tech/true');
  }

  // Kültür-Sanat Verileri
  getCulture() {
    return this.httpClient.get<NewsModel[]>(api + '/news/culture/true');
  }

    // Sağlık Verileri
    getHealth() {
      return this.httpClient.get<NewsModel[]>(api + '/news/health/true');
    }
}
