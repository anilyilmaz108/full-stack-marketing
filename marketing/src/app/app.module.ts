import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from './modules/shared.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PrivateComponent } from './layouts/private/private.component';
import { FooterComponent } from './layouts/private/footer/footer.component';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgApexchartsModule } from "ng-apexcharts";
import { RouterModule } from '@angular/router';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

interface NgxSpinnerConfig {
  type?: string;
}

@NgModule({
  declarations: [
    AppComponent,
    PrivateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    SharedModule,
    NgApexchartsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: "tr"
    }),
    FooterComponent,
    AngularSvgIconModule.forRoot(),
    NgxSpinnerModule.forRoot({
      type:'line-scale-party'
    })
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
