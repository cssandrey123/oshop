import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ShoppingCartService } from './shopping-cart.service';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order) {
    let result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();

    return result;
  }

  getAllOrders() {
    return this.db.list<Order>('/orders').valueChanges();
  }

  getOrdersByUser(userId: string) {
    return this.db.list<Order>('/orders',ref => ref.orderByChild("userId").equalTo(userId)).valueChanges();
  }
}
