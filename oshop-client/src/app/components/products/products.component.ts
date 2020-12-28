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
       return this.route.queryParamMap;
     }))
     .subscribe(params =>  { this.category = params.get('category');
                             this.applyFilter(); });
  }

}
