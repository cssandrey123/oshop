import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import {ProductsHttpService} from "../../services/products-http.service";
import {ProductNew} from "../../models/product-new.model";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  products: ProductNew[]=[];
  filteredProducts: ProductNew[];
  recomandedProducts: ProductNew[][] = [];
  category: string;
  shoppingCart$: Observable<ShoppingCart>;

  constructor(public productService: ProductService,
              public route: ActivatedRoute,
              public shoppingCartService: ShoppingCartService,
              public productsHttpService: ProductsHttpService) { }

  async ngOnInit() {
    this.shoppingCart$ = await this.shoppingCartService.getCart();
    this.populateProducts();

  }
  filter(category) {
    this.filteredProducts = this.products.filter(p => {
      p.category.toLowerCase() === category
    });
  }

  private applyFilter(){
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.category.toLowerCase() === this.category) :
    this.products;
  }

  private createRecomandedProducts(products: ProductNew[]):ProductNew[][]  {
    let splitter: number = 4;
    let splitedProducts = [];

    if(!products || products.length == 0) {
      return [];
    }

    for(let index = 0; index < products.length; index += splitter) {
      //If is not a multiple of splitter, dont push last items, we don't want gaps
      if(products[index+splitter]) {
        splitedProducts.push(products.slice(index, index+splitter));

      }
    }

    return splitedProducts;
  }

  private populateProducts(){
   /* this.productService.getAll().pipe(
      switchMap(products => {
        this.products= products;
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');

        // Filter products
        this.applyFilter();
      });*/
   this.productsHttpService.getAllProducts().pipe(
     switchMap(products => {
       this.products = products;
       this.recomandedProducts = this.createRecomandedProducts(products);
       return this.route.queryParamMap;
     }))
     .subscribe(params =>  { this.category = params.get('category');
                             this.applyFilter(); });
  }

}
