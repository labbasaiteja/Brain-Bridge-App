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

  applications: Application[] = [
    {
      id: 1,
      title: 'AI Research Assistant',
      domain: 'Computer Science',
      deadline: '2025-06-30',
      description: `Assist in developing ML models. 10 hrs/week. Pay: $20/hr.\nDuration: Until Dec 2025.\nRequired: Python, TensorFlow.\nGood to have: PyTorch, research experience.`,
      motivation: 'I am excited about AI research and want to contribute to real-world projects.',
      resumeUrl: 'assets/student-resume.pdf',
      status: 'Applied'
    },
    {
      id: 2,
      title: 'UX Design Assistant',
      domain: 'Human-Computer Interaction',
      deadline: '2025-08-01',
      description: 'temp details',
      motivation: 'Strong interest in improving user experience through design.',
      resumeUrl: 'assets/student-resume.pdf',
      status: 'Accepted'
    }
  ];

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
          deadline: app.assistantship.endTime,
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
