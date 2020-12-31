import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from './user.service';
import {switchMap, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AppUser} from '../models/app-user';
import {RestService} from "./rest.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private restService: RestService
  ) {
  }

  signInWithGoogle() {
   /* let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((google) => {
      this.userService.saveUser(google.user);
      this.router.navigate([returnUrl]);
    });*/
   this.restService.loginWithGoogle();
  }

  loginWithCredentials(username: string, password: string) {
    return this.restService.loginWithCredentials(username, password).pipe(
      tap(() => this.userService.getCurrentUser())
    );
  }

  registerWithCredentials(options: any): Observable<any> {
    //TODO MAKE THE CALL HERE
    return of(options);
  }

  logOut() {
    this.restService.logout();
  }

  getUser() {
    return this.userService.currentUser;
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
