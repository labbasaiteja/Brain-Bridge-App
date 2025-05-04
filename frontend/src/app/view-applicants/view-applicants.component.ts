import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
export class ViewApplicantsComponent implements OnInit {
  selectedPostingId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  assistantships: Assistantship[] = [
    { id: 1, title: 'AI Research Assistant' },
    { id: 3, title: 'UX Design Assistant' },
    { id: 2, title: 'Data Collection Intern' }
  ];

  applicantsMap: { [key: number]: Applicant[] } = {
    1: [
      { name: 'Alice Johnson', department: 'CS', gpa: 3.9, year: 'Graduate' },
      { name: 'Bob Smith', department: 'AI', gpa: 3.8, year: 'Senior' }
    ],
    3: [
      { name: 'Carla Chen', department: 'HCI', gpa: 3.7, year: 'Junior' }
    ],
    2: [
      { name: 'David Kim', department: 'Data Science', gpa: 3.6, year: 'Graduate' }
    ]
  };

  get applicants(): Applicant[] {
    return this.selectedPostingId ? this.applicantsMap[this.selectedPostingId] || [] : [];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = +params['postingId'];
      if (id && this.assistantships.some(a => a.id === id)) {
        this.selectedPostingId = id;
      }
    });
  }
}
