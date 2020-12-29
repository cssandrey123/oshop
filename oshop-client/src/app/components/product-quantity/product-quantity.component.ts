import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import {ProductNew} from "../../models/product-new.model";


@Component({
  selector: 'app-product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent implements OnInit {

  @Input() product: ProductNew;
  @Input('shopping-cart') shoppingCart;
  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
  }

  addToCart() {
    this.shoppingCartService.addToCart(this.product);
  }


  removeFromCart(){
    this.shoppingCartService.removeFromCart(this.product);
  }

}
