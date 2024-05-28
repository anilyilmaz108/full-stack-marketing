import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { api } from '../constants';
import { ShareModel } from '../models/share.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }
  httpClient = inject(HttpClient);

  // Bist100 Arama Verileri 
  getShareById(share: string) {
    return this.httpClient.get<ShareModel>(api + '/bist100/' + share);
  }
}
