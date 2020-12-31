import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Observable, Subscription } from 'rxjs';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orders$: Observable<Order[]> =  this.orderService.getAllOrders();
  subscription: Subscription;
  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {

  }

  calculateTotalPrice(items) {
    let price = 0;
    if (items) {
      items.forEach(item => price += item.quantity * item.totalPrice);
    }
    return price;
  }
  ngOnDestroy() {
  }
  toDate(date) {
    const dateString = new Date(date);
    return dateString;
  }
}
