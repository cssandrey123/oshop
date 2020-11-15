import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Subscription } from 'rxjs';
import {Sort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit,OnDestroy {
  products: any[]=[];
  filteredProducts: any[];
  subscription:Subscription;

  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll().subscribe(products => {
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
      this.products.filter(p => p.data.title.toLowerCase().includes(query.toLowerCase())) : 
      this.products;
  }
  

}
