import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import * as firebase from 'firebase'
import {ProductNew} from "../../../models/product-new.model";
import {ProductsHttpService} from "../../../services/products-http.service";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  testCat: Product[];
  product: ProductNew = {title: '', category: '', price: 0, imageUrlInHex: ''};
  newProduct: ProductNew  = {title: '', category: '', price: 0, imageUrlInHex: ''};
  categories$;
  id;
  actualURL: string;
  constructor(private catService: CategoryService,
              private productService: ProductsHttpService,
              private router: Router,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.categories$ = this.catService.getAll();
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.productService.getProduct(this.id).subscribe(p => {
        this.product = {...p};
        this.newProduct = {...p};
        this.actualURL = this.fromHexToURL(p.imageUrlInHex);
      });
    }
  }
  save(product) {
    if (this.id) {
      this.newProduct.imageUrlInHex = this.fromURLToHex(this.actualURL);
      this.productService.updateProduct(this.newProduct).subscribe(
        res => {
          this.router.navigate(['/admin/products']);
        });
    } else {
      this.newProduct.imageUrlInHex = this.fromURLToHex(this.actualURL);
      this.productService.createProduct(this.newProduct).subscribe(
        res => {
            this.router.navigate(['/admin/products']);
        });
      }
    }

  delete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.id).subscribe(res => {
        this.router.navigate(['/admin/products']);
      });
    }
  }
  fromHexToURL(hexStr) {
    const hex = hexStr.toString();
    let str = '';
    for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }
  fromURLToHex(url) {

    let result = '';
    for (let i = 0; i < url.length; i++) {
      const hex = url.charCodeAt(i).toString(16);
      result += hex;
    }
    return result;
  }
  revert() {
    this.newProduct.imageUrlInHex = this.product.imageUrlInHex;
    this.newProduct.price = this.product.price;
    this.newProduct.title = this.product.title;
    this.newProduct.category = this.product.category;
  }
}
