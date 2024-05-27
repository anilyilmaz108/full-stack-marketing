import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BistModel } from '../models/bist.model';
import { api } from '../constants';
import { DolarModel } from '../models/dolar.model';
import { EuroModel } from '../models/euro.model';
import { AltinModel } from '../models/altin.model';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  constructor() { }
  httpClient = inject(HttpClient);

  // Bist Verileri ==1
  getBist(id: number) {
    return this.httpClient.get<BistModel[]>(api + '/market/' + id);
  }
  // Dolar Verileri ==2
  getDolar(id: number) {
    return this.httpClient.get<DolarModel[]>(api + '/market/' + id);
  }
  // Euro Verileri ==3
  getEuro(id: number) {
    return this.httpClient.get<EuroModel[]>(api + '/market/' + id);
  }
  // Altın Verileri ==4
  getAltin(id: number) {
    return this.httpClient.get<AltinModel[]>(api + '/market/' + id);
  }
}
