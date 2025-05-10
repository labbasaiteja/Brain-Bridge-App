import { Component, HostListener, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface Posting {
  _id: string;
  title: string;
  description?: string;
  domain: string;
  endTime: string;
  status: string;
  createdAt: string;
  applicantCount: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  postings: Posting[] = [];
  selectedPosting: Posting | null = null;
  isBrowser = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.fetchPostings(() => {
        const state = history.state;
        if (state?.newPosting?._id) {
          const exists = this.postings.some(p => p._id === state.newPosting._id);
          if (!exists) {
            const newPost: Posting = {
              _id: state.newPosting._id,
              title: state.newPosting.title,
              domain: state.newPosting.domain,
              description: state.newPosting.description || '',
              endTime: state.newPosting.endTime,
              status: state.newPosting.status || 'open',
              createdAt: new Date().toISOString(),
              applicantCount: 0
            };
            this.postings.unshift(newPost);
          }
          history.replaceState({}, '');
        }
      });
    }
  }

  fetchPostings(callback?: () => void) {
    this.auth.getProfessorPostings().subscribe({
      next: (res) => {
        this.postings = res.data.map((item: any) => ({
          _id: item._id,
          title: item.title,
          domain: item.domain,
          description: item.description || '',
          endTime: item.endTime,
          status: item.status || 'open',
          createdAt: item.createdAt,
          applicantCount: item.applicantCount || 0
        }));
        if (callback) callback();
      },
      error: (err) => {
        console.error('Failed to fetch postings:', err);
      }
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    if (this.selectedPosting) {
      this.closeModal();
    }
  }

  openModal(posting: Posting) {
    this.selectedPosting = posting;
  }

  closeModal() {
    this.selectedPosting = null;
  }

  editPosting(posting: Posting) {
    this.router.navigate(['/manage-job-postings'], {
      state: { posting }
    });
  }

  goToApplicants(postingId: string) {
    this.router.navigate(['/view-applicants'], {
      queryParams: { postingId }
    });
  }

  withdrawPosting(posting: Posting) {
    const confirmed = confirm(`Are you sure you want to withdraw "${posting.title}"?`);
    if (!confirmed) return;

    this.auth.deletePosting(posting._id).subscribe({
      next: () => {
        this.postings = this.postings.filter(p => p._id !== posting._id);
        this.closeModal();
        alert(`Assistantship "${posting.title}" withdrawn.`);
      },
      error: (err) => {
        console.error(err);
        alert('Withdraw failed: ' + (err.error?.msg || err.message));
      }
    });
  }
}
