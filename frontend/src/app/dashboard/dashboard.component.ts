import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Posting {
  title: string;
  domain: string;
  deadline: string;
  applicants: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  postings: Posting[] = [
    { title: 'AI Research Assistant', domain: 'Computer Science', deadline: '2025-06-30', applicants: 12 },
    { title: 'Data Collection Intern', domain: 'Data Science', deadline: '2025-07-15', applicants: 7 }
  ];
  
   // Toggle variable for sidebar visibility
   isSidebarOpen: boolean = false;
   professorName: string = "Professor John Doe"; // Replace with dynamic data if needed
 
   // Toggle the sidebar open/close state
   toggleSidebar() {
     this.isSidebarOpen = !this.isSidebarOpen;
   }
 
   // Stub for logout, add real logic here
   logout() {
     console.log("Logging out...");
     // Implement a logout service or redirection here
   }
 
 // constructor() { }

  //ngOnInit(): void {
    // Initialization logic here
  //}

  // Add any additional methods or properties needed for the dashboard component

}
