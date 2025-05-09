import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Applicant {
  name: string;
  department: string;
  gpa: number;
  year: string;
  motivation: string;
  resumeUrl: string;
  coverLetterUrl: string;
  status?: 'accepted' | 'rejected' | null; // ✅ Fix: define this
}

interface Assistantship {
  id: number;
  title: string;
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
  selectedApplicant: Applicant | null = null; // ✅ Fix: define this

  constructor(private route: ActivatedRoute) {}

  assistantships: Assistantship[] = [
    { id: 1, title: 'AI Research Assistant' },
    { id: 3, title: 'UX Design Assistant' },
    { id: 2, title: 'Data Collection Intern' }
  ];

  applicantsMap: { [key: number]: Applicant[] } = {
    1: [
      { 
        name: 'Alice Johnson',
        department: 'CS',
        gpa: 3.9,
        year: 'Graduate',
        motivation: 'I am passionate about AI and want to assist in cutting-edge research.',
        resumeUrl: 'assets/test.pdf',
        coverLetterUrl: 'assets/sample-cover-alice.pdf'
      },
      {
        name: 'Bob Smith',
        department: 'AI',
        gpa: 3.8,
        year: 'Senior',
        motivation: 'Looking to deepen my experience in ML before grad school.',
        resumeUrl: 'assets/test.pdf',
        coverLetterUrl: 'assets/sample-cover-bob.pdf'
      }
    ],
    3: [
      {
        name: 'Carla Chen',
        department: 'HCI',
        gpa: 3.7,
        year: 'Junior',
        motivation: 'Interested in user-focused research and design systems.',
        resumeUrl: 'assets/test.pdf',
        coverLetterUrl: 'assets/sample-cover-carla.pdf'
      }
    ],
    2: [
      {
        name: 'David Kim',
        department: 'Data Science',
        gpa: 3.6,
        year: 'Graduate',
        motivation: 'Looking to gain experience in handling large-scale real-world datasets.',
        resumeUrl: 'assets/test.pdf',
        coverLetterUrl: 'assets/sample-cover-david.pdf'
      }
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

  openModal(applicant: Applicant): void {
    this.selectedApplicant = applicant;
  }

  closeModal(): void {
    this.selectedApplicant = null;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.selectedApplicant) {
      this.closeModal();
    }
  }
  statusModalApplicant: Applicant | null = null;
  openStatusModal(applicant: Applicant) {
    this.statusModalApplicant = applicant;
  }
  
  closeStatusModal() {
    this.statusModalApplicant = null;
  }
  
  updateStatus(applicant: Applicant, status: 'accepted' | 'rejected') {
    const confirmed = status === 'rejected' ? confirm('Are you sure you want to decline this applicant?') : true;
  
    if (confirmed) {
      applicant.status = status;
      this.closeStatusModal();
    }
  }
  
  
}
