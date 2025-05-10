import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-manage-job-postings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-job-postings.component.html',
  styleUrls: ['./manage-job-postings.component.css']
})
export class ManageJobPostingsComponent {
  job: {
    _id?: string;
    title: string;
    description: string;
    domain: string;
    deadline: string;
  } = {
    title: '',
    description: '',
    domain: '',
    deadline: ''
  };

  isEditMode = false;
  showConfirmModal = false;
  showSuccessMessage = false;
  isBrowser = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const nav = this.router.getCurrentNavigation();
      const state = nav?.extras?.state;
      if (state?.['posting']) {
        this.isEditMode = true;
        this.job = { ...state['posting'] };
      }
    }
  }

  confirmSubmit() {
    this.showConfirmModal = true;
  }

  cancelSubmit() {
    this.showConfirmModal = false;
  }

  onSubmitConfirmed() {
    this.showConfirmModal = false;

    const endTime = this.job.deadline
      ? new Date(`${this.job.deadline}T23:59:59`).toISOString()
      : '';

    const payload = {
      title: this.job.title.trim(),
      description: this.job.description.trim(),
      domain: this.job.domain.trim(),
      endTime
    };

    console.log('Payload being sent:', payload);

    if (this.isEditMode && this.job._id) {
      this.auth.updatePosting(this.job._id, payload).subscribe({
        next: () => this.handleSuccess('updated'),
        error: (err) => {
          console.error('Update failed:', err);
          alert('Update failed: ' + (err.error?.msg || err.message || 'Unknown error'));
        }
      });
    } else {
      this.auth.createPosting(payload).subscribe({
        next: () => this.handleSuccess('created'),
        error: (err) => {
          console.error('Creation failed:', err);
          alert('Creation failed: ' + (err.error?.msg || err.message || 'Unknown error'));
        }
      });
    }
  }

  handleSuccess(action: 'created' | 'updated') {
    this.showSuccessMessage = true;
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

  deleteJob() {
    if (this.isEditMode && this.job._id) {
      this.auth.deletePosting(this.job._id).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Delete failed: ' + (err.error?.msg || err.message || 'Unknown error'));
        }
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
