import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'src/app/models/shopping-cart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{
  products: any[]=[];
  filteredProducts: any[];
  category: string;
  shoppingCart$: Observable<ShoppingCart>;
  
  constructor(public productService: ProductService, 
              public route: ActivatedRoute,
              public shoppingCartService: ShoppingCartService) { }

  async ngOnInit() {
    this.shoppingCart$ = await this.shoppingCartService.getCart();
    this.populateProducts(); 
    
  }
  filter(category){
    this.filteredProducts = this.products.filter(p => {
      p.data.category === category
    })
  }

  private applyFilter(){
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.data.category === this.category) :
    this.products;
  }

  private populateProducts(){
    this.productService.getAll().pipe(
      switchMap(products => {
        this.products= products;
        return this.route.queryParamMap;
      }))
      .subscribe(params => {
        this.category = params.get('category');
        
        // Filter products
        this.applyFilter();
      });
  }

}
