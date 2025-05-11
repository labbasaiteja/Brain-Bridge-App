import { CommonModule, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']  
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];
  selectedJob: any = null;
  resumeFile: File | null = null;
  motivation: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    //const token = localStorage.getItem('token');
    let token: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
     token = window.localStorage.getItem('token');
}
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('https://brain-bridge-app-erc6.onrender.com/api/assistantships/student', { headers })
      .subscribe({
        next: (res) => {
          this.jobs = res.data.map((job: any) => {
            const deadline = new Date(job.endTime);
            const createdAt = new Date(job.createdAt);
            const isExpired = deadline < new Date();
            return {
              ...job,
              deadlineFormatted: deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              createdFormatted: createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: isExpired ? 'closed' : job.status
            };
          });
        },
        error: (err) => console.error('Error loading jobs', err)
      });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.resumeFile = fileInput.files[0];
    }
  }

   showSuccessPopup = false;
   successMessage = '';
  apply() {
    if (!this.selectedJob || !this.resumeFile || !this.motivation) {
      alert('Please select a resume and enter motivation.');
      return;
    }

    const formData = new FormData();
    formData.append('assistantshipId', this.selectedJob._id);
    formData.append('motivation', this.motivation);
    formData.append('resume', this.resumeFile);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.post<any>('https://brain-bridge-app-erc6.onrender.com/api/applications/', formData, { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Application submitted successfully!';
          this.showSuccessPopup = true;
          this.closeModal();
          this.resumeFile = null;
          this.motivation = '';

           setTimeout(() => this.showSuccessPopup = false, 3000);
        },
        error: (err) => {
          console.error('Error submitting application', err);
          alert(err.error?.msg ?? 'Application failed.');
        }
      });
}


  openModal(job: any) {
    this.selectedJob = job;
  }

  closeModal() {
    this.selectedJob = null;
  }
}
