import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarExpanded = false;
  professorName = "Professor John Doe";

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

  onLogout() {
    console.log("Logout clicked");
  }
}
