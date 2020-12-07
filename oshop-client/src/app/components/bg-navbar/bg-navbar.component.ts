import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/app-user';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import {Observable, of} from 'rxjs';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import {RestService} from "../../services/rest.service";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-bg-navbar',
  templateUrl: './bg-navbar.component.html',
  styleUrls: ['./bg-navbar.component.css']
})
export class BgNavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  cart$: Observable<ShoppingCart>;
  constructor(private auth: AuthService, private shoppingCartService: ShoppingCartService, private restService: RestService, private userService: UserService) { }

  ngOnInit()  {
    // Displaying the numbers of products from shopping cart in navbar
    this.cart$ = this.shoppingCartService.getCart();
  }
  isCurrentUserPresent() {
    return this.userService.currentUser !== null;
  }
  getCurrentUser(): User {
    return this.userService.currentUser;
  }

  isAuthenticated() {
   return this.restService.isAuthenticated();
  }

  logOut() {
    this.auth.logOut();
  }

}
