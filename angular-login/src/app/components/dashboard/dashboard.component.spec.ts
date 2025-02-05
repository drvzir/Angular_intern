// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { DashboardComponent } from './dashboard.component';

// describe('DashboardComponent', () => {
//   let component: DashboardComponent;
//   let fixture: ComponentFixture<DashboardComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [DashboardComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(DashboardComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpClient: HttpClient;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DashboardComponent], // Standalone component
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if no token is found', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null); // Mock missing token
    spyOn(component, 'fetchStudentData').and.callThrough();

    component.fetchStudentData();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.studentList.length).toBe(0);
  });

  it('should fetch student list successfully', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    spyOn(httpClient, 'get').and.returnValue(of([{ id: 1, name: 'John Doe' }]));

    component.fetchStudentData();

    expect(component.studentList.length).toBe(1);
    expect(component.studentList[0].name).toBe('John Doe');
  });

  it('should handle API error and navigate to login', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    spyOn(httpClient, 'get').and.returnValue(throwError({ status: 401 }));

    component.fetchStudentData();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // it('should clear local storage and navigate to login on logout', () => {
  //   spyOn(localStorage, 'clear').and.callThrough();
    
  //   component.logout();

  //   expect(localStorage.clear).toHaveBeenCalled();
  //   expect(router.navigate).toHaveBeenCalledWith(['']);
  // });


  it('should clear local storage and navigate to login on logout', () => {
    spyOn(localStorage, 'removeItem').and.callThrough();
    
    component.logout();
  
    expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
  
});
