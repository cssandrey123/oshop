import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ShoppingCartService } from './shopping-cart.service';
import {Order, Shipping} from '../models/order';
import {RestService} from "./rest.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private shoppingCartService: ShoppingCartService, private restService: RestService) { }


  getAllOrders(): Observable<Order[]> {
    return this.restService.read<Order[]>('/orders');
  }

  editOrder(orderId: string): Observable<Order> {
    return this.restService.update<Order>('/update-order/' + orderId, null);
  }
}
