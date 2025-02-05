import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, SignupComponent],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.userForm.valid).toBeFalsy();
  });

  it('should validate email field correctly', () => {
    const emailControl = component.userForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();

    emailControl.setValue('user@docquity.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should validate password match correctly', () => {
    component.userForm.controls['password'].setValue('Valid@123');
    component.userForm.controls['confirmPassword'].setValue('Valid@123');
    expect(component.userForm.errors).toBeNull();

    component.userForm.controls['confirmPassword'].setValue('Mismatch@123');
    expect(component.userForm.errors).toEqual({ passwordsMismatch: true });
  });

  it('should call API and handle success on valid form submission', () => {
    spyOn(httpClient, 'post').and.returnValue(of({ message: 'User registered' }));

    component.userForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@docquity.com',
      password: 'Valid@123',
      confirmPassword: 'Valid@123',
      mobile: '9876543210',
      country: '+91',
    });

    component.onUserSave();
    expect(httpClient.post).toHaveBeenCalledWith('http://localhost:3000/auth/signup', jasmine.any(Object));
    expect(component.userForm.valid).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle existing user error on form submission', () => {
    spyOn(httpClient, 'post').and.returnValue(throwError({ status: 409, error: { field: 'email' } }));

    component.userForm.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      userName: 'janedoe',
      email: 'jane@docquity.com',
      password: 'Valid@123',
      confirmPassword: 'Valid@123',
      mobile: '9876543210',
      country: '+91',
    });

    component.onUserSave();
    expect(component.userForm.get('email')?.hasError('emailExists')).toBeTrue();
  });

  it('should handle unexpected errors on form submission', () => {
    spyOn(httpClient, 'post').and.returnValue(throwError({ status: 500 }));
  
    component.userForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'testuser@docquity.com',
      password: 'Valid@123',
      confirmPassword: 'Valid@123',
      mobile: '9876543210',
      country: '+91',
    });
  
    component.onUserSave();
    fixture.detectChanges();
  
    expect(component.serverError).toBe('An unexpected error occurred. Please try again later.');
  });
  

 

  it('should handle email conflict error on form submission', (done) => {
    spyOn(httpClient, 'post').and.returnValue(
      throwError({ status: 409, error: { field: 'email', message: 'Email already exists.' } })
    );
  
    component.userForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      userName: 'testuser',
      email: 'existing@docquity.com',
      password: 'Valid@123',
      confirmPassword: 'Valid@123',
      mobile: '9876543210',
      country: '+91',
    });
  
    component.onUserSave();
  
    
    setTimeout(() => {
      const emailErrors = component.userForm.get('email')?.errors;
      expect(emailErrors).toBeTruthy();
      expect(emailErrors?.['emailExists']).toBeTrue();
      done(); 
    });
  });
  
});



// wrong aand extra code start from here....................................................................................................................

  // it('should handle unexpected errors on form submission', () => {
  //   spyOn(httpClient, 'post').and.returnValue(throwError({ status: 500 }));

  //   component.onUserSave();
  //   expect(component.serverError).toBe('An unexpected error occurred. Please try again later.');
  //   expect(component.successMessage).toBeNull();
  // });



   // it('should handle email conflict error on form submission', () => {
  //   spyOn(httpClient, 'post').and.returnValue(throwError({ status: 409, error: { field: 'email', message: 'Email already exists.' } }));
  
  //   component.userForm.setValue({
  //     firstName: 'Test',
  //     lastName: 'User',
  //     userName: 'testuser',
  //     email: 'existing@docquity.com',
  //     password: 'Valid@123',
  //     confirmPassword: 'Valid@123',
  //     mobile: '9876543210',
  //     country: '+91',
  //   });
  
  //   component.onUserSave();
  
  //   // Trigger change detection and assert the expected error
  //   fixture.whenStable().then(() => {
  //     fixture.detectChanges();
  //     const emailErrors = component.userForm.get('email')?.errors;
  //     expect(emailErrors).toBeTruthy();
  //     expect(emailErrors?.['emailExists']).toBeTrue();
  //   });
  // });