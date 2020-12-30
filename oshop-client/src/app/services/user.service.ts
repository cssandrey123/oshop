import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase'
import { AppUser } from '../models/app-user';
import {Observable, of} from 'rxjs';
import {mergeMap, take} from "rxjs/operators";
import {RestService} from "./rest.service";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: User = null;

  constructor(private db:AngularFireDatabase, private restService: RestService) {
   // this.setUser();
  }

  setUser() {
    this.restService.read<User>('/user').subscribe(user => this.currentUser = user);
  }
   getCurrentUser() {
     return this.restService.read<User>('/user');
  }
  clearUser() {
    this.currentUser = null;
  }
  getUser(uid: string): Observable<AppUser>{
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }
}
