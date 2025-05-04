import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Assistantship {
  id: number;
  title: string;
}

interface Applicant {
  name: string;
  department: string;
  gpa: number;
  year: string;
}

@Component({
  selector: 'app-view-applicants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-applicants.component.html',
  styleUrls: ['./view-applicants.component.css']
})
export class ViewApplicantsComponent {
  selectedPostingId: number | null = null;

  assistantships: Assistantship[] = [
    { id: 1, title: 'AI Research Assistant' },
    { id: 2, title: 'UX Design Assistant' },
    { id: 3, title: 'Data Collection Intern' }
  ];

  applicantsMap: { [key: number]: Applicant[] } = {
    1: [
      { name: 'Alice Johnson', department: 'CS', gpa: 3.9, year: 'Graduate' },
      { name: 'Bob Smith', department: 'AI', gpa: 3.8, year: 'Senior' }
    ],
    2: [
      { name: 'Carla Chen', department: 'HCI', gpa: 3.7, year: 'Junior' }
    ],
    3: [
      { name: 'David Kim', department: 'Data Science', gpa: 3.6, year: 'Graduate' }
    ]
  };

  get applicants(): Applicant[] {
    return this.selectedPostingId ? this.applicantsMap[this.selectedPostingId] || [] : [];
  }

  // 🔁 For real API:
  // ngOnInit(): void {
  //   this.apiService.getPostings().subscribe(data => this.assistantships = data);
  //   this.apiService.getApplicants(postingId).subscribe(data => this.applicantsMap[postingId] = data);
  // }
}
