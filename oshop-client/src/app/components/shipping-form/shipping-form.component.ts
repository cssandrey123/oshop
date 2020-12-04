import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { Order } from 'src/app/models/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  userId:string;
  @Input('cart') cart: ShoppingCart

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.userId = user.uid;
    })
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  async saveOrder(shipping) {
    let order = new Order(this.userId,shipping,this.cart);

    let orderStatus = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', orderStatus.key])
  }
}
