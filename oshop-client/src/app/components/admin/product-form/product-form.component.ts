import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import * as firebase from 'firebase'

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  testCat: Product[];
  product = <any>{};
  categories$;
  id;
  constructor(private catService: CategoryService
            ,private productService: ProductService
            ,private router: Router,
            private route: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    this.categories$=this.catService.getAll();
    this.id = this.route.snapshot.paramMap.get('id');

    if(this.id){
      this.productService.getProduct(this.id).pipe(
        take(1)
      ).subscribe(p => {
        this.product = p.data;
      })
    }
  }
  save(product) {
    if(this.id){
      this.productService.update(this.id,this.product);
    }
    else {
      this.productService.create(product).then(()=> {
      });
    }
    this.router.navigate(['/admin/products']);
  }
  delete(){
    if(confirm('Are you sure you want to delete this product?'))
      this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }
}
