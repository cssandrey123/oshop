import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from 'src/app/components/products/products.component';
import { ShoppingCartComponent } from 'src/app/components/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from 'src/app/components/check-out/check-out.component';
import { OrderSuccessComponent } from 'src/app/components/order-success/order-success.component';
import { MyOrdersComponent } from 'src/app/components/my-orders/my-orders.component';
import { ProductFilterComponent } from 'src/app/components/products/product-filter/product-filter.component';
import { ShoppingCartSummaryComponent } from 'src/app/components/shopping-cart-summary/shopping-cart-summary.component';
import { ShippingFormComponent } from 'src/app/components/shipping-form/shipping-form.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    ProductFilterComponent,
    ShoppingCartSummaryComponent,
    ShippingFormComponent,
  ],
  imports: [
    MatProgressSpinnerModule,
    MatInputModule, 
    BrowserModule,
    MatSortModule,
    MatTableModule,
    SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'products', component: ProductsComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent },
      { path: 'check-out', component: CheckOutComponent,canActivate: [AuthGuardService] },
      { path: 'my/orders', component: MyOrdersComponent,canActivate: [AuthGuardService] },
      { path: 'order-success/:id', component: OrderSuccessComponent,canActivate: [AuthGuardService] },
    ])
  ],
  exports: [

  ],

})
export class ShoppingModule { }
