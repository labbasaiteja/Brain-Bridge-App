import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.css']
})
export class StudentLayoutComponent implements OnInit{
  isSidebarExpanded = false;
    studentName = '';
  showLogoutModal = false;
  constructor(private router: Router, private http: HttpClient) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any>('https://brain-bridge-app-erc6.onrender.com/api/user/', { headers }).subscribe({
        next: (res) => {
          this.studentName = res.name;  
        },
        error: (err) => {
          console.error('Failed to fetch user info:', err);
        }
      });
    }
  }


  // Sidebar expand on hover
  openSidebar() {
    this.isSidebarExpanded = true;
  }
 logout() {
  localStorage.removeItem('token');
  this.router.navigateByUrl('/login').then(() => {
   
    window.location.replace('/login');
  });
}
  // Sidebar collapse on mouse leave
  closeSidebar() {
    this.isSidebarExpanded = false;
  }

  onDashboard() {
    this.router.navigate(['/student-dashboard']);
  }

  onProfile() {
    this.router.navigate(['/student-profile']);
  }

  onJobs() {
    this.router.navigate(['/jobs']);
  }

  onLogout() {
    this.showLogoutModal = true;
  }

  confirmLogout() {
    localStorage.removeItem('token'); 
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
