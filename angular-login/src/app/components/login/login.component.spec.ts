
// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { LoginComponent } from './login.component';
// import { By } from '@angular/platform-browser';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;
//   let httpMock: HttpTestingController;
//   let router: Router;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         LoginComponent, // extraa
//         ReactiveFormsModule,
//         HttpClientTestingModule,
//         RouterTestingModule.withRoutes([])
//       ],
//       //,declarations: [LoginComponent]
//     }).compileComponents();

//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     httpMock = TestBed.inject(HttpTestingController);
//     router = TestBed.inject(Router);
//     fixture.detectChanges();
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize the login form with email and password controls', () => {
//     expect(component.loginForm.contains('email')).toBeTrue();
//     expect(component.loginForm.contains('password')).toBeTrue();
//   });

//   it('should validate email as required', () => {
//     const emailControl = component.loginForm.get('email');
//     emailControl?.setValue('');
//     expect(emailControl?.hasError('required')).toBeTrue();
//   });

//   it('should validate email domain as @docquity.com', () => {
//     const emailControl = component.loginForm.get('email');
//     emailControl?.setValue('test@example.com');
//     expect(emailControl?.hasError('invalidEmailDomain')).toBeTrue();

//     emailControl?.setValue('test@docquity.com');
//     expect(emailControl?.hasError('invalidEmailDomain')).toBeFalsy();
//   });

//   it('should validate password as required and pattern match', () => {
//     const passwordControl = component.loginForm.get('password');
//     passwordControl?.setValue('');
//     expect(passwordControl?.hasError('required')).toBeTrue();

//     passwordControl?.setValue('short');
//     expect(passwordControl?.hasError('pattern')).toBeTrue();

//     passwordControl?.setValue('Valid123!');
//     expect(passwordControl?.hasError('pattern')).toBeFalsy();
//   });

//   it('should make a login request and navigate to dashboard on success', fakeAsync(() => {
//     spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

//     component.loginForm.setValue({
//       email: 'test@docquity.com',
//       password: 'Valid123!'
//     });

//     component.onLogin();

//     const req = httpMock.expectOne('http://localhost:3000/auth/login');
//     expect(req.request.method).toBe('POST');
//     req.flush({ access_token: 'dummy_token' });

//     tick();
//     expect(localStorage.getItem('access_token')).toBe('dummy_token');
//     expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
//   }));

//   it('should set emailExists error on form control if email already exists', fakeAsync(() => {
//     component.loginForm.setValue({
//       email: 'existing@docquity.com',
//       password: 'Valid123!'
//     });

//     component.onLogin();

//     const req = httpMock.expectOne('http://localhost:3000/auth/login');
//     req.flush({ field: 'email' }, { status: 409, statusText: 'Conflict' });

//     tick();
//     expect(component.loginForm.get('email')?.hasError('emailExists')).toBeTrue();
//   }));

//   it('should not submit the form if it is invalid', () => {
//     component.loginForm.setValue({
//       email: 'invalid_email',
//       password: ''
//     });

//     spyOn(component, 'onLogin').and.callThrough();
//     const loginButton = fixture.debugElement.query(By.css('button[type=submit]'));

//     loginButton.nativeElement.click();
//     expect(component.onLogin).toHaveBeenCalled();
//     expect(httpMock.match('http://localhost:3000/auth/login').length).toBe(0);
//   });

  

//   it('should display error messages for invalid email and password fields', () => {
//     const emailControl = component.loginForm.get('email');
//     const passwordControl = component.loginForm.get('password');
//     emailControl?.setValue('invalid_email');
//     passwordControl?.setValue('short');
//     fixture.detectChanges();

//     const emailError = fixture.debugElement.query(By.css('p.text-red-500'));
//     expect(emailError.nativeElement.textContent).toContain('Invalid email address.');
//   });
// });














import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should validate email as required', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
  });

  it('should validate email domain as @docquity.com', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('test@example.com');
    expect(emailControl?.hasError('invalidEmailDomain')).toBeTrue();

    emailControl?.setValue('test@docquity.com');
    expect(emailControl?.hasError('invalidEmailDomain')).toBeFalsy();
  });

  it('should validate password as required and pattern match', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();

    passwordControl?.setValue('short');
    expect(passwordControl?.hasError('pattern')).toBeTrue();

    passwordControl?.setValue('Valid@123!');
    expect(passwordControl?.hasError('pattern')).toBeFalsy();
  });

  it('should make a login request and navigate to dashboard on success', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.loginForm.setValue({
      email: 'test@docquity.com',
      password: 'Valid123!'
    });

    component.onLogin();

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ access_token: 'dummy_token' });

    tick();
    expect(localStorage.getItem('access_token')).toBe('dummy_token');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));
  it('should handle missing access_token in the response', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(false));
    expect(console.log('Navigation to Dashboard failed'));

    component.loginForm.setValue({
      email: 'test@docquity.com',
      password: 'Valid123!'
    });

    component.onLogin();

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ access_token: 'dummy_token' });

    tick();
    expect(localStorage.getItem('access_token'))
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));


  it('should set emailExists error on form control if email already exists', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'existing@docquity.com',
      password: 'Valid123!'
    });

    component.onLogin();

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    req.flush({ field: 'email' }, { status: 409, statusText: 'Conflict' });

    tick();
    expect(component.loginForm.get('email')?.hasError('emailExists')).toBeTrue();
  }));

  



  it('should set email not found  in the database on login if email doesnt exist' , fakeAsync(()=>{
    component.loginForm.setValue({
      email: 'Dhruv@docquity.com',
      password: 'Malik123!'
  });
  component.onLogin();
  const req = httpMock.expectOne('http://localhost:3000/auth/login'); 
  req.flush({ field: 'email' }, { status: 404, statusText: 'Not Found' });

  tick();
  expect(component.loginForm.get('email')?.hasError('emailNotFound')).toBeTrue();
}));



  // it('should handle unexpected HTTP errors gracefully', fakeAsync(() => {
  //   spyOn(console, 'error');

  //   component.loginForm.setValue({
  //     email: 'test@docquity.com',
  //     password: 'Valid123!'
  //   });

  //   component.onLogin();

  //   const req = httpMock.expectOne('http://localhost:3000/auth/login');
  //   req.flush({ message: 'Unexpected error' }, { status: 500, statusText: 'Server Error' });

  //   tick();
  //   expect(console.error).toHaveBeenCalledWith(jasmine.stringMatching(/Server Error/));
  // }));

  // it('should log form as invalid and prevent HTTP request on invalid form', () => {
  //   spyOn(console, 'log');

  //   component.loginForm.setValue({
  //     email: 'invalid_email',
  //     password: ''
  //   });

  //   component.onLogin();

  //   expect(console.log).toHaveBeenCalledWith('Form is invalid');
  //   expect(httpMock.match('http://localhost:3000/auth/login').length).toBe(0);
  // });


  it('should throw fill all details when details not entered properly', () => {
    spyOn(console, 'log');

    component.loginForm.setValue({
      email: '',
      password: ''
    });

    component.onLogin();

    expect(console.log).toHaveBeenCalledWith('Form is invalid');
  });

});
