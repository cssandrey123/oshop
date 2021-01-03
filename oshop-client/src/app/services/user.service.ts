import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase'
import { AppUser } from '../models/app-user';
import {BehaviorSubject, Observable, of, timer} from 'rxjs';
import {mergeMap, switchMap, take, tap} from "rxjs/operators";
import {RestService} from "./rest.service";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User = null;
  // public user$: Observable<User>;
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private db:AngularFireDatabase, private restService: RestService) {
    timer(0, 2000).pipe(
      mergeMap(() => of(this.restService.isAuthenticated()))).pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated === true) {
           return this.getCurrentUser();
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      //object vs object
      if(user !== null && this.currentUser !== null && user.id !== this.currentUser.id) {
        this.user$.next(user);
        return;
      }
      //null vs object
      if(user !== this.currentUser) {
        this.user$.next(user);
      }
    });
  }

  getCurrentUser() {
     return this.restService.read<User>('/user');
  }

  getUser(uid: string): Observable<AppUser>{
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }

}
