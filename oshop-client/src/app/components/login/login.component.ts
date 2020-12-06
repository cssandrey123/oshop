import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/services/auth.service';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formState: string = 'Register';
  loginForm;
  registerForm;
  loading: boolean = false;

  constructor(private auth: AuthService,
              private fb: FormBuilder) {
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
  }


  loginWithGoogle() {
    this.auth.signInWithGoogle();
  }


  logIn() {
    let options = {
      'username': this.login_username_control.value,
      'password': this.login_password_control.value
    }

    this.loading = true;
    this.auth.loginWithCredentials(options).subscribe(result => {
      this.loading = false;
      console.log(result);
    }, error => {
      this.loading = false;
      //  TODO handle login errors here
    });
  }

  register() {
    let options = {
      'username': this.register_password_control.value,
      'password': this.register_password_control.value,
      'email': this.email_control.value
    }

    this.loading = true;
    this.auth.registerWithCredentials(options).subscribe(result => {
      this.loading = false;
      console.log(result);
    }, error => {
      this.loading = false;
      //TODO HANDLE register errors here
    })
  }
}
