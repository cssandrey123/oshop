import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase'
import { AppUser } from '../models/app-user';
import { Observable } from 'rxjs';
import {take} from "rxjs/operators";
import {RestService} from "./rest.service";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User = null;

  constructor(private db:AngularFireDatabase, private restService: RestService) { }

  setUser(): void {
    this.restService.read<User>('/user').subscribe(user => this.currentUser = user);
  }
  getCurrentUser(): User {
    return this.currentUser;
  }
  clearUser() {
    this.currentUser = null;
  }

  saveUser(user: firebase.User) {
    this.getUser(user.uid).pipe(
      take(1)
    ).subscribe((existingUser:AppUser) => {
      if(!existingUser) {
        this.db.object('/users/' + user.uid).update({
          name: user.displayName,
          email: user.email,
          isAdmin: false
        });
      }
    });


  }

  getUser(uid: string): Observable<AppUser>{
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }
}
