import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './layouts/private/private.component';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { AuthGuard } from './helpers/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { ShareComponent } from './components/share/share.component';
import { NewsComponent } from './components/news/news.component';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'portfolio',
        component: PortfolioComponent,
      },
      {
        path: 'share',
        component: ShareComponent,
      },
      {
        path: 'news',
        component: NewsComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
