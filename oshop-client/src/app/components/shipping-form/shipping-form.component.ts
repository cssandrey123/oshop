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
import {ShoppingCartService} from "../../services/shopping-cart.service";

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
  @Input('cart') cart: ShoppingCart;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private restService: RestService,
    private shoppingCartService: ShoppingCartService
    ) { }

  ngOnInit(): void {
  }

  async saveOrder(shipping) {
    const order = new Order();
    this.userService.getCurrentUser().subscribe(user => {
      order.createOrder(user.id, user.username, this.shipping, this.cart);
      this.restService.create<Order>('/place-order', order).subscribe(res => {
        this.shoppingCartService.clearCart();
        this.router.navigate(['./my/orders']);
      });
    });
  }
}
