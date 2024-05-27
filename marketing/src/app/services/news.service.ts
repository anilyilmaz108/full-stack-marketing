import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { api } from '../constants';
import { NewsModel } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor() { }
  httpClient = inject(HttpClient);

  // Haber Verileri
  getNews() {
    return this.httpClient.get<NewsModel[]>(api + '/news');
  }
}
