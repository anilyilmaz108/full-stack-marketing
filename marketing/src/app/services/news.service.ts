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
    return this.httpClient.get<NewsModel[]>(api + '/news');
  }

  // Finans Verileri
  getFinance() {
    return this.httpClient.get<NewsModel[]>(api + '/finance');
  }

  // Teknoloji Verileri
  getTech() {
    return this.httpClient.get<NewsModel[]>(api + '/tech');
  }

  // Kültür-Sanat Verileri
  getCulture() {
    return this.httpClient.get<NewsModel[]>(api + '/culture');
  }

    // Sağlık Verileri
    getHealth() {
      return this.httpClient.get<NewsModel[]>(api + '/health');
    }
}
