import { Injectable, inject } from '@angular/core';
import { api } from '../constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserModel } from '../models/user.model';
//import { LocalStorageService } from './local-storage.service';
import "core-js/stable/atob";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { asciiToWord } from '../helpers/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userInfo: any;
  public user?: Observable<UserModel>;
  private userSubject: BehaviorSubject<any>;

  httpClient = inject(HttpClient);
  router = inject(Router);
  //localStorage = inject(LocalStorageService);

  constructor() {
    //const token = localStorage.getItem('currentUser');
    const token = localStorage.getItem('currentUser') ? localStorage.getItem('currentUser') : sessionStorage.getItem('currentUser');
    console.log(token);

    this.userInfo = this.setUserInfo(token);
    this.userSubject = new BehaviorSubject<any>(this.userInfo);
    this.user = this.userSubject.asObservable();
  }

  // User Bilgileri
  userValues(): UserModel {
    return this.userSubject!.value;
  }

  // Apiden login olma işlemi
  loginByApi(data: any): Observable<any> {
    return this.httpClient.post(`${api}/auth/login`, data).pipe(
      map((res:any) => {
        //localStorage.removeItem('currentUser');
        sessionStorage.setItem('currentUser', res.currentUser);
        localStorage.removeItem('currentUser');

        //localStorage.setItem('currentUser', `${JSON.stringify(res)}`);
        this.userInfo = this.setUserInfo(res.currentUser);
        this.userSubject.next(this.userInfo);
        this.router.navigateByUrl('/');
        return res;
      })
    );
  }

  // Apiden register olma işlemi
  registerByApi(data: any): Observable<any> {
    return this.httpClient.post(`${api}/auth/register`, data).pipe(
      map((res) => {
        this.userSubject.next(res);
        this.router.navigateByUrl('/');
        return res;
      })
    );
  }

  // User Güncelleme
  updateUser(user: any, data: any): Observable<any> {
    return this.httpClient.put(api + '/user/updateUser/' + user, data).pipe(
      map((res) => {
        //this.localStorage.removeData('currentUser');
        this.userSubject.next(res);
        //this.localStorage.saveData('currentUser', JSON.stringify(res));
        return res;
      })
    );
  }

  // User Silme
  public deleteUser(userId: any): Observable<any> {
    return this.httpClient.delete(api + '/user/deleteUser/' + userId);
  }

  // User Logout
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    //sessionStorage.removeItem('currentUser');
    this.router.navigateByUrl('/login');
}

setUserInfo(token: any) {
  //token = localStorage.getItem('currentUser');
  //const payload = JSON.parse(token); 
  //token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjY2kiOiIwNDkiLCJjY3IiOiIxMTYxMDExMTUxMTYxMTcxMTUxMDExMTQwNjQxMDMxMDkwOTcxMDUxMDgwNDYwOTkxMTExMDkiLCJ1biI6IjA0OTA1MDA1MTA0OTA1MDA1MSIsInQiOiIxMTcxMTUxMDExMTQiLCJmbiI6IjExNzExMDEwMDEwMTEwMjEwNTExMDEwMTEwMCIsImxuIjoiMTE3MTEwMTAwMTAxMTAyMTA1MTEwMTAxMTAwIiwicG4iOiIiLCJpYXQiOjE3MTc3NTY1MTcsImV4cCI6MTcxODI3NDkxN30.0Ld8CAIYZHEOWCKBsPfgiN4RhqDE3PzvfxH-4WvtUGE";
  if(token != null) {   
/*
    const id = Number(payload.id); 
    const email = payload.email;
    const password = payload.password;
    const role = payload.role;
    const createdAt = payload.createdAt;
    const updatedAt = payload.updatedAt;
    const version = payload.version;
     */

    //
    console.log('token', token);

    const payload: any = jwtDecode(token);
    console.log('payload', payload);
      const id = Number(payload.id);
      const email = payload.mail;
      const password = payload.password
      const role = payload.role;
      const createdAt = payload.createdAt;
      const updatedAt = payload.updatedAt;
      const version = payload.version;

    return {
      token,
      id,
      email,
      password,
      role,
      createdAt,
      updatedAt,
      version
    };  
  } else {
    //this.localStorage.removeData('currentUser');
    return null;  
  }
}

}
