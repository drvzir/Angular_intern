// import { NgIf } from '@angular/common';
// import { Component } from '@angular/core';
// import {
//   FormControl,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
//   AbstractControl,
//   ValidationErrors,
// } from '@angular/forms';
 
// @Component({
//   selector: 'app-login',
//   imports: [ReactiveFormsModule, NgIf],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent {
//   loginForm: FormGroup = new FormGroup({
//     email: new FormControl('', [
//       Validators.required,
//       Validators.email,
//       this.docquityEmailValidator,
//     ]),
//     password: new FormControl('', [
//       Validators.required,
//       Validators.pattern(
//         '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'
//       ),
//     ]),
//   });

//   // successMessage: string | null = null; // this i have added alone
//    // errorMessage: string | null = null;
 
//   docquityEmailValidator(control: AbstractControl): ValidationErrors | null {
//     const email = control.value;
//     return email && email.endsWith('@docquity.com')
//       ? null
//       : { invalidEmailDomain: true };
//   }
 
//   onLogin() {
//     if (this.loginForm.valid) {
//       console.log(this.loginForm.value);

//      // this.successMessage = 'User logged in successfully'; // yaha se
//      // this.loginForm.reset();
//      // setTimeout(() => {
//       //  this.successMessage = null;
//       //}, 3000); // yaha tk apna h

//     } else {
//       console.log('Form is invalid');
//     }
//   }
// }
 

import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
 
 
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone : true,// this one  1:05pm
})
export class LoginComponent {
  constructor(private http : HttpClient, private router : Router){}
 
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      this.docquityEmailValidator,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'
      ),
    ]),
  });
 
  docquityEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    return email && email.endsWith('@docquity.com')
      ? null
      : { invalidEmailDomain: true };
  }
 
  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      const formData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      
 
      this.http.post("http://localhost:3000/auth/login", formData).subscribe(
        (res: any) => {
          if(res.access_token){
            localStorage.setItem('access_token', res.access_token);
            console.log('Token Stored in the Local Storage')
          }
          console.log('Login Successful', res);
          alert('Login Successful');
          // this.loginForm.get('email')?.setErrors(null);
          this.router.navigate(['/dashboard']).then(success => {
            if (success) {
              console.log('Navigation to Dashboard successful');
            } else {
              console.error('Navigation to Dashboard failed');
            }
          });
        },
        (error) => {
          if (error.status === 409 && error.error.field === 'email') {
            this.loginForm.get('email')?.setErrors({ emailExists: true });
          }

        else if(error.status === 404){
         this.loginForm.get('email')?.setErrors({ emailNotFound: true });
         alert('Email Not Found');
        }

        }
      );
    } 
    else {
      console.log('Form is invalid');
    }
  }
}