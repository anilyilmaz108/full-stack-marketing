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
import { FollowComponent } from './components/follow/follow.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicComponent } from './layouts/public/public.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

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
      {
        path: 'follow',
        component: FollowComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
    ],
  },
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
