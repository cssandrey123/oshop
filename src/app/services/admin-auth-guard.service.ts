import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';

import { map, switchMap } from 'rxjs/operators'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate{

  constructor(private auth:AuthService, private userService:UserService) { }

  canActivate(): Observable<boolean>{
    return this.auth.getCurrentUser()
    .pipe(
      switchMap(user => this.userService.getUser(user.uid))
    )
    .pipe(
      map(appUser => {
        return appUser.isAdmin
      }
      )
    )
  }
}
