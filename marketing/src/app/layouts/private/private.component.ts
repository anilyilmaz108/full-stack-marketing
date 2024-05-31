import { Component, OnInit, inject } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
import { TranslationService } from 'src/app/services/translation.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { initFlowbite } from 'flowbite';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrl: './private.component.css'
})
export class PrivateComponent implements OnInit{

  ngOnInit(): void {
    initFlowbite();
  }

  isDark = false;
  isDarkTheme!: Observable<boolean>;

  constructor(){
    this.isDarkTheme = this.themeService.isDarkTheme;
  }
  tranlationService = inject(TranslationService);
  router = inject(Router);
  themeService = inject(ThemeService);
  authService = inject(AuthService);

  lang: string = "TR";

  

  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeService.setDarkTheme(this.isDark);
  }

  changeLang(val: string) {
    this.tranlationService.changeLanguage(val);
    this.lang = val;
  }

  logout(){
    this.authService.logout();
  }

}
