import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase'
import { AppUser } from '../models/app-user';
import {Observable, of, timer} from 'rxjs';
import {mergeMap, switchMap, take, tap} from "rxjs/operators";
import {RestService} from "./rest.service";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User = null;
  public user$: Observable<User>;
  constructor(private db:AngularFireDatabase, private restService: RestService) {
    this.user$ = timer(0, 2000).pipe(
      mergeMap(() => of(this.restService.isAuthenticated()))).pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated === true) {
          return this.getCurrentUser();
        } else {
          return of(null);
        }
      }),
      tap(res => console.warn(res)),
    );
  }

  getCurrentUser() {
     return this.restService.read<User>('/user');
  }

  getUser(uid: string): Observable<AppUser>{
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }
}
