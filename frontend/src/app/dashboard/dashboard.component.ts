import { Component } from '@angular/core';
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
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  postings: Posting[] = [
    {
      title: 'AI Research Assistant',
      domain: 'Computer Science',
      deadline: '2025-06-30',
      applicants: 12
    },
    {
      title: 'Data Collection Intern',
      domain: 'Data Science',
      deadline: '2025-07-15',
      applicants: 7
    },
    {
      title: 'UX Design Assistant',
      domain: 'Human-Computer Interaction',
      deadline: '2025-08-01',
      applicants: 5
    },
    {
      title: 'Machine Learning Analyst',
      domain: 'Artificial Intelligence',
      deadline: '2025-06-20',
      applicants: 9
    }
  ];

  // 🔁 Real-time integration logic (replace hardcoded list):
  // ngOnInit(): void {
  //   this.apiService.getPostings().subscribe((data: Posting[]) => {
  //     this.postings = data;
  //   });
  // }
}
