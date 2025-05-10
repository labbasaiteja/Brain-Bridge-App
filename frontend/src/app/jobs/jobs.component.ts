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
  styleUrls: ['./jobs.component.css']  // ✅ Fix: use styleUrls (plural)
})
export class JobsComponent implements OnInit {
  jobs: any[] = [];
  selectedJob: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:5000/api/assistantships/student', { headers })
      .subscribe({
        next: (res) => {
          this.jobs = res.data.map((job: any) => {
            const deadline = new Date(job.endTime);
            const isExpired = deadline < new Date();
            return {
              ...job,
              deadlineFormatted: deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: isExpired ? 'closed' : job.status
            };
          });
        },
        error: (err) => console.error('Error loading jobs', err)
      });
  }



  openModal(job: any) {
    this.selectedJob = job;
  }

  closeModal() {
    this.selectedJob = null;
  }
}
