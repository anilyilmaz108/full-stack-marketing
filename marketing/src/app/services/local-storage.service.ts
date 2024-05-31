import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  key = "currentUser";

  constructor() { }

  public saveData(key: any, value: any) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: any) {
    let data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }
  public removeData(key: any) {
    localStorage.removeItem(key);
  }

  private encrypt(txt: any): any {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: any) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}