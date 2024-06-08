import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { api } from '../constants';
import { PortfolioModel } from '../models/portfolio.model';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  public share?: Observable<any>;
  private shareSubject: BehaviorSubject<any>;

  constructor() {
    this.shareSubject = new BehaviorSubject<any>(this.share);
    this.share = this.shareSubject.asObservable();
   }
  httpClient = inject(HttpClient);

  // Portfolio Verileri 
  getPortfolio(user: number) {
    return this.httpClient.get<PortfolioModel[]>(api + '/portfolio/getPortfolio/true/' + user);
  }

  // Portfolio Güncelleme
  updatePortfolio(user: any, data: any): Observable<any> {
    return this.httpClient.put(api + '/portfolio/updatePortfolio/true/' + user, data).pipe(
      map((res) => {
        this.shareSubject.next(res);
        return res;
      })
    );
  }

  // Portfolio Oluşturma
  createPortfolio(data: any): Observable<any> {
    return this.httpClient.post(`${api}/portfolio/createPortfolio/true`, data).pipe(
      map((res) => {
        this.shareSubject.next(res);
        return res;
      })
    );
  }
}
