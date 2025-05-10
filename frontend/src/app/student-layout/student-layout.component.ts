import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.css']
})
export class StudentLayoutComponent {
  isSidebarExpanded: boolean = false;
  showLogoutModal: boolean = false;
  studentName: string = 'Mike Ross'; // 🔁 Replace with dynamic logic if needed

  constructor(private router: Router) {}

  // Sidebar expand on hover
  openSidebar() {
    this.isSidebarExpanded = true;
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
    localStorage.removeItem('token'); // 🔁 Adjust if you have session handling
    this.showLogoutModal = false;
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }
}
