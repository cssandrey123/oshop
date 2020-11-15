import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgNavbarComponent } from 'src/app/components/bg-navbar/bg-navbar.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    BgNavbarComponent,
    HomeComponent,
    LoginComponent,
    
  ],
  imports: [
    MatIconModule,
    NgbModule,
    CommonModule,
    RouterModule.forChild([])
  ],
  exports: [
    BgNavbarComponent
  ]
})
export class CoreModule { }
