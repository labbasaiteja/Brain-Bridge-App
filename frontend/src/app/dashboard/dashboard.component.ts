import { Component,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface Posting {
  id: number;
  title: string;
  description: string;
  domain: string;
  deadline: string;
  applicants: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private router: Router) {}
  
  @HostListener('document:keydown.escape', ['$event'])
handleEscapeKey(event: KeyboardEvent) {
  if (this.selectedPosting) {
    this.closeModal();
  }
}

  postings: Posting[] = [
    {
      id: 1,
      title: 'AI Research Assistant',
      description:`Assist in developing ML models. 10 hrs/week. Pay: $20/hr.
      Duration: Until Dec 2025. Required: Python, TensorFlow.
      Good to have: PyTorch, research experience.`,
      domain: 'Computer Science',
      deadline: '2025-06-30',
      applicants: 2
    },
    {
      id: 2,
      title: 'Data Collection Intern',
      description:`Support survey-based data collection. 5 hrs/week. $15/hr.
      Role ends Oct 2025. Required: Excel, attention to detail.
      Good to have: data cleaning knowledge.`,
      domain: 'Data Science',
      deadline: '2025-07-15',
      applicants: 1
    },
    {
      id: 3,
      title: 'UX Design Assistant',
      description: 'temp details',
      domain: 'Human-Computer Interaction',
      deadline: '2025-08-01',
      applicants: 1
    },
    {
      id: 4,
      title: 'Machine Learning Analyst',
      description: `temp details',`,
      domain: 'Artificial Intelligence',
      deadline: '2025-06-20',
      applicants: 0
    }
  ];

  goToApplicants(postingId: number) {
    this.router.navigate(['/view-applicants'], {
      queryParams: { postingId }
    });
  }

  // 🔁 Real-time integration logic (replace hardcoded list):
  // ngOnInit(): void {
  //   this.apiService.getPostings().subscribe((data: Posting[]) => {
  //     this.postings = data;
  //   });
  // }

  selectedPosting: Posting | null = null;

openModal(posting: Posting) {
  this.selectedPosting = posting;
}

closeModal() {
  this.selectedPosting = null;
}

editPosting(posting: Posting) {
  console.log('Edit clicked for:', posting.title);
}

withdrawPosting(posting: Posting) {
  console.log('Withdraw clicked for:', posting.title);
}

}

