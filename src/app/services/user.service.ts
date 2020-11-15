import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase'
import { AppUser } from '../models/app-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService{

  constructor(private db:AngularFireDatabase) { }

  
  saveUser(user: firebase.User) {
    // Setting admin for DevPlant
    let isAdmin = false;
    if(
      user.email === "dinu@devplant.ro" ||
      user.email === "anna@devplant.ro" ||
      user.email === "timo@devplant.ro" 
    )
      isAdmin = true;
    
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email,
      isAdmin
    })
  }

  getUser(uid: string): Observable<AppUser>{
    return this.db.object<AppUser>('/users/' + uid).valueChanges();
  }
}
