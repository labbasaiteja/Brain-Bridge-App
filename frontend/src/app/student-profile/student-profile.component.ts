import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit{

  student = {
    name: '',
    email: '',
    major: '',
    imageUrl: ''
  };

  constructor(private router: Router, private http: HttpClient ) {}

  isSidebarOpen = true;
  isEditMode = false;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<any>('https://brain-bridge-app-erc6.onrender.com/api/user/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe({
        next: (res) => {
          console.log('API Response:', res);
          this.student.name = res.name;
          this.student.email = res.email;
          this.student.major = res.major;
        },
        error: (err) => {
          console.error('Failed to fetch profile:', err);
          // Optionally redirect to login or show error
        }
      });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goBack() {
    this.router.navigate(['/student-dashboard']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  toggleEdit() {
    this.isEditMode =!this.isEditMode;
  }

  submitChanges() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.put<any>('https://brain-bridge-app-erc6.onrender.com/api/user/', {
        name: this.student.name,
        email: this.student.email,
        major: this.student.major
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          alert('Profile updated and saved!');
          this.isEditMode = false;
        },
        error: (err) => {
          console.error('Failed to update profile:', err);
          alert('Failed to save changes. Try again.');
        }
      });
    }
  }
}
