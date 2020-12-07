import { Injectable } from '@angular/core';
import { CanActivate,  Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import {map, tap} from 'rxjs/operators'
import {RestService} from "./rest.service";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private auth: AuthService, private router: Router, private restService: RestService) { }

  canActivate(route, state: RouterStateSnapshot) {
    return of(this.restService.isAuthenticated()).pipe(
      tap(isAuth => console.warn(isAuth)),
      map(isAuthenticated => {
        if (isAuthenticated === true) {
          return true;
        } else {
          this.router.navigate(['/login'], { queryParams: {
            returnUrl: state.url
          } });
          return false;
        }
    }));
  }
}
