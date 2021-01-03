import {AfterViewInit, Component, OnInit} from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { AppUser } from 'src/app/models/app-user';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import {Observable, of, timer} from 'rxjs';
import { ShoppingCart } from 'src/app/models/shopping-cart';
import {RestService} from "../../services/rest.service";
import {User} from "../../models/user.model";
import {UserService} from "../../services/user.service";
import {map, mergeMap, switchMap, tap} from "rxjs/operators";

@Component({
  selector: 'app-bg-navbar',
  templateUrl: './bg-navbar.component.html',
  styleUrls: ['./bg-navbar.component.css']
})
export class BgNavbarComponent implements OnInit {
  public isMenuCollapsed = true;
  cart$: Observable<ShoppingCart>;
  currentUser: User;
  user$: Observable<User> = this.userService.user$;
  constructor(private auth: AuthService, private shoppingCartService: ShoppingCartService, private restService: RestService, private userService: UserService) { }


  ngOnInit()  {
    // Displaying the numbers of products from shopping cart in navbar
    this.cart$ = this.shoppingCartService.getCart();
    this.user$.subscribe(user => this.currentUser = user);
  }


  async isCurrentUserPresent() {
   return this.userService.currentUser !== null;
  }


  isAuthenticated() {
   return this.restService.isAuthenticated();
  }

  logOut() {
    this.auth.logOut();
  }

}
