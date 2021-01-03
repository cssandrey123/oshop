import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProductService} from 'src/app/services/product.service';

import {ActivatedRoute} from '@angular/router';
import {mergeMap, switchMap} from 'rxjs/operators';
import {ShoppingCartService} from 'src/app/services/shopping-cart.service';
import {forkJoin, Observable, of} from 'rxjs';
import {ShoppingCart} from 'src/app/models/shopping-cart';
import {ProductsHttpService} from "../../services/products-http.service";
import {ProductNew} from "../../models/product-new.model";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/order";
import {RestService} from "../../services/rest.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: ProductNew[] = [];
  filteredProducts: ProductNew[];
  recomandedProducts: ProductNew[][] = [];
  category: string;
  shoppingCart$: Observable<ShoppingCart>;

  constructor(public orderService: OrderService,
              public route: ActivatedRoute,
              public shoppingCartService: ShoppingCartService,
              public productsHttpService: ProductsHttpService,
              public restService: RestService) {
  }

  async ngOnInit() {
    this.shoppingCart$ = await this.shoppingCartService.getCart();
    this.populateProducts();

  }

  filter(category) {
    this.filteredProducts = this.products.filter(p => {
      p.category.toLowerCase() === category
    });
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
      this.products.filter(p => p.category.toLowerCase() === this.category) :
      this.products;
  }

  private createRecomandedProducts(products: ProductNew[], orders: Order[]): ProductNew[][] {
    let splitter: number = 4;
    let splitedProducts = [];
    let filteredProducts = [];

    if (!products || products.length == 0) {
      return [];
    }

    if (!orders || orders.length == 0) {
      filteredProducts = products.slice(0,12);
    }
    else {
      filteredProducts = this.buildRecomanded(products, orders);
    }

    for (let index = 0; index < filteredProducts.length; index += splitter) {
      //If is not a multiple of splitter, dont push last items, we don't want gaps
      if (filteredProducts[index + splitter]) {
        splitedProducts.push(filteredProducts.slice(index, index + splitter));
      }
    }

    return splitedProducts;
  }

  // Cea mai smechera functie de produse recomandate
  private buildRecomanded(products: ProductNew[], orders: Order[]): ProductNew[] {
    let filtered_products = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        let matchedProduct = products.find(product => product.title.trim() == item.productTitle.trim());
        // console.log('MATCHED PRODUCT', matchedProduct);
        let productCategory = matchedProduct ? matchedProduct.category : null;
        if (productCategory) {
          // console.log('PRODUCT CATEGORY', productCategory);
          products.forEach((product) => {
            if (product.category == productCategory && !this.existsInProducts(filtered_products,product)) {
              // console.log('PUSHING PRODUCT',product);
              filtered_products.push(product);
            }
          });
        }
      });
    });

    //  In case we don't have products taked from orders, we push some from all products
    if (filtered_products.length < 12) {
      let toAdd = 12 - filtered_products.length;
      products.forEach(product => {
        if(!this.existsInProducts(filtered_products,product) && toAdd > 0) {
          filtered_products.push(product);
          toAdd--;
        }
      })
    }

    return filtered_products;
  }

  private existsInProducts(products: ProductNew[], product: ProductNew) {
    let foundProduct = products.find(inListProduct => {
      return product.id === inListProduct.id
    });
    return foundProduct ? true : false;

  }

  private populateProducts() {
    this.productsHttpService.getAllProducts().pipe(
      switchMap(products => {
        this.products = products;
        if(this.restService.isAuthenticated()) {
          return this.orderService.getAllOrders();
        }
        else {
          return of(null);
        }
      }),
      switchMap((orders:Order[]) => {
        this.recomandedProducts = this.createRecomandedProducts(this.products, orders);
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        this.applyFilter();
      });
  }


}
