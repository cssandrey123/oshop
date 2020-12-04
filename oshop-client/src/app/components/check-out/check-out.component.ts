import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit {
   
  cart$: Observable <ShoppingCart>;
  cartSubscription:Subscription;
  
  constructor(
    private shoppingCartService: ShoppingCartService,
    ) { }

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
  }
  
}
