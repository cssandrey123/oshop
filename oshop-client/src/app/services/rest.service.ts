import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {Observable, of} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {User} from "../models/user.model";

@Injectable()
export class RestService {
  private baseUrl = 'http://localhost:8080';
  private authorizationEndpoint = this.baseUrl + '/oauth2/authorization/google';
  private tokenEndpoint = this.baseUrl + '/login/oauth2/code/google';
  private client = '156766490498-ohu9etd14coubkgg29kohchte7417dug.apps.googleusercontent.com';
  private secret = 'KJdwtN_BpffChGG5b5FvEB2h';

  public constructor(private http: HttpClient, private cookieService: CookieService) {
  }

  private get basicAuth(): string {
    return 'Basic ' + btoa(this.client + ':' + this.secret);
  }

  public get authorizationHeader(): string {
    if (this.isAuthenticated()) {
      return 'Bearer ' + this.cookieService.get('accessToken');
    }
    return this.basicAuth;
  }

  private get loginHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: this.basicAuth
    });
  }
  private get registrationHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.basicAuth
    });
  }

  public get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.authorizationHeader
    });
  }
  public isAuthenticated(): boolean {
    return this.cookieService.check('accessToken');
  }

  public loginWithCredentials(username: string, password: string) {
    return this.http.post<any>(this.baseUrl + '/login-oshop', 'grant_type=password&username=' + username + '&password=' + password,
      {headers: this.loginHeaders}).pipe(
      tap(o => {
        this.cookieService.set('accessToken', o.access_token, o.expires_in);
      })
    );
  }
  public loginWithGoogle() {
    window.open(this.authorizationEndpoint, '_self');
  }
  public fetchToken(code, state): Observable<any> {
    if (code && state) {
      const client_id = '156766490498-ohu9etd14coubkgg29kohchte7417dug.apps.googleusercontent.com';
      const client_secret = 'KJdwtN_BpffChGG5b5FvEB2h';
      return this.http.post<any>('https://oauth2.googleapis.com/token?client_id=' + client_id + '&client_secret=' + client_secret + '&code=' + code + '&grant_type=authorization_code&redirect_uri=http://localhost:4200/login?result=success&access_type=offline', null).pipe(
        tap(o => {
          console.warn("here");
          this.cookieService.set('accessToken', o.access_token, o.expires_in);
        }));
    } else {
      return of(null);
    }
  }
  public logout(): Observable<any> {
    return of(this.cookieService.delete('accessToken'));
  }


  public read<T>(url: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + url, {headers: this.headers});
  }

  public create<T>(url: string, object: T): Observable<T> {
    console.warn(object);
    return this.http.post<T>(this.baseUrl + url, object, {headers: this.headers});
  }

  public update<T>(url: string, object: T): Observable<T> {
    return this.http.put<T>(this.baseUrl + url, object, {headers: this.headers});
  }

  public delete(url: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl + url, {headers: this.headers});
  }
  public register(url: string, object: User): Observable<User> {
    return this.http.post<User>(this.baseUrl + url, object, {headers: this.registrationHeaders});
  }

}
