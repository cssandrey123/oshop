import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';

import {map, mergeMap, switchMap} from 'rxjs/operators'
import {Observable, of} from 'rxjs';
import {RestService} from "./rest.service";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {

  constructor(private restService: RestService, private userService: UserService) { }

  canActivate(): Observable<boolean> {
    return of(this.restService.isAuthenticated()).pipe(
      map(isAuthenticated => {
        return isAuthenticated === true;
      }),
      mergeMap(bool => {
        if (bool === true) {
          return this.userService.getCurrentUser();
        } else {
          return null;
        }
      }),
      map(user => user !== null && user.role === 'ADMIN'));
  }
}
