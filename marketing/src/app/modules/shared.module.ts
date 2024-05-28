import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import { SvgIconComponent } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import { NgApexchartsModule } from "ng-apexcharts";
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    SvgIconComponent,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    NgApexchartsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    SvgIconComponent,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    NgApexchartsModule,
    RouterModule,
  ]
})
export class SharedModule { }
