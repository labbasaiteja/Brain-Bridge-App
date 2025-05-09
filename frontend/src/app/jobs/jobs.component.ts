import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']  // ✅ Fix: use styleUrls (plural)
})
export class JobsComponent {
  jobs = [
    {
      title: 'AI Research Assistant',
      domain: 'Computer Science',
      deadline: 'June 30 2025',
      status: 'Open',
      description: 'Assist in AI research and experimentation.'
    },
    {
      title: 'Data Collection Intern',
      domain: 'Data Science',
      deadline: 'Jul 15 2025',
      status: 'Closed',
      description: 'Support survey data collection for research studies.'
    }
  ];

  selectedJob: any = null;

  openModal(job: any) {
    this.selectedJob = job;
  }

  closeModal() {
    this.selectedJob = null;
  }
}
