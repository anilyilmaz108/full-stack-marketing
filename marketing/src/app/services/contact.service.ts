import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { api } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  httpClient = inject(HttpClient);
  constructor() {}

  sendEmail(data:any) {
    return this.httpClient.post(`${api}/sendmail`, data);
  }
}
