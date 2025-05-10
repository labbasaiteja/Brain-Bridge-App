import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


interface Application {
  id: number;
  title: string;
  domain: string;
  deadline: string;
  description: string;
  motivation: string;
  resumeUrl: string;
  status: 'Applied' | 'Accepted' | 'Rejected';
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit{
  selectedApplication: Application | null = null;

  applications: Application[] = [];

  constructor(private router: Router, private auth: AuthService,) {}


  ngOnInit(): void {
      this.loadApplications();
  }
  loadApplications(){
    this.auth.getApplications().subscribe({
      next:(apps:any)=>{
        console.log(apps)
        this.applications = apps.map((app:any)=>({
          id: app._id,
          title: app.assistantship.title,
          domain: app.assistantship.domain,
          deadline: new Date(app.assistantship.endTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          description: app.assistantship.description,
          motivation: app.motivation,
          resumeUrl: "http://localhost:5000"+app.resumePath,
          status: app.status
        }))
      },
      error:(err)=>{
        console.error('Failed to load applications:', err);
      }
    })
  }

  openModal(app: Application) {
    this.selectedApplication = app;
  }

  closeModal() {
    this.selectedApplication = null;
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closeModal();
  }

  onDashboard() {
    this.router.navigate(['/student-dashboard']);
  }

  onProfile() {
    this.router.navigate(['/student-profile']);
  }

  onViewAssistantships() {
    this.router.navigate(['/view-assistantships']);
  }

  onLogout() {
    // Clear session and redirect to login
    this.router.navigate(['/login']);
  }
}
