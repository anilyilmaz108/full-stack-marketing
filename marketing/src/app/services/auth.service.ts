import { Injectable, inject } from '@angular/core';
import { api } from '../constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user?: Observable<UserModel>;
  private userSubject: BehaviorSubject<any>;
  httpClient = inject(HttpClient);
  router = inject(Router);

  constructor() {
    this.userSubject = new BehaviorSubject<any>(this.user);
    this.user = this.userSubject.asObservable();
  }

  // User Bilgileri
  userValues(): UserModel {
    return this.userSubject!.value;
  }

  // Apiden login olma işlemi
  loginByApi(data: any): Observable<any> {
    return this.httpClient.post(`${api}/login`, data).pipe(
      map((res) => {
        this.userSubject.next(res);
        this.router.navigateByUrl('/');
        return res;
      })
    );
  }

  // Apiden register olma işlemi
  registerByApi(data: any): Observable<any> {
    return this.httpClient.post(`${api}/register`, data).pipe(
      map((res) => {
        this.userSubject.next(res);
        this.router.navigateByUrl('/');
        return res;
      })
    );
  }

  // User Güncelleme
  updateUser(user: any, data: any): Observable<any> {
    return this.httpClient.put(api + '/updateUser/' + user, data).pipe(
      map((res) => {
        this.userSubject.next(res);
        return res;
      })
    );
  }

  // User Silme
  public deleteUser(userId: any): Observable<any> {
    return this.httpClient.delete(api + '/deleteUser/' + userId);
  }
}
