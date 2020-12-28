import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import {ProductNew} from "../../models/product-new.model";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product: ProductNew;
  @Input() showActions = true;
  @Input('shopping-cart') shoppingCart :ShoppingCart;
  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
  }

  addToCart() {
    this.shoppingCartService.addToCart(this.product);
  }

  fromHexToURL(hexStr) {
    const hex = hexStr.toString();
    let str = '';
    for (let i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

}
