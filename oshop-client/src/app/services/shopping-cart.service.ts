import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {switchMap, take, map, mergeMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import {ProductNew} from "../models/product-new.model";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

   getCart(): Observable<ShoppingCart> {
    return this.getOrCreateCartId().pipe(
      mergeMap(cartId => this.db.object<ShoppingCart>('/shopping-carts/' + cartId).valueChanges()),
      map(cart => new ShoppingCart(cart.items))
    );
    }

  async addToCart(product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product) {
    this.updateItem(product, -1);
  }

  clearCart() {
    this.getOrCreateCartId().subscribe(cartId => {
    this.db.object('/shopping-carts/' + cartId + '/items').remove(); });
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return of(this.db.object('/shopping-carts/' + cartId + '/items/' + productId));
  }


  private getOrCreateCartId(): Observable<string> {
    const cartId = localStorage.getItem('cartId');
    if (!cartId) {
      const result = this.create();
      localStorage.setItem('cartId', result.key);
      return of(result.key);
    } else {
      return of(cartId);
    }
  }

  private updateItem(product: ProductNew, change: number) {
    let item$;
    this.getOrCreateCartId().pipe(
      take(1),
      mergeMap(cartId => this.getItem(cartId, product.id)),
      tap(item => item$ = item),
      mergeMap(item => item.snapshotChanges()),
      take(1),
    ).subscribe((i: any) => {
      // item exists, and we update the quantity
      if (i.payload.val()) {
        const quantity = i.payload.val().quantity + change;

        // if quantity became 0, remove the item
        if (quantity === 0) {
          item$.remove();
        } else {
          item$.update({ quantity });
        }
      } else { // item doesn't exist, we create one
        // Necesarry redefinition of product beacause here we get a product from
        //  /products in db, not from shopping-cart/items
        const productForDb: ProductNew = {
          id: product.id,
          title: product.title,
          imageUrlInHex: product.imageUrlInHex,
          price: product.price,
          category: product.category
        };
        item$.set({ ...productForDb , quantity: 1 });
      }
    });
  }



}
