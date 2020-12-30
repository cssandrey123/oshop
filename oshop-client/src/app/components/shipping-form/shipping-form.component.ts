import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import {Order, Shipping} from 'src/app/models/order';
import { Router } from '@angular/router';
import {UserService} from "../../services/user.service";
import {User} from "../../models/user.model";
import {RestService} from "../../services/rest.service";

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit {
  shipping: Shipping = {
    phoneNumber: '',
    city: '',
    address: '',
    name: ''
  };
  userId: string;
  currentUser: User = {
    username: '',
    password: '',
    email: ''
  };
  @Input('cart') cart: ShoppingCart;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private restService: RestService
    ) { }

  ngOnInit(): void {
  /*  if (this.restService.isAuthenticated()) {
      this.userService.getCurrentUser().then(user => this.currentUser = user);
    }*/
  }

  async saveOrder(shipping) {
    const order = new Order(this.currentUser.id, this.currentUser.username, this.shipping, this.cart);
   // const orderStatus = await this.orderService.placeOrder(order);
    this.restService.create<Order>('/place-order', order).subscribe(res => {
      this.router.navigate(['/order-success', res.username]);
    });
  }
}
