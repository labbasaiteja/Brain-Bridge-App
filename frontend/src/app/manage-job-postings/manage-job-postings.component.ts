import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-manage-job-postings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-job-postings.component.html',
  styleUrls: ['./manage-job-postings.component.css']
})
export class ManageJobPostingsComponent {
  job = {
    title: '',
    description: '',
    domain: '',
    deadline: ''
  };

  isEditMode = false;
  showConfirmModal = false;
  showSuccessMessage = false;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const nav = this.router.getCurrentNavigation();
      const state = nav?.extras?.state;

      if (state && state['posting']) {
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
    this.showSuccessMessage = true;

    // 🔁 For backend integration:
    // if (this.isEditMode) {
    //   this.api.updatePosting(this.job).subscribe(...)
    // } else {
    //   this.api.createPosting(this.job).subscribe(...)
    // }

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 3000);
  }

  deleteJob() {
    this.router.navigate(['/dashboard']);
  }
}
