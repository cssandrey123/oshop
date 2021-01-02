import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Observable } from 'rxjs';
import { Order , Shipping, Item} from 'src/app/models/order';
import {tap} from "rxjs/operators";

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders$: Observable<Order[]>;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orders$ = this.orderService.getAllOrders().pipe(
      tap(orders => orders.forEach(order => order.expectedDate = this.getExpectedDeliveryDate(order.datePlaced).toDateString()))
    );
  }

  calculateTotalPrice(items) {
    let price = 0;
    if (items) {
      items.forEach(item => price += item.quantity * item.totalPrice);
    }
    return price;
  }
  toDate(date) {
   return new Date(date);
  }
  getExpectedDeliveryDate(date) {
    const days = Math.random() * 3 + 1;
    const expected = new Date(date);
    expected.setDate(expected.getDate() + days);
    return expected;
  }

  getNextStatusString(status: string) {
    if (status === 'PROCESSED') {
      return 'DELIVERING';
    } else if (status === 'DELIVERING'){
      return 'DELIVERED';
    } else {
      return status;
    }
  }

  editOrder(id: string) {
    console.warn(id);
    this.orderService.editOrder(id).subscribe(res => {
      this.orders$ = this.orderService.getAllOrders().pipe(
        tap(orders => orders.forEach(order => order.expectedDate = this.getExpectedDeliveryDate(order.datePlaced).toDateString()))
      );
    });
  }
}
