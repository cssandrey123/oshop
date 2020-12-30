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
  orders$: Observable<Order[]>;
  subscription: Subscription;
  constructor(private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.authService.getCurrentUser().subscribe(user => {
      this.orders$ = this.orderService.getOrdersByUser(user.uid);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
