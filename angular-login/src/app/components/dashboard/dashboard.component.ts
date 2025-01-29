import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone:true,
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  studentList: any[] = [];  // Initialize the array to store student data
 
  constructor(private http: HttpClient ,  private router: Router) {}  // Inject HttpClient into the constructor
 
  ngOnInit(): void {
    this.fetchStudentData();  // Call fetch method when component initializes
  }
 
  // Method to fetch data from the backend
  fetchStudentData() : void{

// yaha se likha ha
    const token = localStorage.getItem('access_token'); // Extract token from localStorage
    if (!token) {
      console.error('No token found!');
      this.router.navigate(['/login']); 
      return;
    }  // yaha tk
 
    

 

    this.http.get<any[]>('http://localhost:3000/auth/dashboard' , {headers:{
      Authorization : `Bearer ${token}`,
    }})  // Replace with your API endpoint
      .subscribe(
        (data) => {
          this.studentList = data;  // Assign fetched data to the studentList arraydata
          console.log(this.studentList)
        },
        (error) => {
          console.error('Error fetching data:', error);
          this.router.navigate(['/login']); // ye b token ka ha 
        }
      );
  }
// yeh logout ka function hai
  logout(): void {
    localStorage.removeItem('access_token'); // Clear access token
    console.log('Logged out and token removed');
    this.router.navigate(['/login']).then(success => {
      if (success) {
        console.log('Navigated back to login');
      } else {
        console.error('Navigation to login failed');
      }
    });
  }//yaha pe

}