import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-professor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.css']
})

export class ProfessorProfileComponent implements OnInit{

  professor = {
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
      this.http.get<any>('http://localhost:5000/api/user/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe({
        next: (res) => {
          console.log('API Response:', res);
          this.professor.name = res.name;
          this.professor.email = res.email;
          this.professor.major = res.major;
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
    this.router.navigate(['/dashboard']);
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
      this.http.put<any>('http://localhost:5000/api/user/', {
        name: this.professor.name,
        email: this.professor.email,
        major: this.professor.major
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
