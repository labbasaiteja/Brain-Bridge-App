import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

interface Applicant {
  studentName: string;
  studentEmail: string;
  motivation: string;
  status: 'accepted' | 'rejected' | null;
  submittedAt: string;
  applicationId: string;
  resume?: string;
}

interface Assistantship {
  _id: string;
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
  assistantships: Assistantship[] = [];
  selectedPostingId: string | null = null;
  applicants: Applicant[] = [];
  selectedApplicant: Applicant | null = null;
  statusModalApplicant: Applicant | null = null;
  isBrowser = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.fetchAssistantships();
      this.route.queryParams.subscribe(params => {
        const id = params['postingId'];
        if (id) {
          this.selectedPostingId = id;
          this.loadApplicants();
        }
      });
    }
  }

  fetchAssistantships() {
    this.auth.getProfessorPostings().subscribe({
      next: (res) => {
        this.assistantships = res.data;
      },
      error: (err) => {
        console.error('Failed to load assistantships:', err);
      }
    });
  }

  loadApplicants() {
    if (!this.selectedPostingId) return;
    this.auth.getApplicants(this.selectedPostingId).subscribe({
      next: (res) => {
        this.applicants = res.applications.map((app: any) => ({
          studentName: app.studentName,
          studentEmail: app.studentEmail,
          motivation: app.motivation,
          status: app.status,
          submittedAt: app.submittedAt,
          applicationId: app.applicationId,
          resume: app.resumePath ? `http://localhost:5000${app.resumePath}` : null
        }));
      },
      error: (err) => {
        console.error('Failed to load applicants:', err);
        this.applicants = [];
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
    if (this.statusModalApplicant) {
      this.closeStatusModal();
    }
  }

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
      // Optional: Add backend update call here in the future
    }
  }
}
