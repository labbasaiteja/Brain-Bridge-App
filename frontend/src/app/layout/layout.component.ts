import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule  ,Router} from '@angular/router'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,RouterModule ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarExpanded = false;
  professorName = "Professor John Doe";
  
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

  onManageJobPostings() {
    console.log("Manage Job Postings clicked");
  }

  onViewApplicants() {
    console.log("View Applicants clicked");
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

