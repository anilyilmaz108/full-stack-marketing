import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor() { }

  translate = inject(TranslateService);

  // App'de çağıracağız.
  initTranslate() {
    this.translate.setDefaultLang('tr');
    // Get Lang
    let lang = localStorage.getItem('lng');
    // Set Lang
      if (lang === 'en') {
        this.translate.use('en');
        localStorage.setItem('lng', 'en');
      } else {
        this.translate.use('tr');
        localStorage.setItem('lng', 'tr');
      }
  }

  changeLanguage(lang: string) {
    if (lang === 'en') {
      this.translate.use('en');
      localStorage.setItem('lng', 'en');
    } else {
      this.translate.use('tr');
      localStorage.setItem('lng', 'tr');
    }
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }




  // In component
  getTranlate(key: string) {
    return this.translate.instant(key);
  }
}


