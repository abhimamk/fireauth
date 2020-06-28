import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { AuthApiService, AuthRequestData } from '../service/auth-api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  // boolean
  submitted = false;
  isLoading = false;
  error: string = null;
  constructor(private fb: FormBuilder, private authService: AuthApiService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get registerFormControl() {
    return this.loginForm.controls;
  }
  onSubmit(form) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return false;
    } else if (this.loginForm.valid) {
      const email = form.value.email;
      const password = form.value.password;
      // let authObservable: Observable<AuthRequestData>;
      this.isLoading = true;
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log(response);
        },
        customError => {
          console.log(customError);
          this.error = customError;
          this.isLoading = false;
        },
        () => {
          form.reset();
          this.isLoading = false;
          this.router.navigate(['/home']);
        }
      );
    }

  }
}
