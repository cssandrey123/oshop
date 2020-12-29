import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Subscription } from 'rxjs';
import {Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Product } from 'src/app/models/product';
import {ProductNew} from "../../../models/product-new.model";
import {ProductsHttpService} from "../../../services/products-http.service";

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: ProductNew[] = [];
  filteredProducts: ProductNew[];
  subscription: Subscription;


  constructor(private productHttpService: ProductsHttpService) {
    this.subscription = this.productHttpService.getAllProducts().subscribe(products => {
      this.filteredProducts = this.products = products;
    });
   }

  ngOnInit(): void {
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  filter(query:string) {
    this.filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;
  }


}
