import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule,RouterModule ],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.css']
})
export class StudentLayoutComponent {
    isSidebarExpanded = false;
    studentName = "Mike Ross";
    
    constructor(private router: Router) {}
    openSidebar() {
      this.isSidebarExpanded = true;
    }
  
    closeSidebar() {
      this.isSidebarExpanded = false;
    }
  
    onProfile() {
      console.log("Profile clicked");
    }
  
    onMyApplications() {
      console.log("My Applications clicked");
    }
  
    onJobs() {
      console.log("Jobs clicked");
    }
  
    showLogoutModal = false;
  
  onLogout() {
    this.showLogoutModal = true;
  }
  
  confirmLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.showLogoutModal = false;
  }
  
  cancelLogout() {
    this.showLogoutModal = false;
  }
      

  
}

