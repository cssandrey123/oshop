import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { switchMap, take, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  
  constructor(private db: AngularFireDatabase) { }

  async getCart():Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object<ShoppingCart>('/shopping-carts/' + cartId).valueChanges().pipe(
      map( cart => {
        return new ShoppingCart(cart.items)
      })
      )
    }

  async addToCart(product) {
    this.updateItem(product,1);
  }
  
  async removeFromCart(product) {
    this.updateItem(product,-1);
  }
  
  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    })
  }

  private getItem(cartId:string, productId:string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }


  private async getOrCreateCartId(): Promise <string> {
    let cartId = localStorage.getItem('cartId');
    if(!cartId) {
      let result = await this.create();
      localStorage.setItem('cartId',result.key);
      return result.key;
    }
    else {
      return cartId;
    }
  }

  private async updateItem(product:any, change: number) {
    
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId,product.key);
    
    item$.snapshotChanges().pipe(take(1)).subscribe((item :any)=>{
      // item exists, and we update the quantity
      if(item.payload.val()){
        let quantity = item.payload.val().quantity + change;
        
        // if quantity became 0, remove the item
        if(quantity === 0)
          item$.remove();
        // otherwise, update quantity
        else
          item$.update({ quantity })
      }
      // item don't exist, and we create one
      else{
        // Necesarry redefinition of product beacause here we get a product from
        //  /products in db, not from shopping-cart/items 
        let productForDb = {
          title: product.data.title,
          imageUrl: product.data.imageUrl,
          price: product.data.price,
        }
        item$.set({ ...productForDb , quantity:1 });
      }
      
    })
  }



}
