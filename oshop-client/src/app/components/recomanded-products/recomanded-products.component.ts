import {Component, Input, OnInit} from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {ProductNew} from "../../models/product-new.model";
import {ShoppingCart} from "../../models/shopping-cart";

@Component({
  selector: 'app-recomanded-products',
  templateUrl: './recomanded-products.component.html',
  styleUrls: ['./recomanded-products.component.css']
})
export class RecomandedProductsComponent implements OnInit {

  @Input() recomandedProducts:ProductNew[];
  @Input('shopping-cart') shoppingCart:ShoppingCart;

  constructor(public sliderConfig: NgbCarouselConfig) { }

  ngOnInit(): void {
    this.sliderConfig.interval = 20000;
    this.sliderConfig.keyboard = true;
    this.sliderConfig.pauseOnHover = true;
    this.sliderConfig.showNavigationIndicators = false;
    this.sliderConfig.showNavigationArrows = true;
  }

}
