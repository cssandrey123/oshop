import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/app-user';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'src/app/models/shopping-cart';

@Component({
  selector: 'app-bg-navbar',
  templateUrl: './bg-navbar.component.html',
  styleUrls: ['./bg-navbar.component.css']
})
export class BgNavbarComponent implements OnInit {
  user$;
  public isMenuCollapsed = true;
  cart$: Observable<ShoppingCart>

  constructor(private auth:AuthService, private shoppingCartService: ShoppingCartService) { }

  async ngOnInit()  {
    this.auth.getCurrentUserFromDB().subscribe((result:AppUser) => {
      this.user$ = result;
    });

    // Displaying the numbers of products from shopping cart in navbar
    this.cart$ = await this.shoppingCartService.getCart();
  }

  logOut(){
    this.auth.logOut();
  }

}
