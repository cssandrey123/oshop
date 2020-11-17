import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase'
import { AppUser } from '../models/app-user';
import { Observable } from 'rxjs';
import {take} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService{

  constructor(private db:AngularFireDatabase) { }


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
