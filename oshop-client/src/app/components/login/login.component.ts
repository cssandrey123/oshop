import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../../models/user.model";
import {RestService} from "../../services/rest.service";
import {ActivatedRoute, Router} from "@angular/router";
import {map, mergeMap, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService,
              private fb: FormBuilder, private restService: RestService, private router: Router, private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {
  }

  get login_username_control() {
    return this.loginForm.get('username');
  }

  get login_password_control() {
    return this.loginForm.get('password');
  }

  get email_control() {
    return this.registerForm.get('email');
  }

  get register_username_control() {
    return this.registerForm.get('username');
  }

  get register_password_control() {
    return this.registerForm.get('password');
  }

  formState: string = 'Register';
  loginForm;
  registerForm;
  loading: boolean = false;
  state: string;
  code: string;
  result: string;
  userWithGoogleSignIn: User;

  private static encryptId(id: string) {
    let encrypted = '';
    for (let i = 0; i < id.length; i++) {
      encrypted += id[i].charCodeAt(0) + i;
    }
    return encrypted;
  }


  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]

    });
    this.route.queryParamMap.pipe(
      tap(params => {
        this.state = params.get('state');
        this.code = params.get('code');
        this.result = params.get('result');
      }),
      mergeMap(() => this.restService.fetchToken(this.code, this.state)), //get google oauth2 token
      mergeMap(() => this.http.get<any>('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {headers: this.restService.headers})), //get user info using token
      mergeMap(googleUser => this.getGoogleUser(googleUser)),
      mergeMap(user => this.http.get<boolean>('http://localhost:8080/existsUserByUsername/' + user.username)),
      mergeMap(bool => {
         if (bool === false) {
          return this.restService.register('/register', this.userWithGoogleSignIn);
        } else if (bool === true) {
           return of(this.userWithGoogleSignIn);
         }
      }),
      mergeMap(() => this.auth.loginWithCredentials(this.userWithGoogleSignIn.username, this.userWithGoogleSignIn.password)),
    ).subscribe(res => {
      this.router.navigate(['./']);
      this.userService.setUser();
    });

  }
  getGoogleUser(googleUserInfo): Observable<User> {
    const currentUserLoggedIn: User = {
      username: googleUserInfo.name,
      email: googleUserInfo.email,              // create user to send to server; password will be the user's encripted ID
      password: LoginComponent.encryptId(googleUserInfo.id),
    };
    this.userWithGoogleSignIn = currentUserLoggedIn;
    return of(currentUserLoggedIn);
  }

  loginWithGoogle() {
    this.restService.loginWithGoogle();
  }


  logIn() {

    const username = this.login_username_control.value;
    const password = this.login_password_control.value;
    this.loading = true;
    this.restService.loginWithCredentials(username, password).subscribe(result => {
      this.loading = false;
      console.log(result);
      this.router.navigate(['./']);
      this.userService.setUser();
    }, error => {
      this.loading = false;
      //  TODO handle login errors here
    });
  }

  register() {
    const user: User = {
      username: this.register_username_control.value,
      password: this.register_password_control.value,
      email: this.email_control.value
    };

    this.loading = true;
    this.restService.register('/register', user).pipe(
      mergeMap(() => this.auth.loginWithCredentials(user.username, user.password))
    ).subscribe(result => {
      this.loading = false;
      console.log(result);
      this.userService.setUser();
      this.router.navigate(['./']);
    }, error => {
      this.loading = false;
      //TODO HANDLE register errors here
    });
  }
}
