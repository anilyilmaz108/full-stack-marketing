import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  router = inject(Router);
  authService = inject(AuthService);
  constructor() {}

  canActivate() {
    var currentUser = this.authService.userValues();
    if (currentUser) {
      // LoggedIn
      return true;
    }
    // Not LoggedIn
    this.router.navigateByUrl('/login');
    return false;
  }
}
