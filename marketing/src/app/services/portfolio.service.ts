import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { api } from '../constants';
import { PortfolioModel } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  constructor() { }
  httpClient = inject(HttpClient);

  // Portfolio Verileri 
  getPortfolio(user: number) {
    return this.httpClient.get<PortfolioModel[]>(api + '/getPortfolio/' + user);
  }
}
