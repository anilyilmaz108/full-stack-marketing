import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  router = inject(Router);
  //state= inject(RouterStateSnapshot)
  authService = inject(AuthService);
  constructor() {
    //localStorage.removeItem('currentUser');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var currentUser = this.authService.userValues();
    //var localStorageUser = this.authService.localStorage.getData('currentUser');
    //console.log(localStorageUser);
    //debugger;
    if (currentUser) {
      // LoggedIn
      return true;
    }
    // Not LoggedIn
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //this.router.navigateByUrl('/login');
    return false;
  }
}
