import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from './user.service';
import {switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AppUser} from '../models/app-user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService
  ) {
  }

  signInWithGoogle() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((google) => {
      this.userService.saveUser(google.user);
      this.router.navigate([returnUrl]);
    });
  }

  loginWithCredentials(options: any): Observable<any> {
    //TODO MAKE THE CALL HERE
    return of(options);
  }

  registerWithCredentials(options: any): Observable<any> {
    //TODO MAKE THE CALL HERE
    return of(options);
  }

  logOut() {
    this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }

  getCurrentUserFromDB(): Observable<AppUser> {
    return this.getCurrentUser()
      .pipe(
        switchMap(user => {
          if (user)
            return this.userService.getUser(user.uid);
          else
            return of(null);
        })
      )
  }
}
