import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
export class StudentDashboardComponent {
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

  constructor(private router: Router) {}

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
