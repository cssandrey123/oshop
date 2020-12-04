import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders$: Observable<Order[]>;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orders$ = this.orderService.getAllOrders();
  }

  calculateTotalPrice(items) {
    let price = 0;
    if (items) {
      items.forEach(item => price += item.quantity * item.totalPrice);
    }
    return price;
  }
}
