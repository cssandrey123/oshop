import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { AdminModule } from './modules/admin/admin.module';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './modules/shared/shared.module';
import { ShoppingModule } from './modules/shopping/shopping.module';
import { AuthGuardService } from './services/auth-guard.service';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RestService} from "./services/rest.service";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SharedModule,
    MatProgressSpinnerModule,
    AdminModule,
    ShoppingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    BrowserModule,
    MatSortModule,
    MatTableModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgbModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: ProductsComponent },
      { path: 'login', component: LoginComponent},
    ]),
    BrowserAnimationsModule,

  ],
  providers: [
    AuthGuardService, RestService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
