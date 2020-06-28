import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthApiService } from '../service/auth-api.service';
import { CustomvalidationService } from '../service/customvalidation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  singupForm: FormGroup;

  // boolean
  submitted = false;
  isLoading = false;
  error: string = null;
  constructor(
    private fb: FormBuilder,
    private authService: AuthApiService,
    private customValidator: CustomvalidationService,
    private router: Router) { }

  ngOnInit() {
    this.singupForm = this.fb.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        cnfpassword: ['', Validators.required]
      },
      {
        validator: this.customValidator.MatchPassword('password', 'cnfpassword'),
      }
    );
  }

  get registerFormControl() {
    return this.singupForm.controls;
  }
  onSubmit(form) {
    this.submitted = true;
    if (this.singupForm.invalid) {
      return alert('Enter Proper Data');
    } else if (this.singupForm.valid) {
      const email = form.value.email;
      const password = form.value.password;
      this.isLoading = true;
      this.authService.signup(email, password).subscribe(
        (response: any) => {
          console.log(response);
          this.isLoading = false;
        },
        customError => {
          console.log(customError);
          this.error = customError;
          this.isLoading = false;
        },
        () => {
          form.reset();
          this.isLoading = false;
          this.router.navigate(['/']);
        }
      );

    } else {
      alert('Enter Proper Data');
    }
  }
}
