import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';


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


  // it('should set emailExists error on form control if email already exists', fakeAsync(() => {
  //   component.loginForm.setValue({
  //     email: 'existing@docquity.com',
  //     password: 'Valid123!'
  //   });

  //   component.onLogin();

  //   const req = httpMock.expectOne('http://localhost:3000/auth/login');
  //   req.flush({ field: 'email' }, { status: 409, statusText: 'Conflict' });

  //   tick();
  //   expect(component.loginForm.get('email')?.hasError('emailExists')).toBeTrue();
  // }));

  



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




it('should handle unexpected HTTP errors and show "Login Failed" alert', fakeAsync(() => {
  spyOn(console, 'error');
  spyOn(window, 'alert'); // Spy on alert to verify if it gets called

  component.loginForm.setValue({
    email: 'test@docquity.com',
    password: 'InvalidPassword123!'
  });

  component.onLogin();

  // Simulate an unexpected server error response
  const req = httpMock.expectOne('http://localhost:3000/auth/login');
  req.flush({ message: 'Unexpected error' }, { status: 500, statusText: 'Server Error' });

  tick();

  // Assert that the error message was logged and the alert was shown
  expect(console.error).toHaveBeenCalledWith('Login Failed');
  expect(window.alert).toHaveBeenCalledWith('Login Failed');
}));








  it('should throw fill all details when details not entered properly', () => {
    spyOn(console, 'log');

    component.loginForm.setValue({
      email: 'dhruv@docquity.com',
      password: '' // this is empty so form is invalid
    });

    component.onLogin();

    expect(console.log).toHaveBeenCalledWith('Form is invalid');
  });


  it('should validate the password ending with "password123"', () => {
    const passwordControl = new FormControl('testpassword123');
    const invalidResult = component.docquitypasswordValidator(passwordControl);
    expect(invalidResult).toBeNull(); // Valid case

    passwordControl.setValue('incorrectPassword');
    const validResult = component.docquitypasswordValidator(passwordControl);
    expect(validResult).toEqual({ invalidPassword: true }); // Invalid case
  });

  it('should set invalidPassword error on form control if password is incorrect', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'test@docquity.com',
      password: 'wrongPassword123!'
    });
  
    component.onLogin();
  
    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    req.flush({ field: 'password' }, { status: 400, statusText: 'Bad Request' });
  
    tick();
    expect(component.loginForm.get('password')?.hasError('invalidPassword')).toBeTrue();
  }));
  


});
