import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  product:Product;
  products:Product[];
  constructor(private db:AngularFireDatabase) { }

  create(product) {
    return this.db.list('/products').push(product);
  }
  update(productId, product) {
    return this.db.object('/products/' + productId).update(product);
  }
  getTest(){
    firebase.database().ref('products').once('value')
    .then(categories => {
      this.products=[];
      categories.forEach(el => {
        let aux:Product = el.val();
        let key = el.key;
        let obj = {};
        obj[key]=aux;
        // this.products.push(obj);
      })
    })
  }
  getAll(){
    return this.db.list('/products').snapshotChanges()
    .pipe(map( action => action
      .map(a => {
        const key = a.payload.key;
        const data = a.payload.val();
          return  {key, data};
      })));
  }
  getProduct(productId){

    return this.db.object('/products/' + productId).snapshotChanges()
    .pipe(
      map(product => {
        const key = product.key;
        const data = product.payload.val();
        return {key,data}
      })
    )
  }
  delete(productId) {
    return this.db.object('/products/'+productId).remove();
  }
}
